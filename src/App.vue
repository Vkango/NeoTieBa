<script setup lang="ts">
import { onMounted, ref, provide, nextTick, type Ref, type Component } from 'vue';
import type { NotificationComponent } from '@/components';
import type { TabItem } from '@/types/common';
import FollowBar from './pages/user/FollowBar.vue';
import ViewBarThreads from './pages/threads/ViewBarThreads.vue';
import ViewThread from './pages/threads/ViewThread.vue';
import My from './pages/user/My.vue';
import Favourite from './pages/user/Favourite.vue';
import User from './pages/user/User.vue';
import Search from './pages/search/Search.vue';
import Welcome from './pages/Welcome.vue';
import Setting from './pages/Setting.vue';
import { errorService } from '@/core/error-service';
import Tip from '@/components/notification/Tip.vue';
import Debug from './pages/Debug.vue';
import Home from './pages/Home.vue';
import { read_file } from '@/core/file-io';
import SearchInBar from './pages/search/SearchInBar.vue';
import { clipboardService } from '@/services/clipboard-service';
import { URLParser } from '@/services/url-parser';
import { useApiStore } from '@/stores';
import { useTabStore } from '@/stores/tabs';

// Type definitions
interface NavItem {
  id: number;
  icon: string;
  title: string;
  selected: boolean;
}

interface TabInfo {
  key: string | number;
  title: string;
  icon: string;
}

interface ToastComponent {
  showToast: (title: string, duration: number) => void;
}

interface TitleBarComponent {
  updateAvatar: () => Promise<void>;
}

interface JumpResult {
  onClick: () => void;
  title: string;
  description: string;
}

interface SearchInBarData {
  barName: string;
  barIcon: string;
}

// Refs with explicit types
const notificationComponent: Ref<NotificationComponent | null> = ref<NotificationComponent | null>(null);
const isNotificationReady: Ref<boolean> = ref<boolean>(false);
const imageViewerVisibility: Ref<boolean> = ref<boolean>(false);
const imageViewerSrc: Ref<string> = ref<string>('');
const ToastComponent: Ref<any> = ref<any>(null);
const activeTab: Ref<any> = ref<any>({});
const showTabList: Ref<boolean> = ref<boolean>(false);
const showNotificationBox: Ref<boolean> = ref<boolean>(false);
const titleBarRef: Ref<TitleBarComponent | null> = ref<TitleBarComponent | null>(null);
const processedUrls: Ref<string[]> = ref<string[]>([]);

// Navigation items
const naviListItem: Ref<NavItem[]> = ref<NavItem[]>([]);
if (!import.meta.env.PROD) {
  naviListItem.value = [
    { id: 0, icon: 'search', title: '搜索', selected: false },
    { id: 1, icon: 'home', title: '首页', selected: false },
    { id: 2, icon: 'apps', title: '贴吧', selected: false },
    { id: 3, icon: 'person', title: '我的', selected: false },
    { id: 4, icon: 'settings', title: '设置', selected: false },
    { id: 5, icon: 'bug_report', title: '调试', selected: false }
  ];
} else {
  naviListItem.value = [
    { id: 0, icon: 'search', title: '搜索', selected: false },
    { id: 1, icon: 'home', title: '首页', selected: false },
    { id: 2, icon: 'apps', title: '贴吧', selected: false },
    { id: 3, icon: 'person', title: '我的', selected: false },
    { id: 4, icon: 'settings', title: '设置', selected: false },
  ];
}

const apiStore = useApiStore();
const Api = apiStore.getApi();
const tabStore = useTabStore();

// Watch for tab changes and update activeTab
import { watch } from 'vue';
watch(
  () => tabStore.activeKey,
  (newActiveKey) => {
    if (newActiveKey) {
      const tab = tabStore.tabs.find((t: TabItem) => t.key === newActiveKey);
      if (tab) {
        activeTab.value = {
          component: tab.component,
          props: tab.props,
          key: tab.key,
          renderKey: tab.renderKey || String(tab.key),
          if: true,
          origin: {
            icon: tab.origin?.icon,
            title: tab.origin?.title
          }
        };
      }
    }
  },
  { immediate: false }
);

