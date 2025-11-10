<script setup>
import RippleButton from '../components/RippleButton.vue';
import { ref, onMounted, defineEmits, inject } from 'vue';
import { tieBaAPI } from '../tieba-api.js';
import PinnedThread from '../components/PinnedThread.vue';
import Thread from '../components/Thread.vue';
import Loading from '../components/Loading.vue';
import Container from '../components/Container.vue';
import BarInfoCard from '../components/BarInfoCard.vue';

const barDetailVisible = ref(false)
const returnData = ref([]);
const isLoading = ref(true);
const isThreadsLoading = ref(true);
const pinnedThreadList = ref([]);
const threadList = ref([]);
const currentPage = ref(1);
const n = new tieBaAPI;
const openImageViewer = inject('openImageViewer');

const SearchInBar = () => {
  emit('SearchInBar', { barName: props.barName, barIcon: returnData.value.forum.avatar });
}

const showbarDetail = () => {
  barDetailVisible.value = true
}

const hidebarDetail = () => {
  barDetailVisible.value = false
}

const onUserNameClicked = (uid) => {
  emit('UserNameClicked', uid);
}

const loadData = async () => {
  isThreadsLoading.value = true;
  returnData.value = await n.browseBar(props.barName, currentPage.value);
  returnData.value = await window.pluginManager.dispatchEvent('threadListUpdated', returnData.value);

  if (currentPage.value == 1) {
    emit('setTabInfo', { key: props.key_, title: returnData.value.forum.name + '吧', icon: returnData.value.forum.avatar });
    pinnedThreadList.value = [...pinnedThreadList.value, ...returnData.value.thread_list.filter(item => item.is_top === 1)];
  }

  const previousThreadLen = threadList.value.length;
  returnData.value.thread_list = returnData.value.thread_list.filter(item => item.is_top != 1)
  returnData.value.thread_list = returnData.value.thread_list.filter(item => item.id != threadList.value.map(item => item.id));
  threadList.value = [...threadList.value, ...returnData.value.thread_list];

  for (let i = previousThreadLen; i < threadList.value.length; i++) {
    threadList.value[i].author = returnData.value.user_list.filter(user => user.id === threadList.value[i].author_id)[0];
  }

  if (!returnData.value?.forum?.theme_color?.dark?.light_color) {
    if (!returnData.value.forum.theme_color) {
      returnData.value.forum.theme_color = {};
    }
    if (!returnData.value.forum.theme_color.dark) {
      returnData.value.forum.theme_color.dark = {};
    }
    returnData.value.forum.theme_color.dark.light_color = '#000000';
  }

  const hex = returnData.value.forum.theme_color.dark.light_color;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  if (brightness < 50) {
    returnData.value.forum.theme_color.dark.light_color = undefined;
  }

  isThreadsLoading.value = false;
}

onMounted(async () => {
  isLoading.value = true;
  await loadData();
  isLoading.value = false;
});

const onScroll = (target) => {
  if ((target.scrollTop + target.clientHeight + 20 >= target.scrollHeight)) {
    if (isThreadsLoading.value || returnData.value.page.has_more != 1) {
      return;
    }
    nextPage();
  }
}

const handleClick = (id) => {
  emit('threadClick', id);
}

const emit = defineEmits(['threadClick', 'setTabInfo', 'UserNameClicked', 'SearchInBar']);

const nextPage = async () => {
  currentPage.value++;
  loadData();
}

const props = defineProps({
  barName: {
    type: String,
    required: true,
  },
  key_: {
    required: true
  },
  setTabInfo: {
    type: Function,
    required: false,
  },
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
            <img class="avatar" :src="returnData.forum.avatar" referrerpolicy="no-referrer"
              @click="openImageViewer(returnData.forum.avatar)">
            <div>
              <div class="title">{{ returnData.forum.name }}吧</div>
              <div class="description">{{ returnData.forum.slogan }}</div>
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
            :color="returnData.forum.theme_color.dark.light_color != undefined ? '#' + returnData.forum.theme_color.dark.light_color : ''" />
        </div>

        <div class="thread-list">
          <Thread @UserNameClicked="onUserNameClicked(item.author.id)" @threadClicked="handleClick(item.id)"
            v-for="item in threadList" :key="item.id" :thread_title="item.title" :media="item.media"
            :user_name="item.author.name_show || item.author.name" :avatar="item.author.portrait"
            :thread_content="item.rich_abstract?.length === 0 || !Array.isArray(item.rich_abstract) ? [{ type: 0, text: item.title }] : item.rich_abstract"
            :create_time="item.last_time_int" :reply_num="item.reply_num"></Thread>
        </div>
      </div>
    </transition>

    <transition name="fade1">
      <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
    </transition>

    <BarInfoCard :visible="barDetailVisible" :forumData="returnData.forum || {}" @close="hidebarDetail" />
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
