<script setup>
import { defineEmits, onActivated, ref, onMounted } from 'vue';
const emit = defineEmits(['yscroll'])
const scrollContainer = ref(null);
const scrollPosition = ref(0);
function handleScroll(event) {
  const target = event.target;
  scrollPosition.value = target.scrollTop;
  emit('yscroll', target);
}
const restoreScrollPosition = () => {
  if (scrollContainer.value && scrollPosition.value) {
    scrollContainer.value.scrollTop = scrollPosition.value;
  }
}
onActivated(() => {
  restoreScrollPosition();
});
onMounted(() => {
  const savedPosition = sessionStorage.getItem('scrollPosition');
  if (savedPosition) {
    scrollPosition.value = parseInt(savedPosition, 10);
  }
});
</script>
<template>
  <div ref="scrollContainer" class="component-container" @scroll="handleScroll">
    <slot></slot>
  </div>
</template>
<style lang="css" scoped>
.component-container {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.02);
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 5px;
}
</style>