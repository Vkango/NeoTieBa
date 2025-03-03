<script setup>
import RippleButtonWithIcon from '../components/RippleButtonWithIcon.vue';
import { ref, onMounted, watch, defineEmits } from 'vue';
import { tieBaAPI } from '../tieba-api.js';
import PinnedThread from '../components/PinnedThread.vue';
import Thread from '../components/Thread.vue';
import Loading from '../components/Loading.vue';
const returnData = ref([]);
const isLoading = ref(true);
const isThreadsLoading = ref(true);
const pinnedThreadList = ref([]);
const threadList = ref([]);
const currentPage = ref(1);
const n = new tieBaAPI;
const loadData = async () => {
  isThreadsLoading.value = true;
  returnData.value = await n.browseBar(props.barName, currentPage.value);
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
  isThreadsLoading.value = false;
}
onMounted(async() => {
  isLoading.value = true;
  await loadData();
  isLoading.value = false;
  watch(() => props.scrollPosition, () => {
  const container = props.container;
  if ((container.scrollTop + container.clientHeight + 20 >= container.scrollHeight)) {
    if (isThreadsLoading.value) {
      return;
    }
    nextPage();
}
});
});
const handleClick = (id) => {
  emit('threadClick', id);
}
const emit = defineEmits(['threadClick', 'setTabInfo']);
const nextPage = async () => {
    currentPage.value++;
    loadData();
}
const props = defineProps({
  scrollPosition: {
    type: Number,
    required: true,
    default: 0
  },
  container: {
    required: true,
    default: null
  },
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
  <div v-if="!isLoading">
  <div class="bar-banner">
    <div class="image-container">
      <img class="background-image" :src="returnData.forum.avatar" referrerpolicy="no-referrer">
    </div>
    <div class="banner-content">
      <img class="avatar" :src="returnData.forum.avatar" referrerpolicy="no-referrer">
      <div>
        <div class="title">{{ returnData.forum.name }}吧</div>
        <div class="description">{{ returnData.forum.slogan }}</div>
        <div class="level">
          Lv.8 铁杆8u
        </div>
      </div>
    </div>
  </div>
  <div class="pinned-thread-list">
    <PinnedThread v-for="item in pinnedThreadList" :title="item.title" />
  </div>
  <div class="thread-list">
    <div class="thread-filter"><span>回复时间排序 </span><span>只看精贴</span></div>
    <Thread @click="handleClick(item.id)" v-for="item in threadList" :thread_title="item.title" :media="item.media" :user_name="item.author.name_show || item.author.name" :avatar="item.author.portrait" :thread_content="item.rich_abstract" :create_time="item.last_time_int" :reply_num="item.reply_num"></Thread>
  </div>
  </div>
  <transition name="fade1">
    <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
  </transition>
</template>

<style scoped>

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
  -webkit-mask-image: linear-gradient(rgba(0, 0, 0, 0.2), transparent);
  mask-image: linear-gradient(rgba(0, 0, 0, 0.2), transparent);
  filter: blur(50px);
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