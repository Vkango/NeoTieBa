<template>
  <div class="tabs">
    <RippleButton class="tab-ripplebutton" v-for="i in tabs" :class="{'selected': i.selected}" :key="i" @click="emit('click', i)">
      <div class="tab-content">
        <img class="icon" :src="getIconPath(i.icon)" referrerpolicy="no-referrer" />
        <div class="title">{{ i.title }}</div>
        <span class="material-symbols-outlined" style="font-size: 12px;">close</span>
      </div>
    </RippleButton>
  </div>

</template>
<script setup>
import { defineEmits } from 'vue';
import RippleButton from './RippleButton.vue';
import { ref } from 'vue';
const tabs = ref([

  { selected: true, icon: "https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=2e6564b48b11728b302d8820f8c7abf3/1c950a7b02087bf4f5b4bcccb4d3572c11dfcfb8.jpg?tbpicau=2025-03-12-05_9986582a7b147bb4200b05b6c732dace", title: "孙笑川吧" },
  { selected: false, icon: "https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=2e6564b48b11728b302d8820f8c7abf3/1c950a7b02087bf4f5b4bcccb4d3572c11dfcfb8.jpg?tbpicau=2025-03-12-05_9986582a7b147bb4200b05b6c732dace", title: "🐢男又在幻想得吃" },
  { selected: false, icon: "https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=2e6564b48b11728b302d8820f8c7abf3/1c950a7b02087bf4f5b4bcccb4d3572c11dfcfb8.jpg?tbpicau=2025-03-12-05_9986582a7b147bb4200b05b6c732dace", title: "这不吃香菜哪个吧的" },

]);
const emit = defineEmits(['click']);
const getIconPath = (icon) => {
  return new URL(`${icon}`, import.meta.url).href;
};
defineProps({
  icon: {
    type: String,
    required: true,
    default: 'home'
  },
  title: {
    type: String,
    required: false,
    default: ''
  },
})

</script>
<style scoped>
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
.tab-ripplebutton {
  text-align: left;
  background-color: transparent;
  border: none;
  box-shadow: none;
  padding: 5px 10px;
  font-size: 13px;
  font-weight: normal;
  height: 35px;
  max-width: 200px;
  min-width: 100px;
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
}
.ripple-button-title {
  font-size: 13px;
  margin-top: 5px;
}
.tab-ripplebutton.selected {
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 5px 10px 5px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  backdrop-filter: blur(10px);
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
</style>