<template>
  <div v-if="tabsRef != undefined">
    
    <div style="font-weight: bold; margin-left: 10px; margin-top: 3px; font-size: 13px;">打开的标签 ({{ tabsRef.tabs.length - 1 }})</div>
    <div class="tabs-list-">
      <transition-group
      name="tab-list"
      tag="div"
      class="tabs-list-"
    >
      <RippleButton class="tab-ripplebutton" v-for="i in tabsRef.tabs" :class="{'selected': i.selected, 'invert': i.icon_invert, 'show': !i.show}" :key="i" @click="tabsRef.handleClick(i.id)">
      <div class="tab-content">
        <img class="icon" :src="getIconPath(i.icon)" referrerpolicy="no-referrer"/>
        <div class="title">{{ i.title }}</div>
        <span class="material-symbols-outlined" id="close" style="font-size: 12px;" @click.stop @click="tabsRef.handleDelete(i.id)" >close</span>
      </div>
    </RippleButton>
  </transition-group>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import RippleButton from './RippleButton.vue';
const getIconPath = (icon) => {
  return new URL(`${icon}`, import.meta.url).href;
};
defineProps({
  tabsRef: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.tab-list-enter-active,
.tab-list-leave-active {
  transition: all 0.3s ease;
}

.tab-list-enter-from,
.tab-list-leave-to {
  opacity: 0;
  width: 0%;
  transform: translateY(100%);
}
#close {
  position: absolute;
  right: 10px;
}
#close:hover {
  opacity: 0.5;
}
.icon {
  width: 16px;
  height: 16px;
  border-radius: 16px;
}
.tabs {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 5px;
  padding: 5px 0px;
}
.tab-ripplebutton:hover {
  background-color: rgba(var(--text-color), 0.1);
}
.tab-ripplebutton {
  text-align: left;
  background-color: transparent;
  border: none;
  box-shadow: none;
  padding: 5px 10px;
  font-size: 13px;
  font-weight: normal;
  height: 35px;
  width: 100%;
  transition: all 0.3s ease;
}
.tab-content {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}
.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: absolute;
  left: 36px;
  width: calc(100% - 60px);
}
.ripple-button-title {
  font-size: 13px;
  margin-top: 5px;
}
.tab-ripplebutton.selected {
  background-color: rgba(var(--text-color), 0.1);
  box-shadow: none;
  font-weight: bold;
  backdrop-filter: blur(10px);
}
.tab-ripplebutton.invert .icon {
  filter: invert(var(--invert));
}
.tab-ripplebutton.show {
  display: none;
}
#RippleButton {
  background-color: transparent;
  box-shadow: none;
  padding: 10px 5px;
}
.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 100,
  'GRAD' 0,
  'opsz' 24
}
.tabbutton {
  width: 100%;
  text-align: left;
  padding: 0;
}
.tabs-list {
  display: flex;
  flex-direction: column;
}
.tag {
  display: inline-block;
  padding: 0px 7px;
  border-radius: 5px;
  color: rgba(var(--text-color));
  font-size: 12px;
  margin: 0px 3px;
}
</style>