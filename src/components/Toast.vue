<template>
  <transition name="fade">
    <div v-if="visible" class="toast" :class="`toast`" @mouseenter="pauseTimer" @mouseleave="startTimer">
      <div class="toast-content">
        <div class="toast-title">{{ title }}</div>
      </div>

    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, defineProps, defineEmits } from 'vue';
const duration = ref('3000');
const title = ref('');
const visible = ref(false);
function showToast(set_title, set_duration) {
  title.value = set_title;
  duration.value = set_duration;
  visible.value = true;
  startTimer();
}

const emit = defineEmits(['closed']);
let timer = null;

const close = () => {
  visible.value = false;
  emit('closed');
};

const startTimer = () => {
  if (timer) clearTimeout(timer);
  if (duration.value > 0) {
    timer = setTimeout(close, duration.value);
  }
};

const pauseTimer = () => {
  if (timer) clearTimeout(timer);
};

watch(visible, (newVal) => {
  if (newVal) {
    startTimer();
  }
});


onUnmounted(() => {
  if (timer) clearTimeout(timer);
});

defineExpose({
  showToast,
})
</script>

<style scoped>
.toast {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 2000;
  bottom: 15px;
  left: 0px;
  width: 100%;
}

.toast-content {
  padding: 10px 15px;
  background-color: rgba(var(--background-color), 0.5);
  backdrop-filter: blur(var(--blur-value));
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(var(--background-color), 0.1);
  display: flex;
  gap: 10px;
  align-self: center;
  align-items: center;
  font-size: 14px;
}

.toast-title {
  font-weight: bold;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, bottom 0.3s ease;

}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  bottom: 5px;
}
</style>