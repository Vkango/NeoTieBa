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

<script setup>
import { ref, onUnmounted, markRaw, nextTick, computed } from 'vue';
import RippleButton from './RippleButton.vue';
const notifications = ref([]);
const timers = ref({});
const hiddenNotifications = ref([]);
const dragging = ref(false);
const dragStartX = ref(0);
const currentDragId = ref(null);
const isClosing = ref(false);
const dragStartTime = ref(0);
const isDragging = ref(false);
const dragThreshold = 5;
let deltaX = 0;
let notificationCounter = 0;
const displayedNotifications = computed(() =>
  notifications.value.filter(item => item && item.visible && !item.hidden)
);
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const handleMouseUp = (event, id) => {
  if (event.target.closest('.notification-actions')) {
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
const addNotification = async (title, source, component, clickHandler, props = {}, duration = 5000) => {
  while (isClosing.value) {
    await delay(100);
  }
  console.log(title, source, component, clickHandler, props, duration)
  const id = `${Date.now()}-${notificationCounter++}`;
  const notification = {
    id,
    source,
    title,
    component: markRaw(component),
    props,
    duration,
    visible: false,
    hidden: false,
    timestamp: Date.now(),
    click: clickHandler
  };

  notifications.value.unshift(notification);
  notification.visible = true;

  if (duration > 0) {
    startTimer(id, duration);
  }
};

const hideNotification = async (id) => {
  const index = notifications.value.findIndex(item => item.id === id);
  if (index === -1) return;

  isClosing.value = true;
  notifications.value[index].visible = false;
  await delay(300);
  const notification = { ...notifications.value[index] };
  notification.hidden = true;
  hiddenNotifications.value.push(notification);
  notifications.value.splice(index, 1);
  isClosing.value = false;
};

const deleteNotification = async (id) => {
  const visibleIndex = notifications.value.findIndex(item => item.id === id);
  if (visibleIndex !== -1) {
    notifications.value.splice(visibleIndex, 1);
  }
  const hiddenIndex = hiddenNotifications.value.findIndex(item => item.id === id);
  if (hiddenIndex !== -1) {
    hiddenNotifications.value.splice(hiddenIndex, 1);
  }
};


const restoreNotification = (id) => {
  const index = hiddenNotifications.value.findIndex(item => item.id === id);
  if (index === -1) return;

  const notification = { ...hiddenNotifications.value[index] };
  notification.hidden = false;
  notification.visible = true;
  hiddenNotifications.value.splice(index, 1);
  notifications.value.unshift(notification);
  nextTick(() => {
    const notificationElement = document.querySelector(`.notification[data-id="${id}"]`);
    if (notificationElement) {
      dragging.value = false;
      dragStartX.value = 0;
      currentDragId.value = null;
      deltaX = 0;
    }
  });
};
const close = async (id) => {
  const index = notifications.value.findIndex(item => item.id === id);
  if (index === -1) return;

  isClosing.value = true;
  notifications.value[index].visible = false;
  await delay(300);
  notifications.value.splice(index, 1);
  isClosing.value = false;
};

const startTimer = (id, duration) => {
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

const pauseTimer = (id) => {
  if (timers.value[id]) {
    clearTimeout(timers.value[id]);
    delete timers.value[id];
  }
};

const startDrag = (event, id) => {
  if (event.target.closest('.notification-actions')) {
    return;
  }

  dragStartTime.value = Date.now();
  dragStartX.value = event.clientX;
  currentDragId.value = id;
  isDragging.value = false;
  deltaX = 0;

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
};

const onDrag = (event) => {
  if (!currentDragId.value) return;

  const dragDistance = Math.abs(event.clientX - dragStartX.value);
  if (dragDistance > dragThreshold) {
    isDragging.value = true;
    deltaX = event.clientX - dragStartX.value;
    const notificationElement = document.querySelector(`.notification[data-id="${currentDragId.value}"]`);
    if (notificationElement) {
      notificationElement.style.transition = 'none';
      notificationElement.style.transform = `translateX(${deltaX}px)`;
      notificationElement.style.opacity = `${1 - Math.abs(deltaX / 100)}`;
    }
  }
};

const endDrag = () => {
  if (currentDragId.value === null) return;
  const notificationElement = document.querySelector(`.notification[data-id="${currentDragId.value}"]`);
  if (notificationElement) {
    if (Math.abs(deltaX) > 100) {
      close(currentDragId.value);
    } else {
      notificationElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      notificationElement.style.transform = `translateX(0px)`;
      notificationElement.style.opacity = 1;
    }
  }

  dragging.value = false;
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