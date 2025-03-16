<script setup>
import RippleButtonWithIcon from './components/RippleButtonWithIcon.vue';
import { onMounted, ref, computed, getCurrentInstance  } from 'vue';
import FollowBar from './pages/FollowBar.vue';
import Tabs from './components/Tabs.vue';
import ViewBarThreads from './pages/ViewBarThreads.vue';
import TitleBar from './components/TitleBar.vue';
import ViewThread from './pages/ViewThread.vue';
import { KeepAliveHandler } from './handler';
import My from './pages/My.vue';
import QRCodeLogin from './pages/QRCodeLogin.vue';
import Favourite from './pages/Favourite.vue';
import User from './pages/User.vue';
const naviListItem = ref([
  { icon: 'search', title: '搜索', selected: false },
  { icon: 'home', title: '首页', selected: false },
  { icon: 'apps', title: '贴吧', selected: true },
  { icon: 'person', title: '我的', selected: false },
  { icon: 'settings', title: '设置', selected: false }
]);
const activeTab = ref({});
const TabsRef = ref(null);
const cachedTabs = ref([]);

const onBarThreadClick = (id) => {
  TabsRef.value.addTab(id, "../assets/loading.svg", "正在加载", ViewThread, { tid: id, key_: id, onSetTabInfo: setTabInfo, onUserNameClicked: userNameClicked })
}
const setTabInfo = (info) => {
  TabsRef.value.setTitle(info.key, info.title);
  TabsRef.value.setIcon(info.key, info.icon);
}
const instance = getCurrentInstance();
const handler = new KeepAliveHandler();
const onBarNameClicked = (barName) => {
  const key = Number(Date.now());
  TabsRef.value.addTab(key, "../assets/loading.svg", "正在加载", ViewBarThreads, { key_: key, barName: barName, onThreadClick: onBarThreadClick, onSetTabInfo: setTabInfo, onUserNameClicked: userNameClicked})
}
const userNameClicked = (uid) => {
  TabsRef.value.addTab(uid, "../assets/loading.svg", "正在加载", User, { key_: uid, uid: uid, onSetTabInfo: setTabInfo, onThreadClicked: onBarThreadClick})
}

onMounted(() => {
  TabsRef.value.addTab(10001, "../assets/apps.svg", "进吧", FollowBar, { key_: 10001, onBarNameClicked: onBarNameClicked})
  TabsRef.value.addTab(10000, "../assets/qr.svg", "扫码登录", QRCodeLogin, { key_: 10001, onSetTabInfo: setTabInfo})
  TabsRef.value.addTab(10002, "../assets/qr.svg", "我 (@shenbiUser)", My, { key_: 10001, onSetTabInfo: setTabInfo})
  TabsRef.value.addTab(10003, "../assets/favourite.svg", "我的收藏", Favourite, { key_: 10003, onThreadClick: onBarThreadClick })
  TabsRef.value.addTab(1, "../assets/loading.svg", "正在加载", ViewBarThreads, { key_: 1, barName: "孙笑川", onThreadClick: onBarThreadClick, onSetTabInfo: setTabInfo, onUserNameClicked: userNameClicked})
  TabsRef.value.addTab(10004, "../assets/loading.svg", "正在加载", User, { key_: 10004, uid: 3323512645, onThreadClicked: onBarThreadClick, onSetTabInfo: setTabInfo})
  
  cachedTabs.value = TabsRef.value.tabs.map(tab => tab.key);
  const keepAlive = instance.refs.keepAlive;
  handler.bind(keepAlive);
});
function onSwitchTabs(id) {

  const tabItem = TabsRef.value.getTab(id);
  activeTab.value.component = tabItem.component;
  activeTab.value.props = tabItem.props;
  activeTab.value.key = tabItem.key;
  cachedTabs.value = TabsRef.value.tabs.map(tab => tab.key);
}
const onTabDelete = (key) => {
  handler.remove(key);
  cachedTabs.value = TabsRef.value.tabs.map(tab => tab.key);
}

const addBar = async () => {
  const value = prompt("请输入贴吧名称", "")
  if (value === null) {
    return;
  }
  const key = String(Date.now())
  TabsRef.value.addTab(key, "../assets/loading.svg", "正在加载", ViewBarThreads, { key_: key, barName: value, onThreadClick: onBarThreadClick, onSetTabInfo: setTabInfo})
  cachedTabs.value = TabsRef.value.tabs.map(tab => tab.key);
}

const onTabScroll = (event) => {
  const container = document.getElementsByClassName('tabs')[0];
  const deltaX = event.deltaY;
  container.scrollLeft += deltaX;
};
</script>

<template>
  <div id="container">
  <div class="navi">
    <RippleButtonWithIcon @click="addBar" class="navi-button" v-for="item in naviListItem" :class="{ 'selected' : item.selected}" :icon="item.icon" :title="item.title"></RippleButtonWithIcon>
  </div>
  <div class="container">
    <keep-alive ref="keepAlive">
      <component :is="activeTab.component" :key="activeTab.key" v-bind="activeTab.props"/>
    </keep-alive>
  </div>
  <TitleBar title="" style="z-index: 0; left: 70px; width: calc(100% - 70px);"/>
  <Tabs @wheel="onTabScroll" ref="TabsRef" class="tabs" @onSwitchTabs="onSwitchTabs" @onTabDelete="onTabDelete"></Tabs>
  </div>  
</template>

<style scoped>
.tabs {
  position: fixed;
  top: 0;
  max-width: calc(100% - 350px);
  left: 70px;
  overflow-x: hidden;
  height: 40px;
  overflow-y: hidden;
}
.tabs:hover {
  overflow-x: scroll;
}
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
  border-radius: 5px 0 0 0;
}
.navi {
  top: 0px;
  width: 70px;
  position: fixed;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  background-color: rgba(30, 31, 32, 0);
}
.list {
  top: 0;
  height: 100%;
  position: relative;
  width: 220px;
  padding: 5px 10px;
  background-color: rgba(30, 31, 32, 0.3);
}
.tab {
  position: relative;
  top: 0px;
  width: 100%;
  height: 48px;

}
</style>
<style>
.level.color1 {
  background-color: rgba(0, 255, 166, 0.1);
}
.level.color2 {
  background-color: rgba(0, 119, 255, 0.1);
}
.level.color3 {
  background-color: rgba(255, 255, 0, 0.1);
}
.level.color4 {
  background-color: rgba(255, 0, 0, 0.1);
}
.level {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 3px 10px;
  border-radius: 5px;
  width: fit-content;
  margin-bottom: 5px;
}
.loading-box {
  position: absolute;
  left: 30px;
  bottom: 20px;
}
.fade1-enter-active,
.fade1-leave-active {
  transition: opacity 0.5s ease;
}

.fade1-enter-from,
.fade1-leave-to {
  opacity: 0;
}
:root {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #0f0f0f;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
  user-select: none;
  --text-color: 255, 255, 255;
  --background-color: 0, 0, 0;
}
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
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
