<template>
  <Container :tab-key="props.key_" :scroll-key="`home-${props.key_}`" @yscroll="onScroll">
    <transition name="fade1">
      <div v-if="!isLoading" class="bgr">
        <div class="list-title">为你推荐</div>
        <div class="thread-list">
          <Thread @openUser="emit('openUser', item.author.id)" @openThread="emit('openThread', item.id)"
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

interface Props {
  key_: string | number;
}

interface Emits {
  (e: 'openThread', id: string | number): void;
  (e: 'setTabInfo', info: { key: string | number; title: string; icon: string }): void;
  (e: 'openUser', uid: string | number): void;
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

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const updateTabMeta = inject<(info: { key: string | number; title: string; icon: string; icon_invert?: boolean }) => void>('updateTabMeta');

const returnData: Ref<RecommendData> = ref({ thread_list: [] });
const isLoading = ref<boolean>(true);
const isThreadsLoading = ref<boolean>(true);
const threadList: Ref<ThreadItem[]> = ref([]);
const currentPage = ref<number>(1);

const apiStore = useApiStore();
const api = apiStore.getApi();

const loadData = async (): Promise<void> => {
  try {
    isThreadsLoading.value = true;

    const user: User = await getCurrentUser();
    const response = await api.getHomeRecommend(user.bduss, user.stoken);
    returnData.value = response.data;

    if ((window as any).pluginManager) {
      returnData.value = await (window as any).pluginManager.dispatchEvent(
        'threadListUpdated',
        returnData.value
      );
    }

    threadList.value = [...threadList.value, ...returnData.value.thread_list];
  } catch (error) {
    console.error('加载推荐内容失败:', error);
  } finally {
    isThreadsLoading.value = false;
  }
};

onMounted(async (): Promise<void> => {
  updateTabMeta?.({ key: props.key_, title: '首页', icon: '/assets/home.svg', icon_invert: true });
  isLoading.value = true;
  await loadData();
  isLoading.value = false;
});

const onScroll = (target: HTMLElement): void => {
  const { scrollTop, clientHeight, scrollHeight } = target;
  if (scrollTop + clientHeight + 20 >= scrollHeight) {
    if (!isThreadsLoading.value) {
      nextPage();
    }
  }
};

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
