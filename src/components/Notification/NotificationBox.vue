<template>
  <div class="notification-box-container" v-if="tabsRef">
    <div class="notification-header"
      style="font-weight: bold; margin-left: 10px; margin-top: 10px; font-size: 15px; display: flex; align-content: center; gap: 10px">
      <span class="notification-count">全部通知 ({{ allNotifications.length }})</span>
      <RippleButton style="background-color: transparent; box-shadow: none; padding: 5px 10px;"
        @click="clearNotification()">
        <span class="material-symbols-outlined" style="font-size: 18px; align-self: center;">clear_all</span>
      </RippleButton>
      <RippleButton style="background-color: transparent; box-shadow: none; padding: 5px 10px;"
        @click="clearNotification()">
        <span class="material-symbols-outlined" style="font-size: 18px; align-self: center;">dark_mode</span>
      </RippleButton>
      <RippleButton style="background-color: transparent; box-shadow: none; padding: 5px 10px;"
        @click="clearNotification()">
        <span class="material-symbols-outlined" style="font-size: 18px; align-self: center;">footprint</span>
      </RippleButton>
    </div>
    <div class="notification-list">
      <transition-group name="fade-notify" tag="div">
        <div v-for="item in allNotifications" :key="item.id" :data-box-id="item.id" class="notification-box-item"
          @mousedown="startDrag($event, item.id)" @mouseup="handleMouseUp($event, item.id)">
          <RippleButton class="notification-content">
            <div class="notification-source" v-if="item.source"
              v-html="sanitize((item.source || '') + `<span> · ` + getTimeInterval(item.timestamp || Date.now()) + `</span>`)">
            </div>
            <div class="notification-title" v-html="sanitize(item.title || '')"></div>
            <div class="notification-message">
              <component :is="item.component" v-bind="item.props"></component>
            </div>
            <div class="notification-actions">
              <button class="notification-close" @mousedown.stop>
                <span class="material-symbols-outlined" @click.stop="deleteNotification(item.id)"
                  style="font-size: 12px;">close</span>
              </button>
            </div>
            <div class="notification-timestamp" v-if="item.timestamp">
            </div>
          </RippleButton>
        </div>
      </transition-group>

    </div>
    <Transition name="fade1">
      <div v-if="allNotifications.length === 0"
        style="position: absolute; top: calc(50% - 100px); left: 50%; transform: translate(-50%, -50%);">
        <div
          style="margin-top: 50px; border-radius: 5px; justify-content: center; text-align: center; display: flex; flex-direction: column; align-items: center; opacity: 0.5; gap: 10px;">
          <img src="/assets/inbox.svg" width="120px" style="margin-bottom: 20px;filter: invert(var(--invert));">
          <div style="font-size: 150%; font-weight: bold;">没有通知</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import RippleButton from '#components/common/RippleButton.vue';
import { getTimeInterval } from '@/utils/helper';
import { sanitize } from '@/utils/sanitizer';
import type { NotificationComponent, NotificationItem } from '@/components';

const dragStartX = ref(0);
const currentDragId = ref<string | number | null>(null);
const _dragStartTime = ref(0);
const isDragging = ref(false);
const dragThreshold = 5;
const timeUpdateInterval = ref<ReturnType<typeof setInterval> | null>(null);
const updateTrigger = ref(0);
let deltaX = 0;

const props = defineProps<{
  tabsRef: NotificationComponent | undefined;
}>();

const allNotifications = computed(() => {
  // 触发响应式更新
  void updateTrigger.value;

  const visible = (props.tabsRef?.notifications || []) as NotificationItem[];
  const hidden = (props.tabsRef?.hiddenNotifications || []) as NotificationItem[];
  return visible.concat(hidden).sort((a, b) => {
    const timeA = a.timestamp || Date.now();
    const timeB = b.timestamp || Date.now();
    return timeB - timeA;
  });
});

const startTimeUpdate = (): void => {
  timeUpdateInterval.value = setInterval(() => {
    updateTrigger.value++;
  }, 60000);
};

onMounted(() => {
  startTimeUpdate();
});

onUnmounted(() => {
  if (timeUpdateInterval.value) {
    clearInterval(timeUpdateInterval.value);
    timeUpdateInterval.value = null;
  }
});

