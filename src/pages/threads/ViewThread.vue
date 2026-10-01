<script setup lang="ts">
import { ref, onMounted, getCurrentInstance, inject, type Ref } from 'vue';
import { useApiStore } from '@/stores';
import { read_file } from '@/core/file-io';
import Reply from '@/components/thread/Reply.vue';
import ReplyView from '@/components/thread/SubPostView.vue';
import domToImage from 'dom-to-image';

// 类型定义
interface Props {
  tid: string | number;
  key_: string | number;
  local?: boolean;
  local_dir?: string;
}

interface Emits {
  (e: 'setTabInfo', info: { key: string | number; title: string; icon: string }): void;
  (e: 'openUser', uid: string | number): void;
  (e: 'openBar', barName: string): void;
}

interface User {
  id: string | number;
  user_name: string;
  display_name?: string;
  portrait?: string;
  [key: string]: any;
}

interface Post {
  authorId: string | number;
  author?: User;
  agree: {
    agreeNum: number;
    disagreeNum: number;
  };
  [key: string]: any;
}

interface ThreadData {
  data?: {
    thread: {
      title: string;
    };
    forum: {
      name: string;
      avatar: string;
    };
    userList: User[];
    postList: Post[];
    page: {
      hasMore: boolean;
    };
  };
}

interface SubPostInfo {
  ipAddress?: string;
  like: number;
  user_name: string;
  uid: string | number;
  avatar: string;
  thread_content: any[];
  create_time: number;
  reply_num: number;
  tid: string;
  pid: string | number;
  floor: number;
  is_lz: boolean;
  level?: number;
}

// Props & Emits
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Injects
const deleteTab = inject<(key: string | number) => void>('deleteTab');
const sendToast = inject<(title: string, duration: number) => void>('sendToast');
const updateTabMeta = inject<(info: { key: string | number; title: string; icon: string; icon_invert?: boolean }) => void>('updateTabMeta');

// State
const returnData: Ref<ThreadData> = ref({});
const userList: Ref<User[]> = ref([]);
const isLoading = ref<boolean>(true);
const isThreadsLoading = ref<boolean>(true);
const threadList: Ref<Post[]> = ref([]);
const currentPage = ref<number>(1);
const threadTitle = ref<string>("");
const isDeleted = ref<boolean>(false);
const currentSubPostInfo: Ref<SubPostInfo> = ref({
  like: 0,
  user_name: '',
  uid: '',
  avatar: '',
  thread_content: [],
  create_time: 0,
  reply_num: 0,
  tid: String(props.tid),
  pid: 0,
  floor: 0,
  is_lz: false
});

const openImageViewer = inject<(url: string) => void>('openImageViewer');
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


// API实例
const apiStore = useApiStore();
const api = apiStore.getApi();

// 全局属性
const instance = getCurrentInstance();
const isDrawerOpen = instance?.appContext.config.globalProperties.$IsDrawerOpen;

// 加载数据
const loadData = async (): Promise<void> => {
  try {
    isThreadsLoading.value = true;

    if (!props.local) {
      returnData.value = await api.get_post(Number(props.tid), currentPage.value);
    } else if (props.local_dir) {
      const jsonData = await read_file(`${props.local_dir}/page${currentPage.value}.json`);
      returnData.value = JSON.parse(jsonData);
    }

    if (returnData.value?.data?.postList) {
      const { thread, forum, userList: newUsers, postList } = returnData.value.data;

      threadTitle.value = thread.title;
      updateTabMeta?.({
        key: props.key_,
        title: thread.title,
        icon: forum.avatar,
        icon_invert: false
      });


      // 合并用户列表，避免重复
      const existingUserIds = new Set(userList.value.map(u => u.id));
      const uniqueNewUsers = newUsers.filter(user => !existingUserIds.has(user.id));
      userList.value.push(...uniqueNewUsers);

      // 关联作者信息
      const userMap = new Map(userList.value.map(user => [user.id, user]));
      const enrichedPosts = postList.map(post => ({
        ...post,
        author: userMap.get(post.authorId)
      }));

      threadList.value = [...threadList.value, ...enrichedPosts];
    } else {
      isDeleted.value = true;
      updateTabMeta?.({ key: props.key_, title: '贴子已被删除', icon: '/assets/apps.svg', icon_invert: true });
      sendToast?.('贴子已被删除', 3000);
      deleteTab?.(props.key_);
    }
  } catch (error) {
    console.error('加载数据失败:', error);
    sendToast?.('加载失败，请重试', 3000);
  } finally {
    isThreadsLoading.value = false;
  }
};

