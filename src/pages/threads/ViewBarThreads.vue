<script setup lang="ts">
import { ref, onMounted, inject, type Ref } from 'vue';
import { useApiStore } from '@/stores';
import PinnedThread from '@/components/thread/PinnedThread.vue';
import Thread from '@/components/thread/Thread.vue';
import BarInfoCard from '@/components/user/BarInfoCard.vue';

interface Props {
  barName: string;
  key_: string | number;
}

interface Emits {
  (e: 'setTabInfo', info: { key: string | number; title: string; icon: string }): void;
  (e: 'SearchInBar', data: { barName: string; barIcon: string }): void;
  (e: 'UserNameClicked', uid: string | number): void;
  (e: 'threadClick', id: string | number): void;
}

interface MediaItem {
  type: number;
  big_pic?: string;
  vpic?: string;
  [key: string]: unknown;
}

interface ThreadItem {
  id: string | number;
  is_top: number;
  author_id: string | number;
  author?: User;
  title: string;
  media?: MediaItem[];
  rich_abstract?: unknown[];
  last_time_int: number;
  reply_num: number;
  [key: string]: unknown;
}

interface User {
  id: string | number;
  name: string;
  name_show?: string;
  portrait: string;
  [key: string]: unknown;
}

interface ForumData {
  forum: {
    name: string;
    avatar: string;
    slogan?: string;
    theme_color?: {
      dark?: {
        light_color?: string;
      };
    };
  };
  thread_list: ThreadItem[];
  user_list: User[];
  page?: {
    has_more: number;
  };
}

// Props & Emits
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Injects
const openImageViewer = inject<(url: string) => void>('openImageViewer');
const updateTabMeta = inject<(info: { key: string | number; title: string; icon: string }) => void>('updateTabMeta');

// State
const barDetailVisible: Ref<boolean> = ref<boolean>(false);
const returnData: Ref<ForumData> = ref<ForumData>({
  forum: { name: '', avatar: '' },
  thread_list: [],
  user_list: []
});
const isLoading: Ref<boolean> = ref<boolean>(true);
const isThreadsLoading: Ref<boolean> = ref<boolean>(true);
const pinnedThreadList: Ref<ThreadItem[]> = ref<ThreadItem[]>([]);
const threadList: Ref<ThreadItem[]> = ref<ThreadItem[]>([]);
const currentPage: Ref<number> = ref<number>(1);

// API实例
const apiStore = useApiStore();
const api = apiStore.getApi();

// 搜索吧内
const SearchInBar = (): void => {
  emit('SearchInBar', {
    barName: props.barName,
    barIcon: returnData.value.forum.avatar
  });
};

// 显示/隐藏吧详情
const showbarDetail = (): void => {
  barDetailVisible.value = true;
};

const hidebarDetail = (): void => {
  barDetailVisible.value = false;
};

// 用户名点击
const onUserNameClicked = (uid: string | number): void => {
  emit('UserNameClicked', uid);
};

// 线程点击
const handleClick = (id: string | number): void => {
  emit('threadClick', id);
};

// 下一页
const nextPage = async (): Promise<void> => {
  currentPage.value++;
  await loadData();
};

// 滚动处理
const onScroll = (target: { scrollTop: number; clientHeight: number; scrollHeight: number }): void => {
  if ((target.scrollTop + target.clientHeight + 20 >= target.scrollHeight)) {
    if (isThreadsLoading.value || returnData.value.page?.has_more !== 1) {
      return;
    }
    nextPage();
  }
};

// 加载数据
const loadData = async (): Promise<void> => {
  try {
    isThreadsLoading.value = true;

    // 获取吧数据
    let data = await api.browseBar(props.barName, currentPage.value);

    // 通过插件管理器处理数据
    const win = window as unknown as { pluginManager?: { dispatchEvent: (event: string, data: ForumData) => Promise<ForumData> } };
    if (win.pluginManager) {
      data = await win.pluginManager.dispatchEvent('threadListUpdated', data);
    }

    returnData.value = data;

    // 首页特殊处理
    if (currentPage.value === 1) {
      updateTabMeta?.({
        key: props.key_,
        title: `${returnData.value.forum.name}吧`,
        icon: returnData.value.forum.avatar
      });

      // 提取置顶帖
      const pinnedThreads = returnData.value.thread_list.filter(item => item.is_top === 1);
      pinnedThreadList.value = [...pinnedThreadList.value, ...pinnedThreads];
    }

    // 过滤非置顶帖并去重
    const previousThreadLen = threadList.value.length;
    const existingIds = new Set(threadList.value.map(item => item.id));
    const newThreads = returnData.value.thread_list
      .filter(item => item.is_top !== 1)
      .filter(item => !existingIds.has(item.id));

    threadList.value = [...threadList.value, ...newThreads];

    // 关联作者信息
    const userMap = new Map(returnData.value.user_list.map(user => [user.id, user]));
    for (let i = previousThreadLen; i < threadList.value.length; i++) {
      threadList.value[i].author = userMap.get(threadList.value[i].author_id);
    }

    // 确保主题颜色存在
    if (!returnData.value?.forum?.theme_color?.dark?.light_color) {
      if (!returnData.value.forum.theme_color) {
        returnData.value.forum.theme_color = {};
      }
      if (!returnData.value.forum.theme_color.dark) {
        returnData.value.forum.theme_color.dark = {};
      }
      returnData.value.forum.theme_color.dark.light_color = '000000';
    }

    // 设置主题颜色
    const hex = returnData.value.forum.theme_color.dark.light_color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    document.documentElement.style.setProperty('--primary-color', `${r}, ${g}, ${b}`);

    // 检查亮度
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness < 50 && returnData.value.forum.theme_color?.dark) {
      returnData.value.forum.theme_color.dark.light_color = undefined;
    }
  } catch (error) {
    console.error('加载吧数据失败:', error);
  } finally {
    isThreadsLoading.value = false;
  }
};

