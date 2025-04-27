<script setup>
import RippleButtonWithIcon from './components/RippleButtonWithIcon.vue';
import { onMounted, ref, computed, getCurrentInstance, provide, nextTick } from 'vue';
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
import Search from './pages/Search.vue';
import Welcome from './pages/Welcome.vue';
import TabList from './components/TabList.vue';
import Setting from './pages/Setting.vue';
import Notification from "./components/Notification.vue";
import LoadingWithTip from './components/Notification/LoadingWithTip.vue';
import { errorService } from './error-service';
import ImageViewer from './components/ImageViewer.vue';

const notificationComponent = ref(null);

const imageViewerVisibility = ref(false);
const imageViewerSrc = ref('');

const naviListItem = ref([
  { id: 0, icon: 'search', title: '搜索', selected: false },
  { id: 1, icon: 'home', title: '首页', selected: false },
  { id: 2, icon: 'apps', title: '贴吧', selected: false },
  { id: 3, icon: 'person', title: '我的', selected: false },
  { id: 4, icon: 'settings', title: '设置', selected: false }
]);
const activeTab = ref({});
const TabsRef = ref(null);
const cachedTabs = ref([]);
const showTabList = ref(false);
const onBarThreadClick = (id) => {
  if (id == undefined) throw new Error("贴子ID为空！");
  const key = generateUniqueId('ViewThread' + id);
  TabsRef.value.addTab(key, "/assets/loading.svg", "正在加载", ViewThread, { tid: id, key_: key, onSetTabInfo: setTabInfo, onUserNameClicked: userNameClicked, onBarNameClicked: onBarNameClicked }, undefined, undefined, "TID " + id)
}
const setTabInfo = (info) => {
  TabsRef.value.setTitle(info.key, info.title);
  TabsRef.value.setIcon(info.key, info.icon);
}

provide('openImageViewer', (url) => {
  onOpenImageViewer(url);
})

const onOpenImageViewer = (url) => {
  imageViewerVisibility.value = true;
  imageViewerSrc.value = url;
}

const instance = getCurrentInstance();
const handler = new KeepAliveHandler();
function generateUniqueId(text) {
  let hash = 0;
  if (text.length === 0) return hash;

  for (let i = 0; i < text.length; i++) {
    let char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash);
}
const onBarNameClicked = (barName) => {
  if (barName == undefined) throw new Error("吧名为空！")
  const key = generateUniqueId('ViewBarThreads' + barName);
  TabsRef.value.addTab(key, "/assets/loading.svg", "正在加载", ViewBarThreads, { key_: key, barName: barName, onThreadClick: onBarThreadClick, onSetTabInfo: setTabInfo, onUserNameClicked: userNameClicked })
}
const userNameClicked = (uid) => {
  if (uid == undefined) throw new Error('用户ID为空！')
  const key = generateUniqueId('User' + uid);
  TabsRef.value.addTab(key, "/assets/loading.svg", "正在加载", User, { key_: key, uid: uid, onSetTabInfo: setTabInfo, onThreadClicked: onBarThreadClick }, undefined, undefined, "UID " + uid)
}

const QRLogin = () => {
  const key = generateUniqueId('QRLogin');
  TabsRef.value.addTab(key, "/assets/qr.svg", "扫码登录", QRCodeLogin, { key_: key }, true, true)
}


