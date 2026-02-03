<script setup lang="ts">
import { onMounted, ref, computed, inject, type ComputedRef, type Ref } from 'vue';
import { getUserList, type User } from '@/services/user-manage';
import type { SettingItem, MenuSettingItem, InfoItem } from '@/types/settings';

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

const currentSettingItems: Ref<InfoItem[]> = ref([
  { title: 'NeoTieBa', icon: 'rocket', desc: 'InDev 2025', id: 7 },
  { title: '更新历史', icon: 'history', desc: '查看拉了什么史' },
  { title: '联系', icon: 'hub', desc: '查看项目地址 (GitHub)' },
  { title: '作者', icon: 'person', desc: 'Vkango' },
  { title: '警告', icon: 'warning', desc: '仅供学习交流使用，出现的任何后果作者概不负责。' },
  { title: '检查更新', icon: 'update', desc: '不知道有没有更新 (因为没服务器' }
]);

// 设置项配置
const displaySettings: Ref<SettingItem[]> = ref([
  { id: 'show_user_id', icon: 'person', title: '同时显示用户名与ID', type: 'toggle', desc: '在帖子中同时显示用户名和用户ID', value: false },
  { id: 'only_author', icon: 'person', title: '默认只看楼主', type: 'toggle', desc: '只显示楼主的帖子内容', value: false },
  { id: 'no_image', icon: 'image_not_supported', title: '无图模式', type: 'toggle', desc: '禁用图片显示以节省流量', value: false },
  { id: 'theme', icon: 'palette', title: '主题', type: 'select', desc: '选择应用的主题风格', value: 'auto', options: ['跟随系统', '浅色', '深色'] }
]);

const networkSettings: Ref<SettingItem[]> = ref([
  { id: 'use_proxy', icon: 'settings', title: '使用代理', type: 'toggle', desc: '启用或禁用代理服务器', value: false },
  { id: 'proxy_url', icon: 'link', title: '代理地址', type: 'input', desc: '代理服务器的地址', value: '', placeholder: 'http://127.0.0.1:7890' },
  { id: 'connection_test', icon: 'network_check', title: '连接测试', type: 'button', desc: '测试连接是否成功', action: 'test' }
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

// 连接测试
const testConnection = (): void => {

};

// 滚动处理
const onScroll = (_target: HTMLElement): void => {

};


</script>

<template>
  <Container class="page" @yscroll="onScroll">
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
          <div class="filter-button" style="padding: 0 8px">插件</div>
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
                :icon="setting.icon" :type="setting.type" :value="(setting as any).value"
                @update:value="(setting as any).value = $event" :options="(setting as any).options"
                :placeholder="(setting as any).placeholder" />
            </div>
          </div>

          <!-- 网络设置 -->
          <div v-if="currentPage === 1" class="settings-content">
            <div style="display: flex; text-align: left; gap: 10px; align-items: center; margin-bottom: 20px;">
              <div style="font-size: 25px; font-weight: bold;">网络</div>
            </div>
            <div class="setting-section">
              <Item v-for="setting in networkSettings" :key="setting.id" :title="setting.title" :desc="setting.desc"
                :icon="setting.icon" :type="setting.type" :value="(setting as any).value"
                @update:value="(setting as any).value = $event" :options="(setting as any).options"
                :placeholder="(setting as any).placeholder"
                @click="(setting as any).action === 'test' ? testConnection() : null" />
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
                :desc="item.desc" style="width: 100%;"></Item>
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
