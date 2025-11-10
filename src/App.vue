<script setup>
import RippleButtonWithIcon from './components/RippleButtonWithIcon.vue';
import { onMounted, ref, getCurrentInstance, provide, nextTick } from 'vue';
import FollowBar from './pages/FollowBar.vue';
import Tabs from './components/Tabs.vue';
import ViewBarThreads from './pages/ViewBarThreads.vue';
import TitleBar from './components/TitleBar.vue';
import ViewThread from './pages/ViewThread.vue';
import My from './pages/My.vue';
import QRCodeLogin from './pages/QRCodeLogin.vue';
import Favourite from './pages/Favourite.vue';
import User from './pages/User.vue';
import Search from './pages/Search.vue';
import Welcome from './pages/Welcome.vue';
import TabList from './components/TabList.vue';
import Setting from './pages/Setting.vue';
import Notification from "./components/Notification.vue";
import { errorService } from './error-service';
import ImageViewer from './components/ImageViewer.vue';
import NotificationBox from './components/NotificationBox.vue';
import Tip from './components/Notification/Tip.vue';
import Debug from './pages/Debug.vue';
import Toast from './components/Toast.vue';
import Drawer from './components/Drawer.vue';
import Home from './pages/Home.vue';
import { read_file } from './file-io';
import SearchInBar from './pages/SearchInBar.vue';

const notificationComponent = ref(null);

const imageViewerVisibility = ref(false);
const imageViewerSrc = ref('');
const naviListItem = ref([]);
if (! import.meta.env.PROD) {
  naviListItem.value = [
    { id: 0, icon: 'search', title: '搜索', selected: false },
    { id: 1, icon: 'home', title: '首页', selected: false },
    { id: 2, icon: 'apps', title: '贴吧', selected: false },
    { id: 3, icon: 'person', title: '我的', selected: false },
    { id: 4, icon: 'settings', title: '设置', selected: false },
    { id: 5, icon: 'bug_report', title: '调试', selected: false }
  ];
}
else {
  naviListItem.value = [
    { id: 0, icon: 'search', title: '搜索', selected: false },
    { id: 1, icon: 'home', title: '首页', selected: false },
    { id: 2, icon: 'apps', title: '贴吧', selected: false },
    { id: 3, icon: 'person', title: '我的', selected: false },
    { id: 4, icon: 'settings', title: '设置', selected: false },
  ];
}
const ToastComponent = ref(null);
const activeTab = ref({});
const TabsRef = ref(null);
const showTabList = ref(false);
const showNotificationBox = ref(false);
const onBarThreadClick = (id) => {
  if (id == undefined) throw new Error("贴子ID为空！");
  const key = generateUniqueId('ViewThread' + id);
  TabsRef.value.addTab(key, "/assets/loading.svg", "正在加载", ViewThread, { tid: id, key_: key, onSetTabInfo: setTabInfo, onUserNameClicked: userNameClicked, onBarNameClicked: onBarNameClicked }, undefined, undefined, "TID " + id)
}
provide('sendToast', (title, duration = 3000) => {
  ToastComponent.value.showToast(title, duration);
})
const setTabInfo = (info) => {
  TabsRef.value.setTitle(info.key, info.title);
  TabsRef.value.setIcon(info.key, info.icon);
}

provide('openImageViewer', (url) => {
  onOpenImageViewer(url);
})
provide('deleteTab', (key) => {
  TabsRef.value.handleDelete(TabsRef.value.findIdByKey(key));
})

const onOpenImageViewer = (url) => {
  imageViewerVisibility.value = true;
  imageViewerSrc.value = url;
}

function generateUniqueId(text) {
  let hash = 0;
  if (text.length === 0) return hash;

  for (let i = 0; i < text.length; i++) {
    let char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash)
}


