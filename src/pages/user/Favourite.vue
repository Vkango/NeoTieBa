<script setup lang="ts">
import { onMounted, ref, inject, type Ref } from 'vue';
import { getCurrentUserBduss } from '@/services/user-manage';
import { useApiStore } from '@/stores';
import ThreadLite from '@/components/thread/ThreadLite.vue';

// 类型定义
interface Props {
  key_: string | number;
}

interface Emits {
  (e: 'setTabInfo', info: { key: string | number; title: string; icon: string }): void;
  (e: 'threadClick', id: string | number): void;
}

interface ThreadAuthor {
  name_show?: string;
  name: string;
  user_portrait: string;
}

interface ThreadItem {
  thread_id: string | number;
  title: string;
  media?: any[];
  author: ThreadAuthor;
  last_time: number;
  is_deleted: boolean;
  forum_name: string;
  post_no_msg: string;
}

// Props & Emits
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Inject
const updateTabMeta = inject<(info: { key: string | number; title: string; icon: string }) => void>('updateTabMeta');

// State
const isLoading = ref<boolean>(true);
const isThreadsLoading = ref<boolean>(true);
const threadList: Ref<ThreadItem[]> = ref([]);
const offset = ref<number>(0);

// API实例
const apiStore = useApiStore();
const api = apiStore.getApi();
let bduss = '';

// 加载数据
const loadData = async (): Promise<void> => {
  try {
    isThreadsLoading.value = true;
    const response = await api.Favourite(bduss, offset.value);
    threadList.value = [...threadList.value, ...response.store_thread];
  } catch (error) {
    console.error('加载收藏列表失败:', error);
  } finally {
    isLoading.value = false;
    isThreadsLoading.value = false;
  }
};

// 生命周期
onMounted(async (): Promise<void> => {
  const bdussValue = await getCurrentUserBduss();
  bduss = `BDUSS=${bdussValue}`;
  await loadData();
  updateTabMeta?.({ key: props.key_, title: "我的收藏", icon: "/assets/favourite.svg" });
});

// 滚动处理
const onScroll = (target: HTMLElement): void => {
  const { scrollTop, clientHeight, scrollHeight } = target;
  if (scrollTop + clientHeight + 20 >= scrollHeight) {
    if (!isThreadsLoading.value) {
      offset.value += 20;
      loadData();
    }
  }
};

// 线程点击处理
const handleClick = (id: string | number): void => {
  emit('threadClick', id);
};
</script>

<template>
  <Container @yscroll="onScroll">
    <transition name="fade1">
      <div class="bgr" v-if="!isLoading">
        <div class="list-title">我的收藏</div>
        <div style="display: flex; gap: 10px; flex-direction: row; flex-wrap: wrap;">
          <ThreadLite @click="handleClick(item.thread_id)" v-for="item in threadList" :thread_title="item.title"
            :media="item.media" :user_name="item.author.name_show || item.author.name"
            :avatar="item.author.user_portrait" :create_time="item.last_time"
            :style="{ opacity: item.is_deleted ? 0.5 : 1 }"
            :msg="item.is_deleted ? '贴子以被删除' : item.forum_name + '吧 | ' + (item.post_no_msg == '' ? '无更新' : item.post_no_msg)">
          </ThreadLite>
        </div>

      </div>
    </transition>
    <transition name="fade1">
      <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
    </transition>
  </Container>
</template>

<style scoped>
.bgr {
  width: 80%;
  padding: 0 10px;
  justify-self: center;
}

.thread {
  width: 100%;
}

.desc {
  font-size: 13px;
  opacity: 0.5;
  margin-top: 5px;
}

.bar-name {
  font-size: 16px;
  font-weight: bold;
  width: 200px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
}

.bar-button {
  display: flex;
  gap: 10px;
  background-color: rgba(var(--text-color), 0.05);
  box-shadow: none;
  width: 300px;
  text-align: left;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px 15px;
  border-radius: 5px;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}

.list-title {
  padding: 10px 5px;
  font-size: 16px;
  font-weight: bold;
  position: relative;
}
</style>