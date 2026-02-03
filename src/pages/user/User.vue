<script setup lang="ts">
import { ref, onMounted, inject, type Ref } from 'vue';
import { useApiStore } from '@/stores';
import UserReply from '@/components/reply/UserReply.vue';
import { sanitize } from '@/utils/sanitizer';

// 类型定义
interface Props {
  uid: number;
  key_: number;
}

interface Emits {
  (e: 'setTabInfo', info: { key: number; title: string; icon: string }): void;
  (e: 'threadClicked', id: string | number): void;
  (e: 'barNameClicked', barName: string): void;
}

interface UserData {
  user: {
    nameShow: string;
    portrait: string;
    [key: string]: any;
  };
}

interface UserCardData {
  data: {
    honor: {
      grade: Record<string, {
        forum_list: string[];
      }>;
    };
  };
}

interface PostItem {
  [key: string]: any;
}

interface FollowBarItem {
  forum_name: string;
  level_id: string | number;
}

// Props & Emits
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Injects
const openImageViewer = inject<(url: string) => void>('openImageViewer');
const updateTabMeta = inject<(info: { key: number; title: string; icon: string }) => void>('updateTabMeta');

// State
const returnData: Ref<UserData> = ref({ user: { nameShow: '', portrait: '' } });
const returnData1: Ref<UserCardData> = ref({ data: { honor: { grade: {} } } });
const returnData2: Ref<PostItem[]> = ref([]);
const isLoading = ref<boolean>(true);
const isThreadsLoading = ref<boolean>(true);
const FollowBarList: Ref<FollowBarItem[]> = ref([]);
const currentPage = ref<number>(1);
const hasMore = ref<boolean>(true);

// API实例
const apiStore = useApiStore();
const api = apiStore.getApi();

