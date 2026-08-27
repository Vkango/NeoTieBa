<script setup lang="ts">
import { onMounted, ref, computed, inject, type ComputedRef, type Ref } from 'vue';
import { getUserList, type User } from '@/services/user-manage';
import type { SettingItem, MenuSettingItem, InfoItem } from '@/types/settings';
import { useSettingsStore } from '@/stores/settings';
import { fetchText } from '@/core/request';
import { invoke } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';
import { WALLPAPER_EFFECT_OPTIONS } from '@/stores/settings';

// Props 定义
interface Props {
  key_: string | number;
}

const props = defineProps<Props>();

// Emits 定义
interface Emits {
  (e: 'setTabInfo', info: { key: string | number; title: string; icon: string }): void;
  (e: 'userChanged'): void;
}

const emit = defineEmits<Emits>();

// Inject
const updateTabMeta = inject<(info: { key: string | number; title: string; icon: string }) => void>('updateTabMeta');
const settingsStore = useSettingsStore();
const connectionTestDesc = ref('测试当前网络配置是否可用');
const wallpaperDesc = ref('选择本地图片作为背景壁纸');

// State 定义
const user: Ref<User[]> = ref([]);
const showUserManage = ref<boolean>(false);
const currentPage = ref<number>(0);
const generalSettingItems = ref<MenuSettingItem[]>([{
  title: '显示',
  icon: '/assets/personalize.svg',
  id: 0,
},
{
  title: '网络',
  icon: '/assets/network_check.svg',
  id: 1,
}, {
  title: '关于',
  icon: '/assets/info.svg',
  id: 2,
}]);

const pluginSettings: Ref<MenuSettingItem[]> = ref([{
  title: '插件管理',
  icon: '/assets/plugin.svg',
  id: 3,
}, {
  title: '自动签到',
  icon: '/assets/plugin.svg',
  id: 4,
}, {
  title: '屏蔽列表',
  icon: '/assets/plugin.svg',
  id: 5,
}, {
  title: '喝水小助手',
  icon: '/assets/plugin.svg',
  id: 6,
}]);

pluginSettings.value = [];

const currentSettingItems: Ref<InfoItem[]> = ref([
  { title: 'NeoTieBa', icon: 'rocket', desc: 'InDev 2025', id: 7 },
  { title: '更新历史', icon: 'history', desc: '查看拉了什么史' },
  { title: '联系', icon: 'hub', desc: '查看项目地址 (GitHub)' },
  { title: '作者', icon: 'person', desc: 'Vkango' },
  { title: '警告', icon: 'warning', desc: '仅供学习交流使用，出现的任何后果作者概不负责。' },
  { title: '检查更新', icon: 'update', desc: '不知道有没有更新 (因为没服务器' }
]);