const onBarNameClicked = (barName) => {
  if (barName == undefined) throw new Error("吧名为空！")
  const key = generateUniqueId('ViewBarThreads' + barName);
  TabsRef.value.addTab(key, "/assets/loading.svg", "正在加载", ViewBarThreads, { key_: key, barName: barName, onThreadClick: onBarThreadClick, onSetTabInfo: setTabInfo, onUserNameClicked: userNameClicked, onSearchInBar: onSearchInBar })
}
const userNameClicked = (uid) => {
  if (uid == undefined) throw new Error('用户ID为空！')
  const key = generateUniqueId('User' + uid);
  TabsRef.value.addTab(key, "/assets/loading.svg", "正在加载", User, { key_: key, uid: uid, onSetTabInfo: setTabInfo, onThreadClicked: onBarThreadClick }, undefined, undefined, "UID " + uid)
}

const onSearchInBar = (data) => {
  const key = generateUniqueId('Search' + data.barName);
  TabsRef.value.addTab(key, "/assets/search.svg", "吧内搜索", SearchInBar, { key_: key, barName: data.barName, barIcon: data.barIcon, onBarNameClicked: onBarNameClicked, onUserNameClicked: userNameClicked, onThreadClick: onBarThreadClick, onUserNameClicked: userNameClicked, onSetTabInfo: setTabInfo }, true)
}

const QRLogin = () => {
  const key = generateUniqueId('QRLogin');
  TabsRef.value.addTab(key, "/assets/loading.svg", "正在加载", QRCodeLogin, { key_: key, onSetTabInfo: setTabInfo }, true, true)
}

const onClick = () => {
  const key = generateUniqueId('QRLogin');
  TabsRef.value.addTab(key, "/assets/loading.svg", "正在加载", QRCodeLogin, { key_: key, onSetTabInfo: setTabInfo }, true, true)
}
onMounted(() => {
  nextTick(() => {
    errorService.addHandler((error, info) => {
      try {
        notificationComponent.value.addNotification(
          info,
          '<span class="material-symbols-outlined" style="font-size: 17px;">bug_report</span>错误管理',
          Tip,
          onClick,
          { Tip: error },
          60000
        )
      }
      catch {
        alert('Error in application, failed to pop notification: please restart: \n' + error + '\n' + info);
      }

    });
  })
  let key = generateUniqueId('Welcome');
  TabsRef.value.addTab(key, "/assets/apps.svg", "欢迎", Welcome, { key_: key, onSetTabInfo: setTabInfo }, true, false)
  provide('sendNotification', (title, source, component, clickHandler, props = {}, duration = 5000) => {
    notificationComponent.value.addNotification(title, source, component, clickHandler, props, duration);
  })
});
function onSwitchTabs(id) {

  const tabItem = TabsRef.value.getTab(id);
  activeTab.value = {
    component: tabItem.component,
    props: tabItem.props,
    key: tabItem.key,
    renderKey: tabItem.renderKey || tabItem.key,
    if: true,
    origin: {
      icon: tabItem.origin.icon,
      title: tabItem.origin.title
    }
  };
  naviListItem.value.forEach(element => {
    element.selected = false;
  });
  switch (activeTab.value.component.__name) {
    case 'Home':
      naviListItem.value[1].selected = true;
      break;
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
    case 'SearchInBar':
      naviListItem.value[0].selected = true;
      break;
    case 'Setting':
      naviListItem.value[4].selected = true;
      break;
    case 'Debug':
      naviListItem.value[5].selected = true;
      break;
    default:
      break;
  }
}

function onRefreshTab(id) {
  const tabItem = TabsRef.value.getTab(id);
  const key = tabItem.key;
  const isActiveTab = activeTab.value.key === key;
  const newRenderKey = `${key}-${Date.now()}`;
  TabsRef.value.setTab(id, {
    ...tabItem,
    renderKey: newRenderKey,
    icon: '/assets/loading.svg',
    title: '正在加载'
  });

  if (isActiveTab) {
    activeTab.value = {
      ...activeTab.value,
      renderKey: newRenderKey,
      icon: '/assets/loading.svg',
      title: '正在加载'
    };
  }
}

const onDeactivated = (key) => {
  console.log('Tab deactivated:', key);
};

const onTabDelete = (key) => {
  if (activeTab.value.key === key) {
    activeTab.value = {};
  }
}
const onFavouriteClicked = () => {
  const key = generateUniqueId('Favourite');
  TabsRef.value.addTab(key, "/assets/favourite.svg", "我的收藏", Favourite, { key_: key, onSetTabInfo: setTabInfo, onThreadClick: onBarThreadClick }, true)
}