// Notification system
const safeAddNotification = async (
  title: string,
  source: string,
  component: Component,
  clickHandler: (() => void) | null,
  props: Record<string, unknown> = {},
  duration = 5000
): Promise<void> => {
  let attempts = 0;
  while (!notificationComponent.value && attempts < 50) {
    await nextTick();
    attempts++;
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  if (notificationComponent.value && notificationComponent.value.addNotification) {
    notificationComponent.value.addNotification(title, source, component, clickHandler, props, duration);
  }
};

provide('sendNotification', safeAddNotification);

provide('sendToast', (title: string, duration = 3000): void => {
  if (ToastComponent.value) {
    ToastComponent.value.showToast(title, duration);
  }
});

provide('openImageViewer', (url: string): void => {
  onOpenImageViewer(url);
});

provide('deleteTab', (key: string | number): void => {
  tabStore.removeTab(key);
});

// Utility functions
function generateUniqueId(text: string): number {
  let hash = 0;
  if (text.length === 0) return hash;

  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const onOpenImageViewer = (url: string): void => {
  imageViewerVisibility.value = true;
  imageViewerSrc.value = url;
};

const setTabInfo = (info: TabInfo): void => {
  const keyStr = String(info.key);
  tabStore.updateTabMeta(keyStr, { title: info.title, icon: info.icon });

  // 如果是当前活动tab，直接更新activeTab显示
  if (String(activeTab.value.key) === keyStr) {
    const updatedTab = tabStore.tabs.find((t: TabItem) => t.key === keyStr);
    if (updatedTab) {
      activeTab.value = {
        component: updatedTab.component,
        props: updatedTab.props,
        key: updatedTab.key,
        renderKey: updatedTab.renderKey || String(updatedTab.key),
        if: true,
        origin: {
          icon: updatedTab.origin?.icon,
          title: updatedTab.origin?.title
        }
      };
    }
  }
};

// 提供updateTabMeta给子组件，避免长链props回调
provide('updateTabMeta', setTabInfo);
const onBarThreadClick = (id: string | number | undefined): void => {
  if (id === undefined) throw new Error("贴子ID为空！");

  const key = generateUniqueId('ViewThread' + id);
  tabStore.addTab({
    key: String(key),
    icon: "/assets/loading.svg",
    title: "正在加载",
    component: ViewThread,
    props: { tid: id, key_: key, onUserNameClicked: userNameClicked, onBarNameClicked: onBarNameClicked },

    origin: ({ icon: "/assets/loading.svg", title: "正在加载" } as unknown) as import('@/types/common').TabItem
  });
};

const onBarNameClicked = (barName: string | undefined): void => {
  if (barName === undefined) throw new Error("吧名为空！");

  const key = generateUniqueId('ViewBarThreads' + barName);
  tabStore.addTab({
    key: String(key),
    icon: "/assets/loading.svg",
    title: "正在加载",
    component: ViewBarThreads,
    props: { key_: key, barName: barName, onThreadClick: onBarThreadClick, onUserNameClicked: userNameClicked, onSearchInBar: onSearchInBar },
    origin: ({ icon: "/assets/loading.svg", title: "正在加载" } as unknown) as import('@/types/common').TabItem
  });
};

const userNameClicked = (uid: string | number | undefined): void => {
  if (uid === undefined) throw new Error('用户ID为空！');

  const key = generateUniqueId('User' + uid);
  tabStore.addTab({
    key: String(key),
    icon: "/assets/loading.svg",
    title: "正在加载",
    component: User,
    props: { key_: key, uid: uid, onThreadClicked: onBarThreadClick },
    origin: ({ icon: "/assets/loading.svg", title: "正在加载" } as unknown) as import('@/types/common').TabItem
  });
};

const onSearchInBar = (data: SearchInBarData): void => {
  const key = generateUniqueId('Search' + data.barName);
  tabStore.addTab({
    key: String(key),
    icon: "/assets/search.svg",
    title: "吧内搜索",
    component: SearchInBar,
    props: {
      key_: key,
      barName: data.barName,
      barIcon: data.barIcon,
      onBarNameClicked: onBarNameClicked,
      onUserNameClicked: userNameClicked,
      onThreadClick: onBarThreadClick
    },

    origin: ({ icon: "/assets/search.svg", title: "吧内搜索" } as unknown) as import('@/types/common').TabItem
  });
};

const onFavouriteClicked = (): void => {
  const key = generateUniqueId('Favourite');
  tabStore.addTab({
    key: String(key),
    icon: "/assets/favourite.svg",
    title: "我的收藏",
    component: Favourite,
    props: { key_: key, onThreadClick: onBarThreadClick },

    origin: ({ icon: "/assets/favourite.svg", title: "我的收藏" } as unknown) as import('@/types/common').TabItem
  });
};

const openLocalThread = async (file: string): Promise<void> => {
  let tid = 0;
  try {
    const ret = JSON.parse(await read_file(file + '/page1.json'));
    tid = ret.thread.id;
    console.log(tid);
  } catch {
    throw new Error("目录无效");
  }

  const key = generateUniqueId('ViewThread' + tid);
  tabStore.addTab({
    key: String(key),
    icon: "/assets/loading.svg",
    title: "正在加载",
    component: ViewThread,
    props: {
      tid: tid,
      local: true,
      local_dir: file,
      key_: key,
      onUserNameClicked: userNameClicked,
      onBarNameClicked: onBarNameClicked
    },
    origin: ({ icon: "/assets/loading.svg", title: file } as unknown) as import('@/types/common').TabItem
  });
};

// Tab management
function onSwitchTabs(id: number): void {
  const tabItem = tabStore.getTab(id);
  if (!tabItem) return;
  activeTab.value = {
    component: tabItem.component,
    props: tabItem.props,
    key: tabItem.key,
    renderKey: tabItem.renderKey || String(tabItem.key),
    if: true,
    origin: {
      icon: tabItem.origin?.icon,
      title: tabItem.origin?.title
    }
  };

  naviListItem.value.forEach(element => {
    element.selected = false;
  });

  const componentName = (tabItem.component as { __name?: string }).__name;
  switch (componentName) {
    case 'Home':
      naviListItem.value[1].selected = true;
      break;
    case 'User':
    case 'ViewThread':
    case 'ViewBarThreads':
    case 'FollowBar':
      naviListItem.value[2].selected = true;
      break;
    case 'Favourite':
    case 'My':
      naviListItem.value[3].selected = true;
      break;
    case 'Search':
    case 'SearchInBar':
      naviListItem.value[0].selected = true;
      break;
    case 'Setting':
      naviListItem.value[4].selected = true;
      break;
    case 'Debug':
      if (naviListItem.value.length > 5) {
        naviListItem.value[5].selected = true;
      }
      break;
    default:
      break;
  }
}

function onRefreshTab(id: number): void {
  const tabItem = tabStore.getTab(id);
  if (!tabItem) return;
  const key = tabItem.key;
  const isActiveTab = (activeTab.value as TabItem).key === key;
  const newRenderKey = `${key}-${Date.now()}`;

  tabStore.setTab(id, {
    ...tabItem,
    renderKey: newRenderKey,
    icon: '/assets/loading.svg',
    title: '正在加载'
  });

  if (isActiveTab && activeTab.value && typeof activeTab.value === 'object') {
    activeTab.value = {
      ...activeTab.value,
      renderKey: newRenderKey,
      icon: '/assets/loading.svg',
      title: '正在加载'
    } as TabItem;
  }
}

const onDeactivated = (key: string | number): void => {
  console.log('Tab deactivated:', key);
};

const onTabDelete = (key: string | number): void => {
  if ((activeTab.value as TabItem).key === key) {
    activeTab.value = {};
  }
};

const addBar = async (id: number): Promise<void> => {
  naviListItem.value.forEach(element => {
    element.selected = false;
  });
  naviListItem.value[id].selected = true;

  let key: number;
  switch (id) {
    case 0:
      key = generateUniqueId('Search');
      tabStore.addTab({
        key: `${key}`,
        icon: "/assets/search.svg",
        title: "搜索",
        component: Search,
        props: { key_: key, onBarNameClicked: onBarNameClicked, onUserNameClicked: userNameClicked, onThreadClick: onBarThreadClick }
      });
      break;
    case 1:
      key = generateUniqueId('Home');
      tabStore.addTab({
        key: `${key}`,
        icon: '/assets/home.svg',
        title: '首页',
        component: Home,
        props: { key_: key, onBarNameClicked: onBarNameClicked, onUserNameClicked: userNameClicked, onThreadClick: onBarThreadClick }
      });
      break;
    case 2:
      key = generateUniqueId('FollowBar');
      tabStore.addTab({
        key: `${key}`,
        icon: "/assets/apps.svg",
        title: "进吧",
        component: FollowBar,
        props: { key_: key, onBarNameClicked: onBarNameClicked }
      });
      break;
    case 3:
      key = generateUniqueId('My');
      tabStore.addTab({
        key: `${key}`,
        icon: "/assets/user.svg",
        title: "我的",
        component: My,
        props: { key_: key, onFavouriteClicked: onFavouriteClicked, onUserNameClicked: userNameClicked, onThreadClicked: onBarThreadClick }
      });
      break;
    case 4:
      key = generateUniqueId('Setting');
      tabStore.addTab({
        key: `${key}`,
        icon: "/assets/settings.svg",
        title: "设置",
        component: Setting,
        props: { key_: key, onUserChanged: handleUserChanged }
      });
      break;
    case 5:
      key = generateUniqueId('Debug');
      tabStore.addTab({
        key: `${key}`,
        icon: "/assets/bug.svg",
        title: "调试",
        component: Debug,
        props: { key_: key, onOpenLocalThread: openLocalThread }
      });
      break;
    default:
      break;
  }
};

const onShowTabs = (): void => {
  showTabList.value = !showTabList.value;
  showNotificationBox.value = false;
};

const onShowNotificationBox = (): void => {
  showNotificationBox.value = !showNotificationBox.value;
  showTabList.value = false;
};

const handleUserChanged = async (): Promise<void> => {
  if (titleBarRef.value) {
    await titleBarRef.value.updateAvatar();
  }
};

// Lifecycle
onMounted(async (): Promise<void> => {
  await nextTick();
  isNotificationReady.value = true;

  errorService.addHandler(async (error: unknown, info: unknown): Promise<void> => {
    try {
      await safeAddNotification(
        String(info),
        '<span class="material-symbols-outlined" style="font-size: 17px;">bug_report</span>错误管理',
        Tip,
        null,
        { Tip: String(error) },
        60000
      );
    } catch (e) {
      console.error('Failed to show error notification:', e);
      alert('Error in application, failed to pop notification: please restart: \n' + error + '\n' + info);
    }
  });

  clipboardService.addHandler(async (url: string): Promise<void> => {
    try {
      if (processedUrls.value.find((u: string) => u === url)) return;

      const parser = new URLParser(url);
      if (parser.getProtocol().toLowerCase() === 'neotieba') {
        const params = parser.toObject().params;
        let jump_result: JumpResult | null = null;

        switch (parser.getPathname().toLowerCase()) {
          case 'viewthread': {
            const thread = await Api.get_post(Number(params?.tid), 1);
            jump_result = {
              onClick: (): void => onBarThreadClick(params?.tid),
              title: thread.data.thread.title,
              description: '来自 ' + thread.data.forum.name + '吧'
            };
            break;
          }
        }

        if (jump_result !== null) {
          await safeAddNotification(
            jump_result.title,
            '<span class="material-symbols-outlined" style="font-size: 17px;">content_paste</span>Clipboard 跳转',
            Tip,
            jump_result.onClick,
            { Tip: jump_result.description },
            60000
          );
        }
      }
    } catch (e) {
      // console.error('Clipboard handler error:', e);
    } finally {
      processedUrls.value.push(url);
    }
  });

  const key = generateUniqueId('Welcome');
  tabStore.addTab({ key: String(key), icon: "/assets/apps.svg", title: "欢迎", component: Welcome, props: { key_: key }, origin: ({ icon: "/assets/apps.svg", title: "欢迎" } as unknown) as import('@/types/common').TabItem });
});
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
      <div v-for="tab in tabStore.tabs" v-show="tab.key === activeTab.key" :key="tab.key" class="tab-pane">
        <keep-alive>
          <component @deactivated="onDeactivated(tab.key)" :is="tab.component" :key="tab.renderKey || tab.key"
            v-if="tab.if" v-bind="tab.props" />
        </keep-alive>
      </div>
    </div>
    <TitleBar ref="titleBarRef" title="" style="z-index: 0; left: 70px; width: calc(100% - 70px);"
      @showTabs="onShowTabs" @showNotificationBox="onShowNotificationBox"
      :msgCount="(notificationComponent?.notifications?.length || 0) + (notificationComponent?.hiddenNotifications?.length || 0)" />
    <Tabs class="tabs" @onSwitchTabs="onSwitchTabs" @onTabDelete="onTabDelete" @onTabRefresh="onRefreshTab">
    </Tabs>
    <Transition name="notification-box">
      <TabList class="notification-box" v-if="showTabList"></TabList>
    </Transition>
    <Transition name="notification-box">
      <Notification ref="notificationComponent" v-show="!showNotificationBox && !showTabList" />
    </Transition>
    <Transition name="notification-box">
      <NotificationBox class="notification-box" v-if="showNotificationBox && !showTabList && notificationComponent"
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
  z-index: 2000;
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
  transition: color 0.25s;
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
  cursor: pointer;
  outline: none;
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