onMounted(() => {
  nextTick(() => {
    errorService.addHandler((error, info) => {
      notificationComponent.value.addNotification(
        info,
        LoadingWithTip,
        { Tip: error },
        60000
      );
    });
  })

  let key = generateUniqueId('Welcome');
  TabsRef.value.addTab(key, "/assets/apps.svg", "欢迎", Welcome, { key_: key }, true, false)
  cachedTabs.value = TabsRef.value.tabs.map(tab => tab.key);
  const keepAlive = instance.refs.keepAlive;
  handler.bind(keepAlive);

  provide('sendNotification', (title, component, props = {}, duration = 5000) => {
    notificationComponent.value.addNotification(title, component, props, duration);
  })
});
function onSwitchTabs(id) {

  const tabItem = TabsRef.value.getTab(id);
  activeTab.value.component = tabItem.component;
  activeTab.value.props = tabItem.props;
  activeTab.value.key = tabItem.key;
  cachedTabs.value = TabsRef.value.tabs.map(tab => tab.key);
  naviListItem.value.forEach(element => {
    element.selected = false;
  });
  switch (activeTab.value.component.__name) {
    case 'User':
      naviListItem.value[2].selected = true;
      break;
    case 'ViewThread':
      naviListItem.value[2].selected = true;
      break;
    case 'ViewBarThreads':
      naviListItem.value[2].selected = true;
      break;
    case 'FollowBar':
      naviListItem.value[2].selected = true;
      break;
    case 'Favourite':
      naviListItem.value[3].selected = true;
      break;
    case 'My':
      naviListItem.value[3].selected = true;
      break;
    case 'QRCodeLogin':
      naviListItem.value[4].selected = true;
      break;
    case 'Search':
      naviListItem.value[0].selected = true;
      break;
    case 'Setting':
      naviListItem.value[4].selected = true;
      break;
    default:
      break;
  }
}

const onDeactivated = (key) => {
  const component = instance.refs.keepAlive?.cache?.get(key)?.component;
  if (component) {
    component.deactivated?.();
  }
};

const onTabDelete = (key) => {
  handler.remove(key);
  cachedTabs.value = TabsRef.value.tabs.map(tab => tab.key);
  if (activeTab.value.key === key) {
    activeTab.value = {};
  }
  nextTick(() => {
    instance.refs.keepAlive.$forceUpdate();
  });
}
const onFavouriteClicked = () => {
  const key = generateUniqueId('Favourite');
  TabsRef.value.addTab(Favourite, "/assets/favourite.svg", "我的收藏", Favourite, { key_: key, onSetTabInfo: setTabInfo, onThreadClick: onBarThreadClick }, true)
  cachedTabs.value = TabsRef.value.tabs.map(tab => tab.key);
}
const addBar = async (id) => {
  naviListItem.value.forEach(element => {
    element.selected = false;
  });
  naviListItem.value[id].selected = true;
  let key;
  switch (id) {
    case 0:
      key = generateUniqueId('Search');
      TabsRef.value.addTab(key, "/assets/search.svg", "搜索", Search, { key_: key, onBarNameClicked: onBarNameClicked, onUserNameClicked: userNameClicked, onThreadClick: onBarThreadClick, onUserNameClicked: userNameClicked }, true)
      cachedTabs.value = TabsRef.value.tabs.map(tab => tab.key);
      break;
    case 1:
      break;
    case 2:
      key = generateUniqueId('FollowBar');
      TabsRef.value.addTab(key, "/assets/apps.svg", "进吧", FollowBar, { key_: key, onBarNameClicked: onBarNameClicked }, true)
      cachedTabs.value = TabsRef.value.tabs.map(tab => tab.key);
      break;
    case 3:
      key = generateUniqueId('My');
      TabsRef.value.addTab(key, "/assets/user.svg", "我的", My, { key_: key, onSetTabInfo: setTabInfo, onFavouriteClicked: onFavouriteClicked, onUserNameClicked: userNameClicked, onThreadClicked: onBarThreadClick }, true)
      cachedTabs.value = TabsRef.value.tabs.map(tab => tab.key);
      break;
    case 4:
      key = generateUniqueId('Setting');
      TabsRef.value.addTab(key, "/assets/qr.svg", "设置", Setting, { key_: key, onSetTabInfo: setTabInfo, onQRLogin: QRLogin }, true)
      cachedTabs.value = TabsRef.value.tabs.map(tab => tab.key);
      break;
    default:
      break;
  }
}



const onShowTabs = () => {
  showTabList.value = !showTabList.value;
}
</script>