const openLocalThread = async (file) => {
  let tid = 0;
  try {
    const ret = JSON.parse(await read_file(file + '/page1.json'));
    tid = ret.thread.id;
    console.log(tid);
  } catch {
    throw new Error("目录无效");
  }

  const key = generateUniqueId('ViewThread' + tid);
  TabsRef.value.addTab(key, "/assets/loading.svg", "正在加载", ViewThread, { tid: tid, local: true, local_dir: file, key_: key, onSetTabInfo: setTabInfo, onUserNameClicked: userNameClicked, onBarNameClicked: onBarNameClicked }, undefined, undefined, file)
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
      TabsRef.value.addTab(key, "/assets/search.svg", "搜索", Search, { key_: key, onBarNameClicked: onBarNameClicked, onUserNameClicked: userNameClicked, onThreadClick: onBarThreadClick, onUserNameClicked: userNameClicked, onSetTabInfo: setTabInfo }, true)
      break;
    case 1:
      key = generateUniqueId('Home');
      TabsRef.value.addTab(key, '/assets/home.svg', '首页', Home, { key_: key, onBarNameClicked: onBarNameClicked, onUserNameClicked: userNameClicked, onThreadClick: onBarThreadClick, onUserNameClicked: userNameClicked, onSetTabInfo: setTabInfo }, true)
      break;
    case 2:
      key = generateUniqueId('FollowBar');
      TabsRef.value.addTab(key, "/assets/apps.svg", "进吧", FollowBar, { key_: key, onBarNameClicked: onBarNameClicked, onSetTabInfo: setTabInfo }, true)
      break;
    case 3:
      key = generateUniqueId('My');
      TabsRef.value.addTab(key, "/assets/user.svg", "我的", My, { key_: key, onSetTabInfo: setTabInfo, onFavouriteClicked: onFavouriteClicked, onUserNameClicked: userNameClicked, onThreadClicked: onBarThreadClick }, true)
      break;
    case 4:
      key = generateUniqueId('Setting');
      TabsRef.value.addTab(key, "/assets/settings.svg", "设置", Setting, { key_: key, onSetTabInfo: setTabInfo, onQRLogin: QRLogin }, true)
      break;
    case 5:
      key = generateUniqueId('Debug');
      TabsRef.value.addTab(key, "/assets/bug.svg", "调试", Debug, { key_: key, onSetTabInfo: setTabInfo, onOpenLocalThread: openLocalThread }, true, true)
      break;
    default:
      break;
  }
}

const onShowTabs = () => {
  showTabList.value = !showTabList.value;
  showNotificationBox.value = false;
}

const onshowNotificationBox = () => {
  showNotificationBox.value = !showNotificationBox.value;
  showTabList.value = false;
}
</script>

<template>
  <div id="container" style="background-image: url(../public/assets/background.jpg);">
    <div id="container"
      style="backdrop-filter: blur(0px); background-color: rgba(var(--background-color), 0.85); transition: all 0.3s ease;">
    </div>
    <div class="navi">
      <RippleButtonWithIcon @click="addBar(item.id)" class="navi-button" v-for="item in naviListItem"
        :class="{ 'selected': item.selected }" :icon="item.icon" :title="item.title"></RippleButtonWithIcon>
    </div>
    <div class="container">
      <div v-for="tab in TabsRef?.tabs" v-show="tab.key === activeTab.key" :key="tab.key" class="tab-pane">
        <keep-alive>
          <component @deactivated="onDeactivated(tab.key)" :is="tab.component" :key="tab.renderKey || tab.key"
            v-if="tab.if" v-bind="tab.props" />
        </keep-alive>
      </div>
    </div>
    <TitleBar title="" style="z-index: 0; left: 70px; width: calc(100% - 70px);" @showTabs="onShowTabs"
      @showNotificationBox="onshowNotificationBox"
      :msgCount="notificationComponent?.notifications?.length + notificationComponent?.hiddenNotifications?.length" />
    <Tabs ref="TabsRef" class="tabs" @onSwitchTabs="onSwitchTabs" @onTabDelete="onTabDelete"
      @onTabRefresh="onRefreshTab">
    </Tabs>
    <Transition name="notification-box">
      <TabList class="notification-box" v-if="showTabList" :tabsRef="TabsRef"></TabList>
    </Transition>
    <Transition name="notification-box">
      <Notification ref="notificationComponent" v-show="!showNotificationBox && !showTabList" />
    </Transition>
    <Transition name="notification-box">
      <NotificationBox class="notification-box" v-if="showNotificationBox && !showTabList"
        :tabsRef="notificationComponent">
      </NotificationBox>
    </Transition>
    <ImageViewer :imageSrc="imageViewerSrc" :visible="imageViewerVisibility" @close="imageViewerVisibility = false">
    </ImageViewer>
    <Toast ref="ToastComponent" />
  </div>
