<script setup>
import Reply from '../components/Reply.vue';
import { ref, onMounted, getCurrentInstance, inject } from 'vue';
import { tieBaAPI } from '../tieba-api.js';
import Loading from '../components/Loading.vue';
import Container from '../components/Container.vue';
import RippleButton from '../components/RippleButton.vue';
import Drawer from '../components/Drawer.vue';
import ReplyView from '../components/SubPostView.vue';
import { read_file } from '../file-io.js';
const returnData = ref([]);
const isLoading = ref(true);
const isThreadsLoading = ref(true);
const threadList = ref([]);
const currentPage = ref(1);
const threadTitle = ref("");
const isDeleted = ref(false);
const instance = getCurrentInstance();
let isDrawerOpen = instance.appContext.config.globalProperties.$IsDrawerOpen;
const n = new tieBaAPI;
const emit = defineEmits(['setTabInfo', 'UserNameClicked', 'barNameClicked']);
const deleteTab = inject('deleteTab');
const sendToast = inject('sendToast');
const currentSubPostInfo = ref({ like: undefined, user_name: undefined, uid: undefined, avatar: undefined, thread_content: undefined, create_time: undefined, reply_num: undefined, tid: undefined, pid: undefined, floor: undefined, is_lz: undefined, level: undefined });
const loadData = async () => {
  isThreadsLoading.value = true;
  if (!props.local) {
    returnData.value = await n.viewThread(props.tid, currentPage.value);
  } else {
    returnData.value = JSON.parse(await read_file(props.local_dir + '/page' + currentPage.value + '.json'));
  }

  if (returnData.value?.thread?.title) {
    threadTitle.value = returnData.value.thread.title;
    emit('setTabInfo', { key: props.key_, title: returnData.value.thread.title, icon: returnData.value.forum.avatar });
    threadList.value = [...threadList.value, ...returnData.value.post_list];
  }
  else {
    emit('setTabInfo', { key: props.key_, title: '贴子已被删除', icon: '/assets/apps.svg' });
    isDeleted.value = true;
    sendToast('贴子已被删除', 3000);
    deleteTab(props.key_);
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

const ViewAllReplie = (data) => {
  currentSubPostInfo.value = data;
  isDrawerOpen.state = true;

}

const props = defineProps({
  tid: {
    required: true,
  },
  key_: {
    required: true
  },
  local: {
    required: false,
    default: false
  },
  local_dir: {
    required: false
  }
});
</script>

<template>
  <Container @yscroll="onScroll">
    <transition name="fade1">
      <div v-if="!isLoading">
        <div class="thread-list" v-if="!isDeleted">
          <h3 class="thread-title">
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
              <RippleButton style="background-color: transparent; box-shadow: none; padding: 0; border-radius: 100px;"
                @click="barNameClicked(returnData.forum.name)">
                <div
                  style="display: flex; align-items: center; gap: 10px; background-color: rgba(var(--text-color), 0.1); padding: 5px 8px;">
                  <img :src="returnData.forum.avatar" class="avatar" referrerpolicy="no-referrer">
                  <span style="font-size: 14px; margin-right: 5px;">{{ returnData.forum.name }}吧</span>
                </div>
              </RippleButton>
              {{ threadTitle }}
            </div>
          </h3>
          <Reply v-for="item in threadList" :like="item.agree.agree_num - item.agree.disagree_num"
            :user_name="item.author.name || item.author.name_show" :uid="item.author.id"
            @userNameClicked="onUserNameClicked" :avatar="item.author.portrait"
            :thread_content="item.content?.length === 0 || !Array.isArray(item.content) ? [{ type: 0, text: threadTitle }] : item.content"
            :create_time="item.time" :reply_num="item.sub_post_number" :tid="tid" :pid="item.id" :floor="item.floor"
            :is_lz="item.author.id === threadList[0].author.id" :level="item.author.level_id"
            @viewAllReplies="ViewAllReplie"></Reply>
        </div>

      </div>
    </transition>
    <Drawer ctitle="查看楼中楼" width="450px" :top_position="false">
      <ReplyView v-if="isDrawerOpen.state" v-bind="currentSubPostInfo" @userNameClicked="onUserNameClicked"></ReplyView>
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