const clearNotification = (): void => {
  const items = allNotifications.value.slice();
  items.forEach(element => {
    deleteNotification(element.id);
  });
};

const deleteNotification = (id: string | number): void => {
  if (props.tabsRef?.deleteNotification) {
    props.tabsRef.deleteNotification(id);
  }
};

const endDrag = (): void => {
  if (currentDragId.value === null) return;
  const currentId = currentDragId.value;
  const notificationElement = document.querySelector(`.notification-box-item[data-box-id="${currentId}"]`) as HTMLElement | null;

  if (notificationElement) {
    notificationElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    if (Math.abs(deltaX) > 100) {
      const direction = deltaX > 0 ? '100%' : '-100%';
      notificationElement.style.transform = `translateX(${direction})`;
      notificationElement.style.opacity = '0';
      setTimeout(() => {
        if (props.tabsRef?.deleteNotification) {
          props.tabsRef.deleteNotification(currentId);
        }
      }, 300);
    } else {
      notificationElement.style.transform = 'translateX(0)';
      notificationElement.style.opacity = '1';
    }
  }
  isDragging.value = false;
  currentDragId.value = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
  deltaX = 0;
};

const startDrag = (event: MouseEvent, id: string | number): void => {
  if ((event.target as HTMLElement).closest('.notification-actions')) {
    return;
  }
  _dragStartTime.value = Date.now();
  dragStartX.value = event.clientX;
  currentDragId.value = id;
  isDragging.value = false;
  deltaX = 0;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
};

const onDrag = (event: MouseEvent): void => {
  if (!currentDragId.value) return;
  const dragDistance = Math.abs(event.clientX - dragStartX.value);
  if (dragDistance > dragThreshold) {
    isDragging.value = true;
    deltaX = event.clientX - dragStartX.value;
    const notificationElement = document.querySelector(`.notification-box-item[data-box-id="${currentDragId.value}"]`) as HTMLElement | null;
    if (notificationElement) {
      notificationElement.style.transition = 'none';
      notificationElement.style.transform = `translateX(${deltaX}px)`;
      notificationElement.style.opacity = `${1 - Math.abs(deltaX / 100)}`;
    }
  }
};

const handleMouseUp = (event: MouseEvent, id: string | number): void => {
  if ((event.target as HTMLElement).closest('.notification-actions')) {
    return;
  }
  const dragDistance = Math.abs(deltaX);
  if (!isDragging.value && dragDistance < dragThreshold) {
    const notification = allNotifications.value.find(item => item.id === id);
    if (notification && notification.click) {
      notification.click();
    }
  }
  endDrag();
};

</script>

<style scoped>
.notification-box-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.notification-box-item {
  position: relative;
  margin-bottom: 8px;
  transition: all 0.3s ease-out;
  backface-visibility: hidden;
  will-change: transform, opacity;
  background-color: rgba(var(--background-color), 0.5);
  backdrop-filter: blur(var(--blur-value));
  border-radius: 4px;
  box-shadow: 0px 3px 10px -3px rgba(0, 0, 0, 0.6);
}

.notification-content {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
}

.notification-source {
  font-size: 12px;
  margin-bottom: 4px;
  opacity: 0.5;
  display: flex;
  align-items: center;
  gap: 5px;
}

.notification-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
  color: rgba(var(--text-color));
}

.notification-message {
  font-size: 14px;
  color: rgba(var(--text-color), 0.5);
  margin-top: 5px;
}

.notification-actions {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
}

.notification-hide,
.notification-close {
  border: none;
  background: none;
  padding: 8px;
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.3s;
}

.notification-hide:hover,
.notification-close:hover {
  opacity: 1;
}

/* Animation classes */
.fade-notify-move,
.fade-notify-enter-active,
.fade-notify-leave-active {
  transition: all 0.3s ease-out;
}

.fade-notify-enter-from,
.fade-notify-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.fade-notify-leave-active {
  position: absolute;
  width: 100%;
}

.hidden-notifications {
  background: rgba(var(--background-color), 0.5);
  backdrop-filter: blur(var(--blur-value));
  border-top: 1px solid rgba(var(--text-color), 0.1);
  padding: 12px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>