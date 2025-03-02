<script setup>
import RippleButtonWithIcon from '../components/RippleButtonWithIcon.vue';
import Reply from '../components/Reply.vue';
import { ref, onMounted, watch } from 'vue';
import { tieBaAPI } from '../tieba-api.js';
const returnData = ref([]);
const isLoading = ref(true);
const isThreadsLoading = ref(true);
const threadList = ref([]);
const currentPage = ref(1);
const threadTitle = ref("");
const n = new tieBaAPI;
const loadData = async () => {
  isThreadsLoading.value = true;
  returnData.value = await n.viewThread(props.tid, currentPage.value);
  console.log(returnData.value);
  threadTitle.value = returnData.value.thread.title;
  threadList.value = [...threadList.value, ...returnData.value.post_list];
  isThreadsLoading.value = false;
  console.log(threadList.value)
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
    type: Object,
    required: true,
    default: null
  },
  tid: {
    type: String,
    required: true,
  }
});
</script>

<template>
  <div v-if="!isLoading">

  <div class="thread-list">
    <Reply v-for="item in threadList" thread_title="" :user_name="item.author.name || item.author.name_show" :avatar="item.author.portrait" :thread_content="item.content" :create_time="item.time" :reply_num="item.sub_post_number"></Reply>
  </div>
  <div class="thread-title">{{ threadTitle }}</div>
  </div>
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
  left: calc(10% + 210px);
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