<template>
  <Container @yscroll="onScroll">
    <transition name="fade1">
      <div v-if="!isLoading" class="bgr">
        <div class="list-title">为你推荐</div>
        <div class="thread-list">
          <Thread @UserNameClicked="onUserNameClicked(item.author.id)" @threadClicked="handleClick(item.id)"
            v-for="item in threadList" :key="item.id" :thread_title="item.title"
            :media="(item.media || []) as MediaItem[]" :user_name="item.author.display_name || item.author.user_name"
            :avatar="item.author.portrait"
            :thread_content="item.rich_abstract?.length === 0 || !Array.isArray(item.rich_abstract) ? [{ type: 0, text: item.title }] : item.rich_abstract"
            :create_time="item.last_time_int" :reply_num="item.reply_num" :fromBar="item.forum.forum_name"
            :fromBarAvatar="item.forum.forum_avatar"></Thread>
        </div>
      </div>
    </transition>

    <transition name="fade1">
      <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
    </transition>

  </Container>
</template>
<script setup lang="ts">
import { onMounted, ref, inject, type Ref } from 'vue';
import { getCurrentUser, type User } from '@/services/user-manage';
import { useApiStore } from '@/stores';
import type { MediaItem } from '@/types/common';

// 类型定义
interface Props {
  key_: string | number;
}

interface Emits {
  (e: 'threadClick', id: string | number): void;
  (e: 'setTabInfo', info: { key: string | number; title: string; icon: string }): void;
  (e: 'UserNameClicked', uid: string | number): void;
}

interface ThreadAuthor {
  id: string | number;
  display_name?: string;
  user_name: string;
  portrait: string;
}

interface ThreadItem {
  id: string | number;
  title: string;
  media?: any[];
  author: ThreadAuthor;
  rich_abstract?: Array<{ type: number; text: string }>;
  last_time_int: number;
  reply_num: number;
  forum: {
    forum_name: string;
    forum_avatar: string;
  };
}

interface RecommendData {
  thread_list: ThreadItem[];
  [key: string]: any;
}

// Props & Emits
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Inject
const updateTabMeta = inject<(info: { key: string | number; title: string; icon: string }) => void>('updateTabMeta');

// State
const returnData: Ref<RecommendData> = ref({ thread_list: [] });
const isLoading = ref<boolean>(true);
const isThreadsLoading = ref<boolean>(true);
const threadList: Ref<ThreadItem[]> = ref([]);
const currentPage = ref<number>(1);

// API实例
const apiStore = useApiStore();
const api = apiStore.getApi();

// 加载数据
const loadData = async (): Promise<void> => {
  try {
    isThreadsLoading.value = true;

    const user: User = await getCurrentUser();
    const response = await api.getHomeRecommend(user.bduss, user.stoken);
    returnData.value = response.data;

    console.log('Home Recommend Data:', returnData.value);

    // 通过插件管理器处理数据
    if ((window as any).pluginManager) {
      returnData.value = await (window as any).pluginManager.dispatchEvent(
        'threadListUpdated',
        returnData.value
      );
    }

    // 合并线程列表
    threadList.value = [...threadList.value, ...returnData.value.thread_list];
  } catch (error) {
    console.error('加载推荐内容失败:', error);
  } finally {
    isThreadsLoading.value = false;
  }
};

// 生命周期
onMounted(async (): Promise<void> => {
  updateTabMeta?.({ key: props.key_, title: "首页", icon: "/assets/home.svg" });
  isLoading.value = true;
  await loadData();
  isLoading.value = false;
});

// 滚动处理
const onScroll = (target: HTMLElement): void => {
  const { scrollTop, clientHeight, scrollHeight } = target;
  if (scrollTop + clientHeight + 20 >= scrollHeight) {
    if (!isThreadsLoading.value) {
      nextPage();
    }
  }
};

// 线程点击处理
const handleClick = (id: string | number): void => {
  emit('threadClick', id);
};

// 用户名点击处理
const onUserNameClicked = (uid: string | number): void => {
  emit('UserNameClicked', uid);
};

// 加载下一页
const nextPage = async (): Promise<void> => {
  currentPage.value++;
  await loadData();
};
</script>
<style scoped>
.bgr {
  width: 80%;
  padding: 0 10px;
  justify-self: center;
}

.thread-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}


.thread {
  width: 100%;
}
</style>