// 生命周期
onMounted(async (): Promise<void> => {
  isLoading.value = true;
  await loadData();
  isLoading.value = false;
});

// 滚动处理
const onScroll = (target: HTMLElement): void => {
  const { scrollTop, clientHeight, scrollHeight } = target;
  if (scrollTop + clientHeight + 20 >= scrollHeight) {
    if (isThreadsLoading.value || !returnData.value.data?.page?.hasMore) {
      sendToast?.('没有更多内容了', 2000);
      return;
    }
    nextPage();
  }
};

// 用户名点击
const onUserNameClicked = (uid: string | number): void => {
  emit('openUser', uid);
};

// 吧名点击
const openBar = (barName: string): void => {
  emit('openBar', barName);
};

// 下一页
const nextPage = async (): Promise<void> => {
  currentPage.value++;
  await loadData();
};

// 查看所有回复
const ViewAllReplie = (data: SubPostInfo): void => {
  currentSubPostInfo.value = data;
  if (isDrawerOpen) {
    isDrawerOpen.state = true;
  }
};
</script>

<template>
  <Container :tab-key="props.key_" :scroll-key="`thread-${props.key_}`" @yscroll="onScroll">
    <transition name="fade1">
      <div v-if="!isLoading">
        <div class="thread-list" v-if="!isDeleted" ref="captureRef">
          <h3 class="thread-title">
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
              <RippleButton v-if="returnData.data"
                style="background-color: transparent; box-shadow: none; padding: 0; border-radius: 100px;"
                @click="openBar(returnData.data.forum.name)">
                <div
                  style="display: flex; align-items: center; gap: 10px; background-color: rgba(var(--text-color), 0.1); padding: 5px 8px;">
                  <img :src="returnData.data.forum.avatar" class="avatar" referrerpolicy="no-referrer">
                  <span style="font-size: 14px; margin-right: 5px;">{{ returnData.data.forum.name }}吧</span>
                </div>
              </RippleButton>
              {{ threadTitle }}
              <RippleButton style="padding: 4px; border-radius: 50%; background: transparent; box-shadow: none;"
                @click="handleShare" title="生成长截图">
                <span class="material-symbols-outlined" style="font-size: 20px;">share</span>
              </RippleButton>
            </div>
          </h3>
          <Reply v-for="item in threadList" :key="item.id" :like="item.agree.agreeNum - item.agree.disagreeNum"
            :user_name="item.author?.nameShow || item.author?.name || '匿名用户'" :uid="item.authorId"
            @openUser="onUserNameClicked" :avatar="item.author?.portrait || 'default'"
            :thread_content="item.content?.length === 0 || !Array.isArray(item.content) ? [{ type: 0, text: threadTitle }] : item.content"
            :create_time="item.time" :reply_num="item.subPostNumber" :tid="String(tid)" :pid="String(item.id)"
            :floor="item.floor" :is_lz="item.authorId === threadList[0]?.authorId" :level="item.author?.levelId || 0"
            :ipAddress="item.author?.ipAddress || ''" @viewAllReplies="ViewAllReplie">
          </Reply>
        </div>

      </div>
    </transition>
    <Drawer ctitle="查看楼中楼" width="450px" :top_position="false">
      <ReplyView v-if="isDrawerOpen.state" v-bind="currentSubPostInfo" @openUser="onUserNameClicked"></ReplyView>
    </Drawer>
    <transition name="fade1">
      <div v-if="isDeleted" style="width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; border-radius: 5px;
          justify-content: center; text-align: center; display: flex; flex-direction: column; align-items: center;
          opacity: 0.5; gap: 10px;">
        <img src="/assets/delete.svg" width="120px" style="margin-bottom: 20px;filter: invert(var(--invert));">
        <div style="font-size: 220%; font-weight: bold;">贴子已被删除</div>
        <div style="font-size: 150%; margin-top: 15px; opacity: 0.5; margin-bottom: 84px;">请关闭页面</div>
      </div>
    </transition>
    <transition name="fade1">
      <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
    </transition>
  </Container>
</template>

<style scoped>
.thread-title {
  width: 80%;
  height: fit-content;
  margin-top: 0;
  margin-bottom: 10px;
}

.avatar {
  width: 24px;
  border-radius: 32px;
}

.thread-filter {
  width: 80%;
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
}

.bar-banner {
  width: 100%;
  height: 200px;
  position: relative;
}
</style>
