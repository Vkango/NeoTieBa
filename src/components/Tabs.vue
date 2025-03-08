<template>
  <div class="tabs">
    <RippleButton class="tab-ripplebutton" v-for="i in tabs" :class="{'selected': i.selected}" :key="i" @click="handleClick(i.id)">
      <div class="tab-content">
        <img class="icon" :src="getIconPath(i.icon)" referrerpolicy="no-referrer"/>
        <div class="title">{{ i.title }}</div>
        <span v-if="i.key != 10001" class="material-symbols-outlined" id="close" style="font-size: 12px;" @click.stop @click="handleDelete(i.id)" >close</span>
      </div>
    </RippleButton>
  </div>
</template>
<script setup>
import { defineEmits, markRaw } from 'vue';
import RippleButton from './RippleButton.vue';
import { ref } from 'vue';
const handleDelete = (id) => {
  tabs.value[id].component = "deletedItem";
  console.log(id, "component以设置为deleteditem")
  emit('onTabDelete', getTab(id).key);
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
      emit('onSwitchTabs', tabs.value.length - 1);
      return;
    }
    tabs.value[id].selected = true;
    emit('onSwitchTabs', id);
  }
  else {
    tabs.value[0].selected = true;
    emit('onSwitchTabs', 0);
  }
}
const handleClick = (id) => {
  tabs.value.forEach((item) => {
    item.selected = item.id === id;
  });
  emit('onSwitchTabs', id);
};
const addTab = (key, icon, title, component, props) => {
  let found = false;
  tabs.value.forEach(element => {
    if (element.key == key) {
      element.selected = true;
      emit('onSwitchTabs', element.id);
      found = true
      return;
    }
    element.selected = false;
  });
  if (found) { return; }
  tabs.value.push({ id: tabs.value.length, key: String(key), selected: true, icon: icon, title: title, component: markRaw(component), props: props });
  emit('onSwitchTabs', tabs.value.length - 1);
};
const getTab = (id) => {
  return tabs.value[id];
};
const setTitle = (key, title) => {
  tabs.value.forEach((item) => {
    if (item.key == key) {
      item.title = title;
    }
  });
};
const setIcon = (key, icon) => {
  tabs.value.forEach((item) => {
    if (item.key == key) {
      item.icon = icon;
    }

  });
};


const tabs = ref([]);
const emit = defineEmits(['click', 'onSwitchTabs', 'onTabDelete']);
const getIconPath = (icon) => {
  
  return new URL(`${icon}`, import.meta.url).href;
};
defineExpose({
  addTab,
  getTab,
  setTitle,
  setIcon,
  tabs
});
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