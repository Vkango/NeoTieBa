<script setup>
import Reply from '../components/Reply.vue';
import { ref, onMounted, onActivated } from 'vue';
import { tieBaAPI } from '../tieba-api.js';
import Loading from '../components/Loading.vue';
import Container from '../components/Container.vue';
const returnData = ref([]);
const isLoading = ref(true);
const isThreadsLoading = ref(true);
const threadList = ref([]);
const currentPage = ref(1);
const threadTitle = ref("");
const n = new tieBaAPI;
const emit = defineEmits(['setTabInfo', 'UserNameClicked']);
const loadData = async () => {
  isThreadsLoading.value = true;
  returnData.value = await n.viewThread(props.tid, currentPage.value);
  threadTitle.value = returnData.value.thread.title;
  emit('setTabInfo', { key: props.key_, title: returnData.value.thread.title, icon: returnData.value.forum.avatar });
  threadList.value = [...threadList.value, ...returnData.value.post_list];
  isThreadsLoading.value = false;
}
onMounted(async() => {
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
const onUserNameClicked = (uid) => {
  emit('UserNameClicked', uid);
}
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
  },
  tid: {
    type: Number,
    required: true,
  },
  key_: {
    required: true
  },
  setTabInfo: {
    type: Function,
    required: false,
  }
});
</script>

<template>
  <Container @yscroll="onScroll">
    <transition name="fade1">
    <div v-if="!isLoading">
    <div class="thread-list">
      <Reply v-for="item in threadList" :user_name="item.author.name || item.author.name_show" :uid="item.author.id" @userNameClicked="onUserNameClicked" :avatar="item.author.portrait" :thread_content="item.content" :create_time="item.time" :reply_num="item.sub_post_number" :tid="tid" :pid="item.id" :floor="item.floor" :level="item.author.level_id"></Reply>
    </div>
    <div class="thread-title">{{ threadTitle }}</div>
    </div>
    </transition>
    <transition name="fade1">
      <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
    </transition>
  </Container>
</template>

<style scoped>
.thread-title {
  height: 40px;
  position: absolute;
  width: fit-content;
  border-radius: 5px;
  margin: 10px 0;
  backdrop-filter: blur(20px);
  top: 0px;
  left: 10%;
  font-weight: bold;
  line-height: 40px;
  padding: 0 15px;
  background-color: rgba(0, 0, 0, 0.5);
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
  top: 50px;
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