// 设置项配置
const displaySettings: ComputedRef<SettingItem[]> = computed(() => [
  { id: 'show_user_id', icon: 'person', title: '同时显示用户名与 ID', type: 'toggle', desc: '在帖子中同时显示用户名和用户 ID', value: settingsStore.showUserId },
  { id: 'only_author', icon: 'person', title: '默认只看楼主', type: 'toggle', desc: '打开帖子时优先只显示楼主内容', value: settingsStore.onlyAuthor },
  { id: 'no_image', icon: 'image_not_supported', title: '无图模式', type: 'toggle', desc: '减少图片加载，节省流量和内存', value: settingsStore.noImage },
  {
    id: 'theme',
    icon: 'palette',
    title: '主题',
    type: 'select',
    desc: '选择应用的显示风格',
    value: settingsStore.theme,
    options: [
      { label: '跟随系统', value: 'auto' },
      { label: '浅色', value: 'light' },
      { label: '深色', value: 'dark' },
    ],
  },
  { id: 'wallpaper_accent', icon: 'contrast', title: '背景亮度', type: 'slider', desc: '亮度越高底色越淡 (0-100)', value: settingsStore.wallpaperAccent ?? 0, min: 0, max: 100 },
  {
    id: 'wallpaper_effect',
    icon: 'blur_on',
    title: '背景选项',
    type: 'select',
    desc: '图片 / Acrylic / Mica / 纯色，切换即时生效',
    value: settingsStore.wallpaperEffect,
    options: WALLPAPER_EFFECT_OPTIONS,
  },

  ...(settingsStore.wallpaperEffect === 'image'
    ? [
      { id: 'wallpaper', icon: 'wallpaper', title: '壁纸图片', type: 'button' as const, desc: wallpaperDesc.value, action: 'wallpaper' },
      { id: 'wallpaper_blur', icon: 'blur_on', title: '壁纸模糊', type: 'slider' as const, desc: '数字越大越模糊，0 为不模糊 (0-200)', value: settingsStore.wallpaperBlur ?? 0, min: 0, max: 200 },
      { id: 'wallpaper_remove', icon: 'wallpaper', title: '移除壁纸', type: 'button' as const, desc: '恢复默认背景', action: 'remove_wallpaper' },
    ]
    : []),
  ...(settingsStore.wallpaperEffect === 'solid'
    ? [{
      id: 'wallpaper_solid_color',
      icon: 'colorize',
      title: '纯色背景颜色',
      type: 'color' as const,
      desc: '选择纯色模式的背景颜色',
      value: settingsStore.wallpaperSolidColor,
    }]
    : []),
]);

const networkSettings: ComputedRef<SettingItem[]> = computed(() => [
  { id: 'use_proxy', icon: 'settings', title: '使用代理', type: 'toggle', desc: '让 API 请求走下面填写的代理地址', value: settingsStore.useProxy },
  { id: 'proxy_url', icon: 'link', title: '代理地址', type: 'input', desc: '例如 http://127.0.0.1:7890', value: settingsStore.proxyUrl, placeholder: 'http://127.0.0.1:7890' },
  { id: 'connection_test', icon: 'network_check', title: '连接测试', type: 'button', desc: connectionTestDesc.value, action: 'test' },
  { id: 'devtools', icon: 'bug_report', title: '打开开发者工具', type: 'button', desc: '打开 DevTools 调试窗口', action: 'devtools' },
]);

// Computed
const currentUser: ComputedRef<User | undefined> = computed(() => {
  return user.value.find((u: User) => u.current);
});

// 加载用户列表
const loadUsers = async (): Promise<void> => {
  try {
    user.value = await getUserList();
  } catch (error) {
    console.error('加载用户列表失败:', error);
    user.value = [];
  }
};

// 生命周期钩子
onMounted(async (): Promise<void> => {
  await loadUsers();
  updateTabMeta?.({ key: props.key_, title: "设置", icon: "/assets/settings.svg" });
});

// 打开用户管理
const openUserManage = (): void => {
  showUserManage.value = true;
};

// QR登录处理
const handleQRLogin = (): void => {
  showUserManage.value = false;
};

// 用户变更处理
const handleUserChanged = async (): Promise<void> => {
  await loadUsers();
  emit('userChanged');
};

const updateSetting = (id: string, value: string | boolean | number): void => {
  if (['show_user_id', 'only_author', 'no_image', 'theme', 'wallpaper_path', 'wallpaper_accent', 'wallpaper_blur', 'wallpaper_effect', 'wallpaper_solid_color'].includes(id)) {
    settingsStore.updateDisplaySetting(id, value);
    return;
  }

  if (['use_proxy', 'proxy_url'].includes(id)) {
    settingsStore.updateNetworkSetting(id, value);
  }
};

const pickWallpaper = async (): Promise<void> => {
  wallpaperDesc.value = '正在选择...';
  try {
    const path = await settingsStore.pickWallpaper();
    wallpaperDesc.value = path
      ? `当前壁纸: ${path.split(/[\\/]/).pop() || path}`
      : '选择壁纸图片作为背景';
  } catch (error) {
    wallpaperDesc.value = '选择壁纸失败';
    throw error;
  }
};

