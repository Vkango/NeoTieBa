<script setup>
import RippleButtonWithIcon from './components/RippleButtonWithIcon.vue';
import { onMounted, ref } from 'vue';
import FollowBar from './pages/FollowBar.vue';
import Tabs from './components/Tabs.vue';
import ViewBarThreads from './pages/ViewBarThreads.vue';

import TitleBar from './components/TitleBar.vue';
const naviListItem = ref([
  { icon: 'search', title: '搜索', selected: false },
  { icon: 'home', title: '首页', selected: false },
  { icon: 'apps', title: '贴吧', selected: true },
  { icon: 'favorite', title: '收藏', selected: false },
  { icon: 'settings', title: '设置', selected: false }

]);

const scrollPosition = ref(0);
const container = ref();
function handleScroll(event) {
  const target = event.target;
  scrollPosition.value = target.scrollTop;
  container.value = event.target;
}
</script>

<template>
  <div id="container">

  <div class="navi">
    <RippleButtonWithIcon class="navi-button" v-for="item in naviListItem" :class="{ 'selected' : item.selected}" :icon="item.icon" :title="item.title"></RippleButtonWithIcon>
  </div>
  <div class="container">
    <div class="list">
      <FollowBar/>
    </div>
    <div class="content" @scroll="handleScroll">
      <!--确保内容留有48px padding-->
      <ViewBarThreads :scrollPosition="scrollPosition" :container="container" barName="孙笑川"></ViewBarThreads>

    </div>
  </div>
  <TitleBar title="" style="z-index: 0; left: 70px; width: calc(100% - 70px);"/>
  <Tabs style="position: fixed; top: 0; max-width: calc(100% - 350px); left: 70px; overflow-x: auto;"></Tabs>
  </div>  
</template>

<style scoped>
.navi-button {
  opacity: 0.5;
  transition: opacity 0.2s ease;
}
.navi-button:hover {
  opacity: 0.8;
}
.navi-button.selected {
  opacity: 1;
}
#container {
  background: url("");
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  position: fixed;
}
.flex-content {
  width: 100%;
  height: 100%;
}
.container {
  display: flex;
  flex-direction: row;
  position: absolute;
  width: calc(100% - 70px);
  top: 45px;
  left: 70px;
  height: calc(100% - 45px);
  background-color: rgba(73, 73, 73, 0.05);
  border-radius: 10px 0 0 0;
}
.navi {
  top: 0px;
  width: 70px;
  position: fixed;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
}
.list {
  top: 0;
  height: calc(100% - 0);
  position: relative;
  width: 220px;
  padding: 5px 10px;
}
.tab {
  position: relative;
  top: 0px;
  width: 100%;
  height: 48px;

}
.content {
  width: calc(100% - 220px);
  height: 100%;
  background-color: rgba(30, 31, 32, 1);
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 5px;
}
</style>
<style>
.list-title {
  font-size: 13px;
}
:root {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #0f0f0f;
  background-color: #f6f6f6;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
  user-select: none;
}
::-webkit-scrollbar {
  width: 7px;
  height: 2px;
}
::-webkit-scrollbar-track {

border-radius: 0;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 0;
  transition: background-color 0.2s;
  cursor: pointer;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

h1 {
  text-align: center;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}
button:active {
  border-color: #396cd8;
  background-color: #e8e8e8;
}

input,
button {
  outline: none;
}

#greet-input {
  margin-right: 5px;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: transparent
  }

  a:hover {
    color: #24c8db;
  }

  input,
  button {
    color: #ffffff;
    background-color: #0f0f0f98;
  }
  button:active {
    background-color: #0f0f0f69;
  }
}

</style>