<template>
  <div id="container" style="background-image: url(../public/assets/background.jpg);">
    <!-- <div id="container"
      style="backdrop-filter: blur(100px); background-color: rgba(var(--background-color), 0.65); transition: all 0.3s ease;"> -->
    <div class="navi">
      <RippleButtonWithIcon @click="addBar(item.id)" class="navi-button" v-for="item in naviListItem"
        :class="{ 'selected': item.selected }" :icon="item.icon" :title="item.title"></RippleButtonWithIcon>
    </div>
    <div class="container">
      <keep-alive ref="keepAlive">
        <component @deactivated="onDeactivated(activeTab.key)" :is="activeTab.component" :key="activeTab.key"
          v-bind="activeTab.props" />
      </keep-alive>
    </div>
    <TitleBar title="" style="z-index: 0; left: 70px; width: calc(100% - 70px);" @showTabs="onShowTabs" />
    <Tabs ref="TabsRef" class="tabs" @onSwitchTabs="onSwitchTabs" @onTabDelete="onTabDelete">
    </Tabs>
    <Transition name="tab-list">
      <TabList class="tab-list" v-if="showTabList" :tabsRef="TabsRef"></TabList>
    </Transition>
    <Notification ref="notificationComponent" />
    <!-- </div> -->
    <ImageViewer :imageSrc="imageViewerSrc" :visible="imageViewerVisibility" @close="imageViewerVisibility = false">
    </ImageViewer>
  </div>
</template>

<style scoped>
.tab-list-enter-active,
.tab-list-leave-active {
  transition: all 0.3s ease;
}

.tab-list-enter-from,
.tab-list-leave-to {
  opacity: 0;
  width: 0%;
  transform: translateY(-10%);
}


.tab-list {
  position: absolute;
  right: 10px;
  top: 45px;
  width: 200px;
  background-color: rgba(var(--background-color), 0.5);
  padding: 10px;
  border-radius: 5px;
  backdrop-filter: blur(20px);
  max-height: calc(100% - 80px);
  overflow-y: auto;
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
  padding: 5px 0;
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
.icon_ {
  filter: invert(var(--invert));
}

.tabs {
  position: fixed;
  top: 5px;
  width: calc(100% - 350px);
  left: 70px;
  overflow-x: hidden;
  height: 42px;
  overflow-y: hidden;
}

.thread .avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
}

.user-info {
  margin-top: 5px;
}

.thread {
  width: 80%;
  box-sizing: border-box;
  padding: 5px 15px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  font-size: 13px;
  gap: 10px;
  transition: background-color 0.3s ease;
  background-color: rgba(var(--text-color), 0.02);
}

.thread:hover {
  background-color: rgba(var(--text-color), 0.1);
}

.at-button {
  background-color: transparent;
  box-shadow: none;
  padding: 0;
  color: #46a0ff;
  font-weight: bold;
  border: none;
  transition: all 0.3s ease;
}

.at-button:hover {
  border: none;
  opacity: 0.5;
}

.desc {
  opacity: 0.5;
}

.user-name {
  font-weight: bold;
  font-size: 110%;
}

input {
  border: none;
  outline-style: none;
  border-radius: 5px;
  height: 100%;
  padding: 10px 15px;
  box-sizing: border-box;
}

.thread-content {
  font-size: 120%;
  white-space: break-spaces;
}

.user-info {
  display: flex;
  gap: 10px;
  align-items: center;
  width: fit-content;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}

.user-info:hover {
  background-color: rgba(var(--text-color), 0.1);
}

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
  background-color: rgba(0, 0, 0, 0.1);
  padding: 3px 10px;
  margin-left: 10px;
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
  --text-color: 0, 0, 0;
  --background-color: 0, 0, 0;
  --invert: 1;
  --background-color: 255, 255, 255;
}

.filter-button {
  font-size: 80%;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.filter-button.selected {
  opacity: 1;
  font-weight: bold;
}

.filter-button:hover {
  opacity: 1;
}

.list-title {
  margin-top: 30px;
}

.reply-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h3 {
  margin-top: 30px;
}

::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

::-webkit-scrollbar-track {

  border-radius: 0;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(var(--text-color), 0.3);
  border-radius: 0;
  transition: background-color 0.2s;
  cursor: pointer;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(var(--text-color), 0.5);
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
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
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
    background-color: transparent;
    --text-color: 255, 255, 255;
    --invert: 0;
    --background-color: 0, 0, 0;
  }

  a:hover {
    color: #24c8db;
  }

  input,
  button {
    color: #ffffff;
    background-color: #0f0f0f5e;
  }

  button:active {
    background-color: #0f0f0f69;
  }
}
</style>