const removeWallpaper = (): void => {
  settingsStore.removeWallpaper();
  wallpaperDesc.value = '已恢复默认背景';
};

// 连接测试
const testConnection = async (): Promise<void> => {
  connectionTestDesc.value = '测试中...';
  const startedAt = performance.now();

  try {
    await fetchText('https://tieba.baidu.com', {
      proxyUrl: settingsStore.useProxy ? settingsStore.proxyUrl : undefined,
    });
    connectionTestDesc.value = `连接正常，用时 ${Math.round(performance.now() - startedAt)}ms`;
  } catch (error) {
    connectionTestDesc.value = error instanceof Error ? error.message : '连接失败';
  }
};

const handleSettingAction = (setting: SettingItem): void => {
  if ('action' in setting && setting.action === 'test') {
    testConnection();
  } else if ('action' in setting && setting.action === 'devtools') {
    openDevTools();
  } else if ('action' in setting && setting.action === 'wallpaper') {
    pickWallpaper();
  } else if ('action' in setting && setting.action === 'remove_wallpaper') {
    removeWallpaper();
  }
};

const openDevTools = (): void => {
  invoke('toggle_devtools').catch((error) => {
    console.error('切换开发者工具失败:', error);
  });
};

const openProjectUrl = (): void => {
  openUrl('https://github.com/Vkango/NeoTieBa');
};

// 滚动处理
const onScroll = (_target: HTMLElement): void => {

};


</script>

