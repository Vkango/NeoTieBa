<script setup lang="ts">
import { computed, ref, onMounted, inject, type Ref } from 'vue';
import { useApiStore } from '@/stores';
import PinnedThread from '@/components/thread/PinnedThread.vue';
import Thread from '@/components/thread/Thread.vue';
import BarInfoCard from '@/components/user/BarInfoCard.vue';
import { getCurrentUser, type User as ManagedUser } from '@/services/user-manage';
import domToImage from 'dom-to-image';

interface Props {
  barName: string;
  key_: string | number;
}

interface Emits {
  (e: 'setTabInfo', info: { key: string | number; title: string; icon: string }): void;
  (e: 'openSearchInBar', data: { barName: string; barIcon: string }): void;
  (e: 'openUser', uid: string | number): void;
  (e: 'openThread', id: string | number): void;
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
  view_num: number;
  [key: string]: unknown;
}

interface User {
  id: string | number;
  name: string;
  name_show?: string;
  portrait: string;
  ip_address: string;
  [key: string]: unknown;
}

interface ForumData {
  forum: {
    name: string;
    id?: string | number;
    avatar: string;
    slogan?: string;
    member_num?: number;
    post_num?: number;
    thread_num?: number;
    first_class?: string;
    second_class?: string;
    managers?: Array<{
      id?: string | number;
      name?: string;
      show_name?: string;
      portrait?: string;
      level?: number;
      level_id?: number;
      [key: string]: unknown;
    }>;
    cur_score?: number;
    level_id?: number;
    level_name?: string;
    levelup_score?: number;
    user_level?: number;
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
const sendToast = inject<(title: string, duration: number) => void>('sendToast');

// State
const BAR_SORT_REPLY = 6;
const BAR_SORT_CREATE = 1;
const barDetailVisible: Ref<boolean> = ref<boolean>(false);
const captureRef = ref<HTMLElement | null>(null);

const handleShare = async () => {
  if (!captureRef.value || !openImageViewer) return;
  try {
    const dataUrl = await domToImage.toPng(captureRef.value, {
      bgcolor: '#1e1e1e',
      filter: (node: Node) => {
        // Skip external stylesheets and CORS-restricted images
        if (node instanceof HTMLLinkElement && node.rel === 'stylesheet') {
          return !node.href.includes('fonts.googleapis.com');
        }
        if (node instanceof HTMLImageElement) {
          // Allow data URLs and same-origin images
          return node.src.startsWith('data:') ||
            node.src.startsWith(window.location.origin) ||
            node.hasAttribute('crossorigin');
        }
        return true;
      },
      imagePlaceholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzMzMiLz48L3N2Zz4='
    });
    openImageViewer(dataUrl);
  } catch (error) {
    console.error('Failed to generate share image:', error);
    sendToast?.('生成分享图片失败', 2000);
  }
};

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
const currentUser = ref<ManagedUser | null>(null);
const isGoodOnly = ref<boolean>(false);
const threadSortType = ref<number>(BAR_SORT_REPLY);
const threadScopeLabel = computed(() => isGoodOnly.value ? '精华帖子' : '全部帖子');
const threadSortLabel = computed(() => threadSortType.value === BAR_SORT_CREATE ? '发布时间排序' : '回复时间排序');
const themeColor = computed(() => {
  const color = returnData.value.forum.theme_color?.dark?.light_color?.replace('#', '');
  return color ? `#${color}` : 'var(--text-color)';
});
const forumLevelId = computed(() => Number(returnData.value.forum.level_id ?? returnData.value.forum.user_level ?? 0));
const forumLevelName = computed(() => returnData.value.forum.level_name?.trim() || '吧等级');
const forumCurScore = computed(() => Math.max(0, Number(returnData.value.forum.cur_score ?? 0)));
const forumLevelupScore = computed(() => Math.max(0, Number(returnData.value.forum.levelup_score ?? 0)));
const levelProgressPercent = computed(() => {
  if (forumLevelupScore.value <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((forumCurScore.value / forumLevelupScore.value) * 100));
});
const levelScoreText = computed(() => {
  if (forumLevelupScore.value <= 0) {
    return `${forumCurScore.value}`;
  }
  return `${forumCurScore.value}/${forumLevelupScore.value}`;
});

// API实例
const apiStore = useApiStore();
const api = apiStore.getApi();

const loadCurrentUser = async (): Promise<void> => {
  if (currentUser.value) {
    return;
  }

  try {
    currentUser.value = await getCurrentUser();
  } catch {
    currentUser.value = null;
  }
};

// 搜索吧内
const openSearchInBar = (): void => {
  emit('openSearchInBar', {
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
  emit('openUser', uid);
};

// 线程点击
const handleClick = (id: string | number): void => {
  emit('openThread', id);
};

// 下一页
const nextPage = async (): Promise<void> => {
  currentPage.value++;
  await loadData();
};

const resetThreadList = (): void => {
  currentPage.value = 1;
  pinnedThreadList.value = [];
  threadList.value = [];
  returnData.value = {
    ...returnData.value,
    thread_list: [],
    user_list: [],
    page: { has_more: 1 }
  };
};

const reloadThreads = async (): Promise<void> => {
  if (isThreadsLoading.value) {
    return;
  }

  resetThreadList();
  await loadData();
};

const toggleThreadScope = async (): Promise<void> => {
  if (isThreadsLoading.value) {
    return;
  }

  isGoodOnly.value = !isGoodOnly.value;
  await reloadThreads();
};

const toggleThreadSort = async (): Promise<void> => {
  if (isThreadsLoading.value) {
    return;
  }

  threadSortType.value = threadSortType.value === BAR_SORT_CREATE ? BAR_SORT_REPLY : BAR_SORT_CREATE;
  await reloadThreads();
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
    await loadCurrentUser();

    // 获取吧数据
    let data = await api.browseBar(props.barName, currentPage.value, {
      isGood: isGoodOnly.value,
      sortType: threadSortType.value,
      bduss: currentUser.value?.bduss,
      stoken: currentUser.value?.stoken
    });

    // 通过插件管理器处理数据
    const win = window as unknown as { pluginManager?: { dispatchEvent: (event: string, data: ForumData) => Promise<ForumData> } };
    if (win.pluginManager) {
      data = await win.pluginManager.dispatchEvent('threadListUpdated', data);
    }

    returnData.value = data;

    // 首页特殊处理
    if (currentPage.value === 1) {
      await loadForumLevelInfo();

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

    const rawColor = String(returnData.value.forum.theme_color?.dark?.light_color ?? '').replace('#', '').trim();
    const isValidHex = /^[0-9a-fA-F]{6}$/.test(rawColor);
    if (!isValidHex) {
      if (!returnData.value.forum.theme_color) {
        returnData.value.forum.theme_color = {};
      }
      if (!returnData.value.forum.theme_color.dark) {
        returnData.value.forum.theme_color.dark = {};
      }
      returnData.value.forum.theme_color.dark.light_color = '000000';
    }

    const hex = isValidHex ? rawColor : '000000';
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

const loadForumLevelInfo = async (): Promise<void> => {
  const forumId = returnData.value.forum.id;
  const user = currentUser.value;

  if (!forumId || !user?.bduss) {
    return;
  }

  try {
    const response = await api.getUserForumLevelInfo(String(forumId), user.bduss, user.stoken);
    const userForumInfo = response?.data?.user_forum_info ?? {};

    returnData.value.forum = {
      ...returnData.value.forum,
      level_id: Number(userForumInfo.level_id ?? returnData.value.forum.level_id ?? 0),
      level_name: String(userForumInfo.level_name ?? returnData.value.forum.level_name ?? ''),
      cur_score: Number(userForumInfo.cur_score ?? returnData.value.forum.cur_score ?? 0),
      levelup_score: Number(userForumInfo.levelup_score ?? returnData.value.forum.levelup_score ?? 0),
    };
  } catch (error) {
    console.warn('Failed to load forum level info:', error);
  }
};

onMounted(async (): Promise<void> => {
  isLoading.value = true;
  await loadData();
  isLoading.value = false;
});
</script>

<template>
  <Container :tab-key="props.key_" :scroll-key="`bar-${props.key_}`" @yscroll="onScroll">
    <transition name="fade1">
      <div v-if="!isLoading" ref="captureRef">
        <div class="bar-banner">
          <div class="image-container">
            <img class="background-image" :src="returnData.forum.avatar" referrerpolicy="no-referrer">
          </div>
          <div class="banner-content">
            <img v-if="openImageViewer" class="avatar" :src="returnData.forum.avatar" referrerpolicy="no-referrer"
              @click="openImageViewer(returnData.forum.avatar)">
            <img v-else class="avatar" :src="returnData.forum.avatar" referrerpolicy="no-referrer">
            <div>
              <div class="title">
                {{ returnData.forum.name }}吧
                <RippleButton
                  style="padding: 4px; border-radius: 50%; background: transparent; box-shadow: none; vertical-align: middle;"
                  @click.stop="handleShare" title="生成长截图">
                  <span class="material-symbols-outlined" style="font-size: 20px;">share</span>
                </RippleButton>
              </div>
              <div class="description">{{ returnData.forum.slogan || '暂无简介' }}</div>
              <div class="level-info">
                <div class="level-text">
                  <span class="level-label" :style="{ color: themeColor }">Lv.{{ forumLevelId }}</span>
                  <span>{{ forumLevelName }}</span>
                </div>
                <div class="level-progress">
                  <div class="level-progress-bar"
                    :style="{ width: `${levelProgressPercent}%`, backgroundColor: themeColor }"></div>
                </div>
                <span class="level-score"> ({{ levelScoreText }})</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pinned-thread-list">
          <div class="thread-filter">
            <RippleButton class="filter-button" :class="{ active: isGoodOnly }"
              style="background-color: transparent; box-shadow: none; padding: 5px 10px; justify-self: right;"
              @click="toggleThreadScope">
              <div style="display: flex; gap: 10px; align-items: center;">
                <img src="/assets/chevrondown.svg" class="icon_">
                <span>{{ threadScopeLabel }}</span>
              </div>
            </RippleButton>
            <RippleButton class="filter-button" :class="{ active: threadSortType === BAR_SORT_CREATE }"
              style="background-color: transparent; box-shadow: none; padding: 5px 10px; justify-self: left;"
              @click="toggleThreadSort">
              <div style="display: flex; gap: 10px; align-items: center;">
                <img src="/assets/schedule.svg" width="18px" class="icon_">
                <span>{{ threadSortLabel }}</span>
              </div>
            </RippleButton>

            <RippleButton class="filter-button"
              style="background-color: transparent; box-shadow: none; padding: 5px 10px; justify-self: right;"
              @click="openSearchInBar()">
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
          <Thread @openUser="onUserNameClicked(item.author?.id || 0)" @openThread="handleClick(item.id)"
            v-for="item in threadList" :key="item.id" :thread_title="item.title" :media="(item.media || []) as any"
            :user_name="item.author?.name_show || item.author?.name || '匿名用户'" :avatar="item.author?.portrait || ''"
            :thread_content="(item.rich_abstract?.length === 0 || !Array.isArray(item.rich_abstract) ? [{ type: 0, text: item.title }] : item.rich_abstract) as any"
            :create_time="item.last_time_int" :reply_num="item.reply_num"
            :is_good="Boolean(item.isGood ?? item.is_good)" :theme_color="themeColor"></Thread>
        </div>
      </div>
    </transition>

    <transition name="fade1">
      <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
    </transition>

    <BarInfoCard :visible="barDetailVisible" :forumData="{
      id: String(returnData.forum.id || ''),
      name: returnData.forum.name || props.barName,
      avatar: returnData.forum.avatar || '',
      slogan: returnData.forum.slogan || '',
      member_num: Number(returnData.forum.member_num || 0),
      post_num: Number(returnData.forum.post_num || 0),
      thread_num: Number(returnData.forum.thread_num || 0),
      first_class: returnData.forum.first_class || '',
      second_class: returnData.forum.second_class || '',
      managers: Array.isArray(returnData.forum.managers) ? returnData.forum.managers : []
    }" @close="hidebarDetail" />
  </Container>
</template>

<style scoped>
.thread-filter {
  width: 80%;
  display: flex;
}

.filter-button {
  transition: background-color 0.2s ease;
}

.filter-button.active {
  background-color: rgba(var(--primary-color), 0.12) !important;
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
  opacity: 0.5;
}

.level-info {
  margin-top: 5px;
  width: min(360px, 44vw);
  display: flex;
  gap: 10px;
  font-size: 13px;
  align-items: center;
}

.level-text {
  display: flex;
  align-items: center;
  gap: 8px;

  line-height: 1.4;
  white-space: nowrap;
}

.level-label {
  font-weight: 700;
}

.level-score {
  opacity: 0.65;
}

.level-progress {
  width: 100%;
  height: 5px;
  margin-top: 6px;
  overflow: hidden;
  border-radius: 999px;
  background-color: rgba(var(--text-color), 0.14);
}

.level-progress-bar {
  height: 100%;
  min-width: 0;
  border-radius: inherit;
  transition: width 0.2s ease;
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
