<script setup>
import { ref, shallowRef, provide, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/core";
import Navi from "./main/Navi.vue";
import HomeUI from "./pages/HomeUI.vue";
import DownloadUI from './pages/DownloadUI.vue';
import ConfigManage from "./pages/ConfigManage.vue";
import ModDownloadUI from './pages/ModDownloadUI.vue';
import Settings from './pages/Settings.vue';
import TitleBar from './components/TitleBar.vue';
import Notification from "./components/Notification.vue";
import AddConfigUI from "./pages/AddConfigUI.vue";
import DebugTest from "./pages/DebugTest.vue";
import LibraryUI from './pages/LibraryUI.vue';
import LoginUI from "./pages/LoginUI.vue";
import UserInfo from './pages/UserInfo.vue';
import SearchUI from './pages/SearchUI.vue';
import TaskList from './pages/TaskList.vue';
import LoginAction from './pages/LoginAction.vue';
let currentComponent = shallowRef(HomeUI);
const showLoginUI = ref(false);
const showSearchUI = ref(false);
const showTaskList = ref(false);
const showLoginAction = ref(false);
const componentsMap = {
  1: HomeUI,
  2: LibraryUI,
  3: Settings,
  4: DownloadUI,
  5: ModDownloadUI,
  6: AddConfigUI,
  0: DebugTest,
};
///////// 定义全局方法
const notificationComponent = ref(null);
const ToastComponent = ref(null);
const MessageBoxComponent = ref(null);
provide('sendNotification', (title, component, props = {}, duration = 5000) => {
  notificationComponent.value.addNotification(title, component, props, duration);
})
provide('sendToast', (title, duration = 3000) => {
  ToastComponent.value.showToast(title, duration);
})
provide('messageBox', (title, component, props = {}) => {
  MessageBoxComponent.value.showMessageBox(title, component, props);
})
const changePage = (pageId) => {
  currentComponent.value = componentsMap[pageId] || HomeUI;
};
const onLoginUI = () => {
  showLoginUI.value = true;
}
const onLoginUIClose = () => {
  showLoginUI.value = false;
}
const onSearchUI = () => {
  showSearchUI.value = true;
}
const onSearchUIClose = () => {
  showSearchUI.value = false;
}
const onTaskList = () => {
  showTaskList.value = true;
}
const onTaskListClose = () => {
  showTaskList.value = false;
}
const onLoginAction = () => {
  showLoginAction.value = true;
}
const onLoginActionClose = () => {
  showLoginAction.value = false;
}
</script>

<template>
  <div id="container"></div>
  <div id="overlay"></div>
  <TitleBar title="NeoLauncher" style="z-index: 2;" @onTaskList="onTaskList"/>
  <Navi @changePage="changePage" @onLoginUI="onLoginUI" @onSearchUI="onSearchUI"></Navi>
  <transition name="fade-up" mode="in">
      <component :is="currentComponent" @onLoginAction="onLoginAction"></component>
  </transition>

  <div style="position: absolute; left: 30px; top: 30px">

  </div>
    <!--<LoginUI v-if="showLoginUI" @onClose="onLoginUIClose"/>-->
    <UserInfo v-if="showLoginUI" @onClose="onLoginUIClose"/>
    <SearchUI v-if="showSearchUI" @onClose="onSearchUIClose"/>
    <LoginAction v-if="showLoginAction" @onClose="onLoginActionClose"/>
    <TaskList v-if="showTaskList" @onClose="onTaskListClose"></TaskList>
    <Notification ref="notificationComponent"/>
    <Toast ref="ToastComponent"/>
    <MessageBox ref="MessageBoxComponent"/>

</template>
<style scoped>
#notifications {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  position: fixed; /* 固定位置 */
  top: 20px; /* 距离顶部的距离 */
  right: 20px; /* 距离右侧的距离 */
  gap: 10px; /* 通知之间的间距 */
}
.fade-up-enter-active, .fade-up-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-up-enter, .fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.fade-up-enter-active {
  animation: fadeInUp 0.2s;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
#container
{
  
  background: var(--background-src);
  background-size: cover;
  background-position: center;
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100vh;
}

#overlay
{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100vh;
  background-color: rgba(var(--background-color), 0.5);
  transition: background-color 0.3s ease;
}
</style>
<style>
.fade1-enter-active,
.fade1-leave-active {
  transition: opacity 0.5s ease;
}

.fade1-enter-from,
.fade1-leave-to {
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.fade-enter-active {
  animation: fadeInLeft 0.2s;
}
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

button {
  background-color: rgba(var(--background-color), 0.5);
  border: 0;
  padding: 10px 15px;
  border-radius: 3px;
  color: rgba(var(--text-color));
  box-shadow: 0px 3px 10px -3px rgba(0, 0, 0, 0.6);
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  align-content: center;
}
button:hover {
  background-color: rgba(var(--background-color), 0.8);
  box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.6);
}
.icon {
  filter: invert(var(--invert-percent));
}
:root
{
  --background-src: url('./assets/background-dark.jpg');
  --background-color: 14, 16, 20;
  --text-color: 255, 255, 255;
  --invert-percent: 0%;
  --blur-value: 20px;
  color: rgba(var(--text-color));
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  user-select: none;
  overflow: hidden;
  transition: color 0.5s ease, background-color 0.5s ease;
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
</style>