</template>

<style scoped>
.notification-box-enter-active,
.notification-box-leave-active {
  transition: all 0.3s ease;
}

.notification-box-enter-from,
.notification-box-leave-to {
  transform: translateX(100%);
}


.notification-box {
  position: absolute;
  right: 10px;
  top: 55px;
  width: 320px;
  background-color: rgba(var(--background-color), 0.2);
  /* background-blend-mode: overlay; */
  padding: 0 10px;
  border-radius: 7px;
  backdrop-filter: blur(20px);
  max-height: calc(100% - 70px);
  overflow-y: auto;
  border: 1.5px solid rgba(var(--text-color), 0.1);
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
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  padding: 5px 0;
  background-color: rgba(30, 31, 32, 0);
  overflow-y: auto;
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
.tab-pane {
  width: 100%;
}

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

.notification-container {
  position: fixed;
  display: flex;
  flex-direction: column;
  z-index: 2;
  overflow-y: auto;
  overflow-x: hidden;
  right: 0px;
  top: 50px;
  padding-right: 10px;
  height: calc(100% - 50px);
  pointer-events: none;
  width: 300px;
}

.notification {
  pointer-events: all;
  background-color: rgba(var(--background-color), 0.5);
  backdrop-filter: blur(var(--blur-value));
  border-radius: 4px;
  box-shadow: 0px 3px 10px -3px rgba(0, 0, 0, 0.6);
  width: calc(100% - 10px);
  margin: 10px;
  margin-top: 0px;

}

.notification-source {
  font-size: 12px;
  margin-bottom: 4px;
  text-align: left;
  width: 210px;
  opacity: 0.5;
  word-wrap: break-word;
  align-items: center;
  display: flex;
  gap: 5px;
}

.notification-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
  text-align: left;
  width: 250px;
  color: rgba(var(--text-color));
  word-wrap: break-word;
}

.notification-message {
  font-size: 14px;
  color: rgba(var(--text-color), 0.5);
  text-align: left;
  width: 100%;
  margin-top: 5px;
  height: fit-content;
}

.notification-content {
  width: 100%;
  background-color: rgba(var(--background-color), 0.2);
}

.notification-close {
  border: none;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0px;
  top: 0px;
  box-shadow: none;
  width: 32px;
  padding: 0;
  height: 32px;
  opacity: 0.5;
}

.notification-hide {
  border: none;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 30px;
  top: 0px;
  box-shadow: none;
  width: 32px;
  padding: 0;
  height: 32px;
  opacity: 0.5;
}

.notification-hide:hover {
  opacity: 1;
}

.notification-close:hover {
  opacity: 1;
}

.fade-notify-enter-active,
.fade-notify-leave-active,
.fade-notify-move {
  transition: all 0.3s ease;
}

.fade-notify-enter-from,
.fade-notify-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.thread-content {
  font-size: 120%;
  white-space: break-spaces;
  line-height: 200%;
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

.emoticon {
  width: 32px;
  height: 32px;
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
  font-family: 'Microsoft YaHei';
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

.thread-img {
  max-width: 100px;
  max-height: 100px;
  border-radius: 5px;
}

.list-title {
  margin-top: 30px;
  padding: 10px 5px;
  font-size: 16px;
  font-weight: bold;
  position: relative;
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
  color: rgb(0, 179, 255);
  text-decoration: inherit;
}

a:hover {
  color: rgb(83, 91, 242);
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
    --background-color: 34, 34, 34;
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