// 加载下一页
const nextPage = async (): Promise<void> => {
  try {
    currentPage.value++;
    isThreadsLoading.value = true;

    const response = await api.user_post(props.uid, currentPage.value);
    const pageData = response.data.postList;

    if (Array.isArray(pageData) && pageData.length > 0) {
      returnData2.value = [...returnData2.value, ...pageData];
      hasMore.value = pageData.length !== 0;
    } else {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('加载下一页失败:', error);
    hasMore.value = false;
  } finally {
    isThreadsLoading.value = false;
  }
};

// 线程点击处理
const onThreadClicked = (id: string | number): void => {
  emit('threadClicked', id);
};

// 生命周期
onMounted(async (): Promise<void> => {
  try {
    isLoading.value = true;
    isThreadsLoading.value = true;

    // 加载用户信息
    const userInfo = await api.user_info(Number(props.uid), 1);
    returnData.value = userInfo.data;
    console.log('用户信息:', returnData.value);

    // 加载用户卡片
    returnData1.value = await api.userCard(returnData.value.user.portrait);

    // 加载用户帖子
    const postResponse = await api.user_post(props.uid);
    const postList = postResponse.data.postList;

    if (Array.isArray(postList)) {
      returnData2.value = postList;
      hasMore.value = postList.length !== 0;
    } else {
      hasMore.value = false;
    }

    // 设置标签信息
    const portraitUrl = returnData.value.user.portrait
      ? `https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/${returnData.value.user.portrait}`
      : '/assets/person.svg'; // Use a default icon if portrait is missing

    updateTabMeta?.({
      key: props.key_,
      title: `${returnData.value.user.nameShow}的贴吧`,
      icon: portraitUrl
    });

    // 处理关注吧列表
    try {
      const gradeEntries = Object.entries(returnData1.value.data.honor.grade);
      for (const [level, info] of gradeEntries) {
        for (const forumName of info.forum_list) {
          FollowBarList.value.push({
            forum_name: forumName,
            level_id: level
          });
        }
      }
    } catch (error) {
      console.error('处理关注吧列表失败:', error);
    }
  } catch (error) {
    console.error('加载用户数据失败:', error);
  } finally {
    isLoading.value = false;
    isThreadsLoading.value = false;
  }
});

const onScroll = (target: any) => {
  if ((target.scrollTop + target.clientHeight + 20 >= target.scrollHeight)) {
    if (isThreadsLoading.value || hasMore.value !== true) {
      return;
    }
    nextPage();
  }
}
</script>

<template>
  <Container @yscroll="onScroll">
    <transition name="fade1">
      <div v-if="!isLoading">
        <div class="bar-banner">
          <div class="image-container">
            <img class="background-image"
              :src="'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + returnData.user.portrait"
              referrerpolicy="no-referrer">
          </div>
          <div class="banner-content">
            <img class="avatar"
              :src="'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + returnData.user.portrait"
              referrerpolicy="no-referrer"
              @click="() => openImageViewer && openImageViewer('https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + returnData.user.portrait)">
            <div>
              <div class="title">{{ returnData.user.nameShow }} ({{ returnData.user.name }})</div>
              <div class="description" v-html="sanitize(returnData.user.intro == '' ? '没有签名喵' : returnData.user.intro)">
              </div>
              <div class="tags">
                <Tag>吧龄：{{ returnData.user.tbAge }}年</Tag>
                <Tag>发帖：{{ returnData.user.postNum }}</Tag>
                <Tag>获赞：{{ returnData.user.totalAgreeNum }}</Tag>
                <Tag>{{ returnData.user.sex == 1 ? '♂' : '♀' }}</Tag>
                <Tag>IP属地：{{ returnData.user.ipAddress == '' ? '未知' : returnData.user.ipAddress }}</Tag>
              </div>
            </div>
          </div>
        </div>

        <div class="content">
          <div style="width: 80%; display: flex;">
            <div class="post-list">
              <h3>回复</h3>
              <div class="reply-list">
                <div v-if="returnData2 == undefined">还没有回复</div>
                <UserReply @ThreadClicked="onThreadClicked(item.threadId)" v-for="item in returnData2" msg=""
                  :user_name="item.nameShow + ' (' + item.userName + ')'" :thread_title="item.title"
                  :avatar="item.userPortrait" :media="item.content" :create_time="0" :threadId="item.threadId">
                </UserReply>
                <div v-if="!hasMore">到底了</div>
              </div>
            </div>
            <div class="user-cards">
              <div>
                <h3>关注的吧</h3>
                <div class="bar-buttons">
                  <div class="bar-button" v-for="item in FollowBarList"
                    @click="emit('barNameClicked', item.forum_name)">
                    <span class="bar-name">{{ item.forum_name }} </span>
                    <span class="level"
                      :class="{ 'color1': Number(item.level_id) >= 0 && Number(item.level_id) < 4, 'color2': Number(item.level_id) >= 4 && Number(item.level_id) < 10, 'color3': Number(item.level_id) >= 10 && Number(item.level_id) < 16, 'color4': Number(item.level_id) > 16 }">{{
                        item.level_id }}</span>
                  </div>
                </div>
                <div v-if="FollowBarList.length < 1">没有关注的吧</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade1">
      <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
    </transition>
  </Container>
</template>

<style scoped>
hr {
  opacity: 0.1;
}

.level {
  margin: 10px;
}

.bar-button {
  padding: 10px 15px;
  border: 1px solid rgba(var(--text-color), 0.05);
  border-radius: 5px;
}

.user-cards {
  flex: auto;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-list {
  min-width: 500px;
  width: calc(100% - 300px);
}

.my-btn {
  width: 200px;
  height: 200px;
}

.tags {
  margin-top: 5px;
}

.thread-filter {
  width: 90%;
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

.content {
  padding: 10px;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
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
  border-radius: 80px;
}

.bar-banner {
  width: 100%;
  height: 200px;
  position: relative;
}

.bar-buttons {
  width: 100%;
  background-color: transparent;
  box-shadow: none;
  display: flex;
  gap: 10px;
  flex-direction: column;
}
</style>