<template>
  <Container class="page" :tab-key="props.key_" :scroll-key="`setting-${props.key_}`" @yscroll="onScroll">
    <div style="width: 80%; justify-self: center; padding-top: 20px;">

      <div style="display: flex; gap: 15px; margin-top: 10px;">

        <div style="display: flex; flex-direction: column; width: 25%; min-width: 200px; gap: 10px">
          <!-- 用户信息区域 -->
          <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px">
            <RippleButton
              style="background-color: transparent; box-shadow: none; padding: 0; width: 100%; min-width: 200px;"
              @click="openUserManage">

              <div v-if="currentUser" style="display: flex; gap: 10px; text-align: left; width: 100%;">
                <img class="avatar" :src="currentUser.avatar || ''" referrerpolicy="no-referrer">
                <div style="display: flex; flex-direction: column; flex: 1; min-width: 0;">
                  <div
                    style="font-weight: bold; color: rgb(var(--text-color)); font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    {{ currentUser.user_name || currentUser.username }}
                  </div>
                  <div style="text-align: left; font-size: 13px; color: rgba(var(--text-color), 0.5)">
                    轻按进入账号管理
                  </div>
                </div>
              </div>

              <div v-else style="display: flex; gap: 10px; text-align: left; width: 100%; align-items: center;">
                <div class="avatar-placeholder">
                  <span class="material-symbols-outlined">person_off</span>
                </div>
                <div style="display: flex; flex-direction: column; flex: 1;">
                  <div style="font-weight: bold; color: rgb(var(--text-color)); font-size: 16px;">
                    未登录
                  </div>
                  <div style="text-align: left; font-size: 13px; color: rgba(var(--text-color), 0.5)">
                    轻按登录账号
                  </div>
                </div>
              </div>
            </RippleButton>
          </div>

          <div class="filter-button" style="padding: 0 8px">通用</div>
          <RippleButton v-for="item in generalSettingItems" :key="item.id" class="filter-button"
            :class="{ selected: item.id === currentPage }" @click="currentPage = item.id"
            style="box-shadow: none; padding: 6px 8px; justify-self: right; font-size: 14px;opacity: 1;">
            <div style="display: flex; gap: 10px; align-items: center;">
              <img :src="item.icon" width="16px" class="icon_">
              <span>{{ item.title }}</span>
            </div>
          </RippleButton>
          <div v-if="pluginSettings.length" class="filter-button" style="padding: 0 8px">插件</div>
          <RippleButton v-for="item in pluginSettings" :key="item.id" class="filter-button"
            :class="{ selected: item.id === currentPage }" @click="currentPage = item.id"
            style="box-shadow: none; padding: 6px 8px; justify-self: right; font-size: 14px; opacity: 1;">
            <div style="display: flex; gap: 10px; align-items: center;">
              <img :src="item.icon" width="16px" class="icon_">
              <span>{{ item.title }}</span>
            </div>
          </RippleButton>
        </div>

        <!-- 设置内容区域 -->
        <div style="width: 100%;">
          <!-- 显示设置 -->
          <div v-if="currentPage === 0" class="settings-content">
            <div style="display: flex; text-align: left; gap: 10px; align-items: center; margin-bottom: 20px;">
              <div style="font-size: 25px; font-weight: bold;">显示</div>
            </div>
            <div class="setting-section">
              <Item v-for="setting in displaySettings" :key="setting.id" :title="setting.title" :desc="setting.desc"
                :icon="setting.icon" :type="setting.type" :value="'value' in setting ? setting.value : undefined"
                @update:value="updateSetting(setting.id, $event)" :options="'options' in setting ? setting.options : []"
                :placeholder="'placeholder' in setting ? setting.placeholder : undefined"
                :min="'min' in setting ? setting.min : undefined" :max="'max' in setting ? setting.max : undefined"
                :step="'step' in setting ? setting.step : undefined" @click="handleSettingAction(setting)" />
            </div>
          </div>

          <!-- 网络设置 -->
          <div v-if="currentPage === 1" class="settings-content">
            <div style="display: flex; text-align: left; gap: 10px; align-items: center; margin-bottom: 20px;">
              <div style="font-size: 25px; font-weight: bold;">网络</div>
            </div>
            <div class="setting-section">
              <Item v-for="setting in networkSettings" :key="setting.id" :title="setting.title" :desc="setting.desc"
                :icon="setting.icon" :type="setting.type" :value="'value' in setting ? setting.value : undefined"
                @update:value="updateSetting(setting.id, $event)" :options="'options' in setting ? setting.options : []"
                :placeholder="'placeholder' in setting ? setting.placeholder : undefined"
                @click="handleSettingAction(setting)" />
            </div>
          </div>

          <!-- 关于 -->
          <div v-if="currentPage === 2" class="settings-content">
            <div style="display: flex; text-align: left; gap: 10px; align-items: center; margin-bottom: 15px;">
              <div style="font-size: 25px; font-weight: bold;">关于</div>
              <div
                style=" display: flex; align-items: center; gap: 10px; background-color: rgba(255,193, 49, 0.15); padding-right: 10px; border-radius: 5px; margin-left: auto;">
                <span
                  style="font-size: 14px; font-weight: bold; padding: 5px 10px; background-color: rgba( 36,200,219, 0.15); border-radius: 5px 0px 0px 5px;">Built
                  with</span>
                <img src="/assets/tauri-logo.svg" height="20px">
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px">
              <Item v-for="item in currentSettingItems" :key="item.id" :icon="item.icon" :title="item.title"
                :desc="item.desc" style="width: 100%;" @click="item.title === '联系' ? openProjectUrl() : null"></Item>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UserManageCard :visible="showUserManage" @close="showUserManage = false" @qrLogin="handleQRLogin"
      @userChanged="handleUserChanged" />
  </Container>
</template>

<style scoped>
.filter-button.selected {
  background-color: rgba(var(--text-color), 0.05);
  font-weight: bold;
}

.filter-button:hover {
  opacity: 0.5;
}

.filter-button {
  background-color: transparent;
  font-weight: normal;
}

.navi-bar {
  text-align: left;
}

.current-user {
  width: 100%;
  padding: 6px 8px;
  border-radius: 5px;
  background-color: rgba(var(--text-color), 0.1);
  gap: 10px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  object-fit: cover;
}

.avatar-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: rgba(var(--text-color), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-placeholder .material-symbols-outlined {
  font-size: 28px;
  color: rgba(var(--text-color), 0.4);
}

.settings-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.setting-section {
  display: flex;
  flex-direction: column;
  gap: 10px
}
</style>
