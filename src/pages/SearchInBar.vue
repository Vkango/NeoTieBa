<script setup>
import { ref, onMounted, watch, defineEmits, inject } from 'vue';
import { read_file } from '../file-io';
import { tieBaAPI } from '../tieba-api';
import Loading from '../components/Loading.vue';
import Container from '../components/Container.vue';
import Tag from '../components/Tag.vue';
import RippleButton from '../components/RippleButton.vue';
import Thread from '../components/Thread.vue';

const isLoading = ref(false);
const searchResult = ref([]);
const searchType = ref(0);
const searchContent = ref("");
const currentPage = ref(1);
let has_more = false;
const props = defineProps({
  key_: {
    required: true
  },
  barName: {
    type: String,
    required: true
  },
  barIcon: {
    type: String,
    required: true
  }
});
const emit = defineEmits(['threadClick', 'setTabInfo', 'UserNameClicked', 'BarNameClicked', 'setTabInfo']);
const sendToast = inject('sendToast');
const api = new tieBaAPI;
onMounted(() => {
  emit('setTabInfo', { key: props.key_, title: "吧内搜索 - " + props.barName + "吧", icon: props.barIcon });
});

const loadData = async () => {
  isLoading.value = true;
  switch (searchType.value) {
    case 0:
      const barResult = await api.searchPostInBar(props.barName, searchContent.value, currentPage.value);
      searchResult.value = [...searchResult.value, ...barResult.data.post_list];
      has_more = barResult?.data?.has_more;
      break;
    case 1:
      const threadResult = await api.searchThreadInBar(props.barName, searchContent.value, currentPage.value);
      searchResult.value = [...searchResult.value, ...threadResult.data.post_list];
      has_more = threadResult?.data?.has_more;
      break;
  }
  if ((!Array.isArray(searchResult.value) || !searchResult.value.length)) {
    sendToast('没有搜索到相关结果', 3000);
  }
  isLoading.value = false;
}


async function handleEnter(pageSwitch = false) {
  if (searchContent.value.length < 1) {
    if (!pageSwitch) {
      sendToast('请输入搜索内容', 3000);
      return;
    }
    else {
      searchResult.value = [];
      has_more = false;
      currentPage.value = 1;
      return;
    }
  }
  loadData();
}
const handleClick = (id) => {
  emit('threadClick', id);
}
const onUserNameClicked = (uid) => {
  emit('UserNameClicked', uid);
}

const nextPage = async () => {
  currentPage.value++;
  loadData();
}

const onScroll = (target) => {
  if ((target.scrollTop + target.clientHeight + 20 >= target.scrollHeight && has_more)) {
    nextPage();
  } else if (target.scrollTop + target.clientHeight + 20 >= target.scrollHeight && !has_more) {
    sendToast('没有更多内容了', 2000);
  }
}


</script>

<template>
  <Container @yscroll="onScroll">
    <div class="container1">
      <div class="list-title">在 {{ barName }}吧 吧内搜索</div>
      <div class="navi-buttons">
        <RippleButton class="button-nostyle" :class="{ 'selected': searchType == 0 }"
          @click="searchResult = []; searchType = 0; currentPage = 1; handleEnter(true)">回复
        </RippleButton>
        <RippleButton class="button-nostyle" :class="{ 'selected': searchType == 1 }"
          @click="searchResult = []; searchType = 1; currentPage = 1; handleEnter(true)">主题帖
        </RippleButton>
      </div>
      <input placeholder="键入关键词后按下回车键进行搜索……" @keyup.enter="handleEnter(false)" v-model="searchContent"></input>
      <TransitionGroup name="fade1">
        <div class="result" v-if="searchType == 0 && Array.isArray(searchResult)">
          <Thread @UserNameClicked="onUserNameClicked(item.user.uid)" @threadClicked="handleClick(item.tid)"
            v-for="item in searchResult" :thread_title="item?.title"
            :user_name="item?.user?.user_name || item?.user?.show_nickname || '(未知)'"
            :avatar="item?.user?.portrait.match(/tb\.1\.[^/]+/) ? item?.user?.portrait.match(/tb\.1\.[^/]+/)[0] : '0'"
            :thread_content="Array({ type: 0, text: item?.main_post?.content })" :create_time="item?.time"
            :reply_num="item?.post_num" :media="item?.media">
          </Thread>
        </div>
        <div class="result" v-if="searchType == 1 && searchResult">
          <Thread @UserNameClicked="onUserNameClicked(item.user.uid)" @threadClicked="handleClick(item.tid)"
            v-for="item in searchResult" :thread_title="item?.title"
            :user_name="item?.user?.user_name || item?.user?.show_nickname || '(未知)'"
            :avatar="item?.user?.portrait.match(/tb\.1\.[^/]+/) ? item?.user?.portrait.match(/tb\.1\.[^/]+/)[0] : '0'"
            :thread_content="Array({ type: 0, text: item?.content })" :create_time="item?.time"
            :reply_num="item?.post_num" :media="item?.media">
          </Thread>
        </div>
      </TransitionGroup>
    </div>
    <transition name="fade1">
      <Loading class="loading-box" v-if="isLoading"></Loading>
    </transition>
  </Container>
</template>

<style scoped>
.thread {
  width: 100%;
}

.desc {
  font-size: 13px;
  opacity: 0.5;
  display: flex;
  align-items: center;
  gap: 5px;
}

.bar-name {
  font-size: 16px;
  font-weight: bold;
  width: 200px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
}

.bar-button {
  display: flex;
  gap: 10px;
  background-color: rgba(var(--text-color), 0.05);
  box-shadow: none;
  text-align: left;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px 15px;
  height: 100%;
  border-radius: 5px;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}

.result {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.button-nostyle.selected {
  color: rgba(var(--text-color), 1);
  border-bottom: 2px solid rgba(var(--text-color), 1);
  font-weight: bold;
}

.button-nostyle {
  background-color: transparent;
  box-shadow: none;
  width: fit-content;
  justify-self: center;
  font-size: 13px;
  color: rgba(var(--text-color), 0.5);
  border-radius: 0;
}

.navi-buttons {
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
}

.list-title {
  padding: 10px 5px;
  font-size: 16px;
  font-weight: bold;
  position: relative;
}

.container1 {
  width: 80%;
  justify-self: center;
}

input {
  width: 100%;
}
</style>