onMounted(async (): Promise<void> => {
  isLoading.value = true;
  await loadData();
  isLoading.value = false;
});
</script>

<template>
  <Container @yscroll="onScroll">
    <transition name="fade1">
      <div v-if="!isLoading">
        <div class="bar-banner">
          <div class="image-container">
            <img class="background-image" :src="returnData.forum.avatar" referrerpolicy="no-referrer">
          </div>
          <div class="banner-content">
            <img v-if="openImageViewer" class="avatar" :src="returnData.forum.avatar" referrerpolicy="no-referrer"
              @click="openImageViewer(returnData.forum.avatar)">
            <img v-else class="avatar" :src="returnData.forum.avatar" referrerpolicy="no-referrer">
            <div>
              <div class="title">{{ returnData.forum.name }}吧</div>
              <div class="description">{{ returnData.forum.slogan || '暂无简介' }}</div>
              <div>
                登录以签到
              </div>
            </div>
          </div>
        </div>

        <div class="pinned-thread-list">
          <div class="thread-filter">
            <RippleButton class="filter-button"
              style="background-color: transparent; box-shadow: none; padding: 5px 10px; justify-self: right;">
              <div style="display: flex; gap: 10px; align-items: center;">
                <img src="/assets/chevrondown.svg" class="icon_">
                <span>全部贴子</span>
              </div>
            </RippleButton>
            <RippleButton class="filter-button"
              style="background-color: transparent; box-shadow: none; padding: 5px 10px; justify-self: left;">
              <div style="display: flex; gap: 10px; align-items: center;">
                <img src="/assets/schedule.svg" width="18px" class="icon_">
                <span>回复时间排序</span>
              </div>
            </RippleButton>

            <RippleButton class="filter-button"
              style="background-color: transparent; box-shadow: none; padding: 5px 10px; justify-self: right;"
              @click="SearchInBar()">
              <div style="display: flex; gap: 10px; align-items: center;">
                <img src="/assets/search.svg" width="18px" class="icon_">
                <span>吧内搜索</span>
              </div>
            </RippleButton>

            <RippleButton class="filter-button"
              style="background-color: transparent; box-shadow: none; padding: 5px 10px; justify-self: right;"
              @click="showbarDetail">
              <div style="display: flex; gap: 10px; align-items: center;">
                <img src="/assets/info.svg" width="18px" class="icon_">
                <span>吧信息</span>
              </div>
            </RippleButton>
          </div>
          <PinnedThread v-for="item in pinnedThreadList" :key="item.id" :title="item.title"
            @click="handleClick(item.id)"
            :color="returnData.forum.theme_color?.dark?.light_color ? '#' + returnData.forum.theme_color.dark.light_color : ''" />
        </div>

        <div class="thread-list">
          <Thread @UserNameClicked="onUserNameClicked(item.author?.id || 0)" @threadClicked="handleClick(item.id)"
            v-for="item in threadList" :key="item.id" :thread_title="item.title" :media="(item.media || []) as any"
            :user_name="item.author?.name_show || item.author?.name || '匿名用户'" :avatar="item.author?.portrait || ''"
            :thread_content="(item.rich_abstract?.length === 0 || !Array.isArray(item.rich_abstract) ? [{ type: 0, text: item.title }] : item.rich_abstract) as any"
            :create_time="item.last_time_int" :reply_num="item.reply_num"></Thread>
        </div>
      </div>
    </transition>

    <transition name="fade1">
      <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
    </transition>

    <BarInfoCard :visible="barDetailVisible" :forumData="{
      id: props.barName,
      name: returnData.forum.name || '',
      avatar: returnData.forum.avatar || '',
      slogan: returnData.forum.slogan || '',
      member_num: 0,
      post_num: 0,
      thread_num: 0,
      first_class: '',
      second_class: ''
    }" @close="hidebarDetail" />
  </Container>
</template>

<style scoped>
.thread-filter {
  width: 80%;
  display: flex;
}

.thread-list {
  padding: 10px;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.pinned-thread-list {
  padding: 10px;
  padding-bottom: 0;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.banner-content .title {
  font-size: 20px;
  font-weight: bold;
}

.banner-content .description {
  margin-top: 5px;
  opacity: 0.5;
}

.banner-content {
  position: absolute;
  top: 60px;
  padding: 15px 45px;
  display: flex;
  gap: 30px;
}

.bar-banner .background-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.image-container img {
  -webkit-mask-image: linear-gradient(rgba(0, 0, 0, 0.1), transparent);
  mask-image: linear-gradient(rgba(0, 0, 0, 0.1), transparent);
  filter: blur(20px);
}

.bar-banner .avatar {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.bar-banner .avatar:hover {
  transform: scale(1.05);
}

.bar-banner {
  width: 100%;
  height: 200px;
  position: relative;
}
</style>
