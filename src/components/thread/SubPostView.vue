<template>
  <Container @yscroll="onScroll" style="background-color: transparent;">
    <div class="thread" @click.stop>
      <div class="user-info" @click="userNameClicked(props.uid)">
        <div class="avatar"><img class="avatar"
            :src="'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + avatar"></div>
        <div>
          <div class="user-name">{{ user_name }}<span class="level"
              :class="{ 'color1': (level || 0) >= 0 && (level || 0) < 4, 'color2': (level || 0) >= 4 && (level || 0) < 10, 'color3': (level || 0) >= 10 && (level || 0) < 16, 'color4': (level || 0) >= 16 }">{{
                level || 0 }} {{ is_lz ? '楼主' : '' }}</span>
          </div>
          <div class="desc">{{ getTimeInterval(props.create_time * 1000) }}</div>
        </div>


      </div>
      <div class="thread-preview">
        <div class="thread-content" v-html="content" style="user-select: text;" @click="handleClick">
        </div>
        <div class="thread-info">
          <!-- <button @click="dom2img">申必</button> -->
          <span class="material-symbols-outlined" style="font-size: 16px;">share</span>分享
          <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 10px;">thumb_up</span> {{ like }}
          赞
          <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 10px;">floor</span> {{ floor }} 楼
          <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 10px;"
            v-if="reply_num > 0">forum</span> <span v-if="reply_num > 0">{{ reply_num }} 回复</span>

        </div>
        <div class="subpost" v-if="reply_num > 0">
          <SubPost v-for="item in subpost_list" :thread_content="item.content" @userNameClicked="userNameClicked"
            :avatar="item.author.portrait" :uid="item.author.id" :user_name="item.author.name_show || item.author.name">
          </SubPost>
        </div>

      </div>
      <transition name="fade1">
        <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
      </transition>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import SubPost from './SubPost.vue';
import { getTimeInterval, processContentElements } from '@/utils/helper';
import { useSendToast, useImageViewer } from '@/composables/useGlobalProvides';
import { useApi } from '@/composables/useApi';

// 类型定义
interface Props {
  avatar: string;
  uid: string | number;
  user_name: string;
  thread_content: unknown[];
  like: number;
  is_lz: boolean;
  create_time: number;
  reply_num: number;
  tid: string;
  pid: string | number;
  floor: number;
  level?: number;
}

interface Emits {
  (e: 'userNameClicked', uid: string | number): void;
}

interface ContentElement {
  type: number;
  text?: string;
  c?: string;
  [key: string]: unknown;
}

interface SubPostItem {
  author: {
    id: string | number;
    name: string;
    name_show?: string;
    portrait: string;
  };
  content: unknown[];
  [key: string]: unknown;
}

interface PageInfo {
  current_page: number;
  total_page: number;
  total_count: number;
}

// Props & Emits
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Composables
const sendToast = useSendToast();
const openImageViewer = useImageViewer();
const api = useApi();

// State
const subpost_list: Ref<SubPostItem[]> = ref<SubPostItem[]>([]);
const currentPage: Ref<number> = ref<number>(1);
const isThreadsLoading: Ref<boolean> = ref<boolean>(false);
const content: Ref<string> = ref<string>('');
const create_time1: Ref<string> = ref<string>('');
let pageInfo: PageInfo | null = null;

// Methods
const userNameClicked = (uid: string | number): void => {
  emit('userNameClicked', uid);
};

const onScroll = (target: { scrollTop: number; clientHeight: number; scrollHeight: number }): void => {
  if ((target.scrollTop + target.clientHeight + 20 >= target.scrollHeight)) {
    if (isThreadsLoading.value) {
      return;
    }
    if (pageInfo && pageInfo.current_page >= pageInfo.total_page) {
      sendToast('没有更多回复了', 2000);
      return;
    }
    nextPage();
  }
};

const nextPage = async (): Promise<void> => {
  try {
    currentPage.value++;
    await loadData();
  } catch (error) {
    console.error('加载下一页失败:', error);
  }
};

const handleClick = (event: MouseEvent): void => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('thread-reply-img')) {
    const src = (target as HTMLImageElement).src;
    if (src) {
      openImageViewer(src);
    }
  }
  if (target.classList.contains('at-button')) {
    const uid = target.getAttribute('uid');
    if (uid) {
      emit('userNameClicked', uid);
    }
  }
};

const loadData = async (): Promise<void> => {
  try {
    isThreadsLoading.value = true;
    const res = await api.viewSubPost(props.tid, props.pid, currentPage.value);
    subpost_list.value = [...subpost_list.value, ...res.subpost_list];
    pageInfo = res.page;
    console.log(pageInfo);
  } catch (error) {
    console.error('加载楼中楼失败:', error);
  } finally {
    isThreadsLoading.value = false;
  }
};

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd} ${hh}:${minute}:${ss}`;
}

onMounted(async (): Promise<void> => {
  try {
    create_time1.value = formatDate(props.create_time);
    content.value = processContentElements(props.thread_content as ContentElement[]);
    if (props.reply_num > 0) {
      await loadData();
    }
  } catch (error) {
    console.error('组件初始化失败:', error);
  } finally {
    isThreadsLoading.value = false;
  }
});
</script>
<style scoped>
.subpost {
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: rgba(var(--text-color), 0.02);
  gap: 8px;
  border: 1px solid rgba(var(--text-color), 0.03);
  margin-bottom: 10px;
}

.thread {
  width: 100%;
  background-color: transparent;
}

.thread:hover {
  background-color: transparent;

}

.thread-info {
  display: flex;
  gap: 5px;
  opacity: 0.5;
  align-items: center;
}

.thread-media {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}


.thread-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thread-preview .thread-title {
  font-weight: bold;
  font-size: 16px;
}
</style>