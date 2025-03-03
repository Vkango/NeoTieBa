<template>
    <div
      class="title-bar"
      @mousedown="startDragging"
      @mouseup="stopDragging"
      @mouseleave="stopDragging"
      @mousemove="handleDraggingMaxized"
      
    >
      <div class="title">{{ title }}</div>
      <div class="controls" @mouseup.stop @mouseleave.stop @mousedown.stop>
        <RippleButton class="control-button" @click="minimizeWindow">
          <img class="icon" src="../assets/minimize.svg">
        </RippleButton>
        <RippleButton v-if="isMaximized" class="control-button" @click="maximizeWindow">
          <img class="icon" src="../assets/restore.svg">
        </RippleButton>
        <RippleButton v-if="!isMaximized" class="control-button" @click="maximizeWindow">
          <img class="icon" src="../assets/maximize.svg">
        </RippleButton>
        <RippleButton class="control-button" id="close" @click="closeWindow"><img class="icon" src="../assets/close1.svg"></RippleButton>
      </div>
    </div>
  </template>
  
<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { getCurrentWindow } from '@tauri-apps/api/window';
import RippleButton from './RippleButton.vue';
const isMaximized = ref(false);
const isMouseDown = ref(false);
const isMoved = ref(false);
const msgCount = ref(0);
onMounted(async () => {
  isMaximized.value = !getCurrentWindow().isMaximized();
  await getCurrentWindow().onResized(handleResize);
})
const handleResize = async () => {
  const window = getCurrentWindow();
  isMaximized.value = await window.isMaximized();
};
const props = defineProps({
  title: {
    type: String,
    default: 'Tauri App'
  }
});
const handleDraggingMaxized = () => {
  isMoved.value = true;
  if (isMaximized.value && isMouseDown.value) {
    const window = getCurrentWindow();
    window.startDragging();
    isMaximized.value = false;
  }
};
const startDragging = (event) => {
  isMouseDown.value = true;
  isMoved.value = false;
  if (isMaximized.value) {
    return;
  }
  const window = getCurrentWindow();
  window.startDragging();

};
const stopDragging = () => {
  
  isMouseDown.value = false;
};
const minimizeWindow = async () => {
  const window = getCurrentWindow();
  await window.minimize();};
const maximizeWindow = async () => {
  const window = getCurrentWindow();
  isMaximized.value = await window.isMaximized();
  if (isMaximized.value) {
    await window.unmaximize();
  } else {
    await window.maximize();
  }
  isMaximized.value = await window.isMaximized();
};

const closeWindow = async () => {
  const window = getCurrentWindow();
  await window.close();
};
  
  </script>

  
  <style scoped>
  .search-box {
    position: relative;
    left: 30px;
    height: 30px;
    width: 300px;
    font-size: 13px;
  }
  #msgCount {
    position: absolute;
    right: 6px;
    bottom: 3px;
    padding: 0 3px;
    background-color: rgba(var(--text-color), 0.1);
    backdrop-filter: blur(10px);
    min-width: 10px;
    height: 16px;
    border-radius: 10px;

  }
  .title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    color: rgba(var(--text-color));
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    z-index: 4;
  }
  
  .title {
    font-size: 12px;
    font-weight: normal;
    left: 15px;
    position: relative;
    color: rgba(var(--text-color), 0.5);
  }
  
  .controls {
    display: flex;
    position: absolute;
    right: 0px;
  }
  .control-button img{
    width: 60%;
    padding-top: 3px;
  }
  .control-button {
    padding: 0 15px;
    background: none;
    border: none;
    color: rgba(var(--text-color), 0.5);
    font-size: 16px;
    cursor: pointer;
    height: 45px;
    box-shadow: none;
    display: flex;
    border-radius: 0;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    transition: color 0.2s ease, background-color 0.2s ease;
    border-radius: 0;
  }
  
  .control-button:hover {
    color: rgba(var(--text-color), 1);
    background-color: rgba(255, 255, 255, 0.1);
  }

  #close:hover {
    color: white;
    background-color: rgba(255, 0, 0, 0.5);
  }
  .control-button:active {
    background-color: rgba(var(--text-color), 0.2);
  }
  </style>