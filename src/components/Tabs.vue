<template>
  <div class="tabs">
    <RippleButton class="tab-ripplebutton" v-for="i in tabs" :class="{'selected': i.selected}" :key="i" @click="handleClick(i.id)">
      <div class="tab-content">
        <img class="icon" :src="getIconPath(i.icon)" referrerpolicy="no-referrer"/>
        <div class="title">{{ i.id + i.title }}</div>
        <span class="material-symbols-outlined" id="close" style="font-size: 12px;" @click.stop @click="handleDelete(i.id)" >close</span>
      </div>
    </RippleButton>
  </div>

</template>
<script setup>
import { defineEmits } from 'vue';
import RippleButton from './RippleButton.vue';
import { ref } from 'vue';
const handleDelete = (id) => {
  if (tabs.value[id].selected == false) {
    tabs.value.splice(id, 1);
    for (let i = 0; i < tabs.value.length; i++) {
      tabs.value[i].id = i;
    }
    return;
  }
  tabs.value.splice(id, 1);
  for (let i = 0; i < tabs.value.length; i++) {
    tabs.value[i].id = i;
  }
  if (id != 0) {
    if(id == tabs.value.length) {
      tabs.value[tabs.value.length - 1].selected = true;
      return;
    }
    tabs.value[id].selected = true;
  }
  else {
    tabs.value[0].selected = true;
  }
}
const handleClick = (id) => {
  tabs.value.forEach((item) => {
    item.selected = item.id === id;
  });
  emit('click', id);
};
const tabs = ref([

  { id: 0, selected: true, icon: "https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=2e6564b48b11728b302d8820f8c7abf3/1c950a7b02087bf4f5b4bcccb4d3572c11dfcfb8.jpg?tbpicau=2025-03-12-05_9986582a7b147bb4200b05b6c732dace", title: "①孙笑川吧" },
  { id: 1, selected: false, icon: "https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=2e6564b48b11728b302d8820f8c7abf3/1c950a7b02087bf4f5b4bcccb4d3572c11dfcfb8.jpg?tbpicau=2025-03-12-05_9986582a7b147bb4200b05b6c732dace", title: "②🐢男又在幻想得吃" },
  { id: 2, selected: false, icon: "https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=2e6564b48b11728b302d8820f8c7abf3/1c950a7b02087bf4f5b4bcccb4d3572c11dfcfb8.jpg?tbpicau=2025-03-12-05_9986582a7b147bb4200b05b6c732dace", title: "③这不吃香菜哪个吧的" },
  { id: 3, selected: false, icon: "https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=2e6564b48b11728b302d8820f8c7abf3/1c950a7b02087bf4f5b4bcccb4d3572c11dfcfb8.jpg?tbpicau=2025-03-12-05_9986582a7b147bb4200b05b6c732dace", title: "④孙笑川吧" },
  { id: 4, selected: false, icon: "https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=2e6564b48b11728b302d8820f8c7abf3/1c950a7b02087bf4f5b4bcccb4d3572c11dfcfb8.jpg?tbpicau=2025-03-12-05_9986582a7b147bb4200b05b6c732dace", title: "⑤🐢男又在幻想得吃" },
  { id: 5, selected: false, icon: "https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=2e6564b48b11728b302d8820f8c7abf3/1c950a7b02087bf4f5b4bcccb4d3572c11dfcfb8.jpg?tbpicau=2025-03-12-05_9986582a7b147bb4200b05b6c732dace", title: "⑥这不吃香菜哪个吧的" },
  { id: 6, selected: false, icon: "https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=2e6564b48b11728b302d8820f8c7abf3/1c950a7b02087bf4f5b4bcccb4d3572c11dfcfb8.jpg?tbpicau=2025-03-12-05_9986582a7b147bb4200b05b6c732dace", title: "⑦孙笑川吧" },
  { id: 7, selected: false, icon: "https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=2e6564b48b11728b302d8820f8c7abf3/1c950a7b02087bf4f5b4bcccb4d3572c11dfcfb8.jpg?tbpicau=2025-03-12-05_9986582a7b147bb4200b05b6c732dace", title: "⑧🐢男又在幻想得吃" },
  { id: 8, selected: false, icon: "https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=2e6564b48b11728b302d8820f8c7abf3/1c950a7b02087bf4f5b4bcccb4d3572c11dfcfb8.jpg?tbpicau=2025-03-12-05_9986582a7b147bb4200b05b6c732dace", title: "⑨这不吃香菜哪个吧的" },

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