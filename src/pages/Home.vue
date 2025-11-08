<template>
  <Container @yscroll="onScroll">
    <transition name="fade1">
      <div v-if="!isLoading" class="bgr">
        <div class="list-title">为你推荐</div>
        <div class="thread-list">
          <Thread @UserNameClicked="onUserNameClicked(item.author.id)" @threadClicked="handleClick(item.id)"
            v-for="item in threadList" :key="item.id" :thread_title="item.title" :media="item.media"
            :user_name="item.author.display_name || item.author.user_name" :avatar="item.author.portrait"
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
<script setup>
import Container from '../components/Container.vue';
import Thread from '../components/Thread.vue';
import Loading from '../components/Loading.vue';
import { tieBaAPI } from '../tieba-api';
import { onMounted, defineEmits, defineProps, ref, inject } from 'vue';
import { get_current_user } from '../user-manage';
const n = new tieBaAPI();
const returnData = ref([]);
const isLoading = ref(true);
const isThreadsLoading = ref(true);
const pinnedThreadList = ref([]);
const threadList = ref([]);
const currentPage = ref(1);
const openImageViewer = inject('openImageViewer');
const props = defineProps({
  key_: {
    required: true
  },
});
const loadData = async () => {
  isThreadsLoading.value = true;
  const user = await get_current_user();
  const c = await n.getHomeRecommend(user.bduss, user.stoken);
  returnData.value = c.data;
  console.log(returnData.value);
  returnData.value = await window.pluginManager.dispatchEvent('threadListUpdated', returnData.value);
  threadList.value = [...threadList.value, ...returnData.value.thread_list];
  isThreadsLoading.value = false;
}

onMounted(async () => {
  emit('setTabInfo', { key: props.key_, title: "首页", icon: "/assets/home.svg" });
  isLoading.value = true;
  await loadData();
  isLoading.value = false;
});

const onScroll = (target) => {
  if ((target.scrollTop + target.clientHeight + 20 >= target.scrollHeight)) {
    nextPage();
  }
}

const handleClick = (id) => {
  emit('threadClick', id);
}

const emit = defineEmits(['threadClick', 'setTabInfo', 'UserNameClicked']);

const nextPage = async () => {
  currentPage.value++;
  loadData();
}

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