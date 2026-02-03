<template>
  <div class="notification-container">
    <transition-group name="fade-notify" tag="div" class="notification-list">
      <div v-for="item in displayedNotifications" :key="item.id" :data-id="item.id" class="notification"
        @mouseenter="pauseTimer(item.id)" @mouseleave="startTimer(item.id, item.duration)"
        @mousedown="startDrag($event, item.id)" @mouseup="handleMouseUp($event, item.id)">
        <RippleButton class="notification-content">
          <div class="notification-source" v-html="item.source"></div>
          <div class="notification-title" v-html="item.title"></div>
          <div class="notification-message">
            <component :is="item.component" v-bind="item.props"></component>
          </div>
          <div class="notification-actions">
            <button class="notification-hide" @mousedown.stop>
              <span class="material-symbols-outlined" @click.stop="hideNotification(item.id)" id="close"
                style="font-size: 12px;">visibility_off</span>
            </button>
            <button class="notification-close" @mousedown.stop>
              <span class="material-symbols-outlined" @click.stop="close(item.id)" id="close"
                style="font-size: 12px;">close</span>
            </button>
          </div>
        </RippleButton>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import type { NotificationItem } from '@/types/common';
import { ref, onUnmounted, markRaw, nextTick, computed, type Component } from 'vue';
import RippleButton from '#components/common/RippleButton.vue';

const notifications = ref<NotificationItem[]>([]);
const timers = ref<Record<string, ReturnType<typeof setTimeout>>>({});
const hiddenNotifications = ref<NotificationItem[]>([]);
const _dragging = ref(false);
const dragStartX = ref(0);
const currentDragId = ref<string | null>(null);
const isClosing = ref(false);
const _dragStartTime = ref(0);
const isDragging = ref(false);
const dragThreshold = 5;
let deltaX = 0;
let notificationCounter = 0;

const displayedNotifications = computed(() =>
  notifications.value.filter(item => item && item.visible && !item.hidden)
);

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const handleMouseUp = (event: MouseEvent, id: string): void => {
  if ((event.target as HTMLElement).closest('.notification-actions')) {
    return;
  }
  const dragDistance = Math.abs(deltaX);
  if (!isDragging.value && dragDistance < dragThreshold) {
    const notification = notifications.value.find(item => item.id === id);
    if (notification && notification.click) {
      notification.click();
    }
  }
  endDrag();
};

const addNotification = async (
  title: string,
  source: string,
  component: Component,
  clickHandler: (() => void) | null,
  props: Record<string, unknown> = {},
  duration = 5000
): Promise<void> => {
  while (isClosing.value) {
    await delay(100);
  }
  const id = `${Date.now()}-${notificationCounter++}`;
  const notification: NotificationItem = {
    id,
    source,
    title,
    component: markRaw(component),
    props,
    duration,
    visible: false,
    hidden: false,
    timestamp: Date.now(),
    click: clickHandler || undefined
  };

  notifications.value.unshift(notification);
  notification.visible = true;

  if (duration > 0) {
    startTimer(id, duration);
  }
};

const hideNotification = async (id: string): Promise<void> => {
  const index = notifications.value.findIndex(item => item.id === id);
  if (index === -1) return;

  isClosing.value = true;
  notifications.value[index].visible = false;
  await delay(300);
  const notification: NotificationItem = { ...notifications.value[index] };
  notification.hidden = true;
  hiddenNotifications.value.push(notification);
  notifications.value.splice(index, 1);
  isClosing.value = false;
};

const deleteNotification = async (id: string): Promise<void> => {
  const visibleIndex = notifications.value.findIndex(item => item.id === id);
  if (visibleIndex !== -1) {
    notifications.value.splice(visibleIndex, 1);
  }
  const hiddenIndex = hiddenNotifications.value.findIndex(item => item.id === id);
  if (hiddenIndex !== -1) {
    hiddenNotifications.value.splice(hiddenIndex, 1);
  }
};


const restoreNotification = (id: string): void => {
  const index = hiddenNotifications.value.findIndex(item => item.id === id);
  if (index === -1) return;

  const notification: NotificationItem = { ...hiddenNotifications.value[index] };
  notification.hidden = false;
  notification.visible = true;
  hiddenNotifications.value.splice(index, 1);
  notifications.value.unshift(notification);
  nextTick(() => {
    const notificationElement = document.querySelector(`.notification[data-id="${id}"]`);
    if (notificationElement) {
      _dragging.value = false;
      dragStartX.value = 0;
      currentDragId.value = null;
      deltaX = 0;
    }
  });
};

const close = async (id: string): Promise<void> => {
  const index = notifications.value.findIndex(item => item.id === id);
  if (index === -1) return;

  isClosing.value = true;
  notifications.value[index].visible = false;
  await delay(300);
  notifications.value.splice(index, 1);
  isClosing.value = false;
};

const startTimer = (id: string, duration: number): void => {
  if (timers.value[id]) {
    clearTimeout(timers.value[id]);
  }
  if (duration > 0) {
    timers.value[id] = setTimeout(() => {
      hideNotification(id);
      delete timers.value[id];
    }, duration);
  }
};

const pauseTimer = (id: string): void => {
  if (timers.value[id]) {
    clearTimeout(timers.value[id]);
    delete timers.value[id];
  }
};

const startDrag = (event: MouseEvent, id: string): void => {
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
    const notificationElement = document.querySelector(`.notification[data-id="${currentDragId.value}"]`) as HTMLElement | null;
    if (notificationElement) {
      notificationElement.style.transition = 'none';
      notificationElement.style.transform = `translateX(${deltaX}px)`;
      notificationElement.style.opacity = `${1 - Math.abs(deltaX / 100)}`;
    }
  }
};

const endDrag = (): void => {
  if (currentDragId.value === null) return;
  const notificationElement = document.querySelector(`.notification[data-id="${currentDragId.value}"]`) as HTMLElement | null;
  if (notificationElement) {
    if (Math.abs(deltaX) > 100) {
      close(currentDragId.value);
    } else {
      notificationElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      notificationElement.style.transform = `translateX(0px)`;
      notificationElement.style.opacity = '1';
    }
  }

  _dragging.value = false;
  currentDragId.value = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
};

onUnmounted(() => {
  for (const id in timers.value) {
    if (timers.value[id]) clearTimeout(timers.value[id]);
  }
});

defineExpose({
  addNotification,
  hideNotification,
  deleteNotification,
  restoreNotification,
  notifications,
  hiddenNotifications
});
</script>
<style scoped>
::-webkit-scrollbar {
  display: none;
}

.notification-list {
  position: relative;
}

.notification {
  position: relative;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

/* Transition animations */
.fade-notify-move,
.fade-notify-enter-active,
.fade-notify-leave-active {
  transition: all 0.3s ease;
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

::-webkit-scrollbar {
  display: none;
}
</style>