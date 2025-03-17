<script setup>
import Reply from '../components/Reply.vue';
import { ref, onMounted, onActivated } from 'vue';
import { tieBaAPI } from '../tieba-api.js';
import Loading from '../components/Loading.vue';
import Container from '../components/Container.vue';
import RippleButton from '../components/RippleButton.vue';
const returnData = ref([]);
const isLoading = ref(true);
const isThreadsLoading = ref(true);
const threadList = ref([]);
const currentPage = ref(1);
const threadTitle = ref("");
const n = new tieBaAPI;
const emit = defineEmits(['setTabInfo', 'UserNameClicked', 'barNameClicked']);
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
const barNameClicked = (barName) => {
  emit('barNameClicked', barName);
}
const nextPage = async () => {
    currentPage.value++;
    loadData();
}
const props = defineProps({
  tid: {
    type: String,
    required: true,
  },
  key_: {
    required: true
  },
});
</script>

<template>
  <Container @yscroll="onScroll">
    <transition name="fade1">
    <div v-if="!isLoading">
    <div class="thread-list">
      <h3 class="thread-title">
        <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
          <RippleButton style="background-color: transparent; box-shadow: none; padding: 0; border-radius: 100px;" @click="barNameClicked(returnData.forum.name)">
            <div style="display: flex; align-items: center; gap: 10px; background-color: rgba(var(--text-color), 0.1); padding: 5px 8px;">
            <img :src="returnData.forum.avatar" class="avatar" referrerpolicy="no-referrer">
            <span style="font-size: 14px; margin-right: 5px;">{{ returnData.forum.name }}吧</span>
            </div>
          </RippleButton>
          {{ threadTitle }}
        </div>
      </h3>
      <Reply v-for="item in threadList" :user_name="item.author.name || item.author.name_show" :uid="item.author.id" @userNameClicked="onUserNameClicked" :avatar="item.author.portrait" :thread_content="item.content" :create_time="item.time" :reply_num="item.sub_post_number" :tid="tid" :pid="item.id" :floor="item.floor" :level="item.author.level_id"></Reply>
    </div>

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