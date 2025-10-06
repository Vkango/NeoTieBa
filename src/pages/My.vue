<script setup>
import { ref, onMounted, watch, defineEmits, inject } from 'vue';
import { get_current_user_bduss, get_current_user_cookies } from '../user-manage';
import { tieBaAPI } from '../tieba-api';
import Loading from '../components/Loading.vue';
import Container from '../components/Container.vue';
import Tag from '../components/Tag.vue';
import RippleButton from '../components/RippleButton.vue';
import UserReply from '../components/UserReply.vue';
import { replaceEmoticonsWithImages } from '../emotion2code.js';
const returnData = ref({});
const isLoading = ref(true);
const returnData2 = ref();
const returnData3 = ref();
const currentPage = ref(1);
const openImageViewer = inject('openImageViewer');
const deleteTab = inject('deleteTab');
const isThreadsLoading = ref(true);
const atReplyPage = ref(true);
let uid = undefined;
let has_more = true;
const api = new tieBaAPI;
const props = defineProps({
  key_: {
    required: true
  },
});
const emit = defineEmits(['FavouriteClicked', 'userNameClicked', 'ThreadClicked', 'setTabInfo']);
onMounted(async () => {
  isLoading.value = true;
  const cookie = await get_current_user_cookies();
  uid = await api.get_self_id(cookie);
  returnData.value = (await api.user_info(uid, 1)).data;
  const bduss = await get_current_user_bduss();
  returnData2.value = (await api.get_reply_me(bduss, 1)).reply_list;
  has_more = returnData2.length != 0;
  isLoading.value = false;
  isThreadsLoading.value = false;
  emit('setTabInfo', { key: props.key_, title: '我的', icon: '/assets/user.svg' });
});

const switchPage = async () => {
  currentPage.value = 1;
  isThreadsLoading.value = true;
  const bduss = await get_current_user_bduss();
  if (atReplyPage.value) {
    returnData2.value = (await api.get_reply_me(bduss, 1)).reply_list;
    has_more = returnData2.length != 0;
  }
  else {
    returnData3.value = (await api.get_at_me(bduss, 1)).at_list;
    has_more = returnData3.length != 0;
  }

  isLoading.value = false;
  isThreadsLoading.value = false;
}

const onScroll = (target) => {
  if ((target.scrollTop + target.clientHeight + 20 >= target.scrollHeight)) {
    if (isThreadsLoading.value || has_more != true) {
      return;
    }
    nextPage();
  }
}
const nextPage = async () => {
  currentPage.value++;
  const bduss = await get_current_user_bduss();
  isThreadsLoading.value = true;
  let pageData = [];
  if (atReplyPage.value) {
    pageData = (await api.get_reply_me(bduss, currentPage.value)).reply_list;
    if (Array.isArray(pageData)) {
      returnData2.value = [...returnData2.value, ...pageData];
      has_more = pageData.length != 0;
    }
    else { has_more = false }
  }
  else {
    pageData = (await api.get_at_me(bduss, currentPage.value)).at_list;
    if (Array.isArray(pageData)) {
      returnData3.value = [...returnData3.value, ...pageData];
      has_more = pageData.length != 0;
    }
    else { has_more = false }
  }


  isThreadsLoading.value = false;
}

function onThreadClicked(id) {
  emit('ThreadClicked', id);
}

const history = () => {
  deleteTab(props.key_); // 自爆测试
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
              @click="openImageViewer('https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + returnData.user.portrait)">
            <div>
              <div class="title">{{ returnData.user.nameShow }} ({{ returnData.user.name }})</div>
              <div class="description">{{ returnData.user.intro }}</div>
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
        <div class="pinned-thread-list">
          <RippleButton class="my-btn">
            <div class="button-content" @click="emit('FavouriteClicked')"><span
                class="material-symbols-outlined">favorite</span>收藏</div>
          </RippleButton>
          <RippleButton class="my-btn">
            <div class="button-content" @click="history()"><span class="material-symbols-outlined">history</span>历史
            </div>
          </RippleButton>
          <RippleButton class="my-btn">
            <div class="button-content" @click="emit('userNameClicked', uid)"><span
                class="material-symbols-outlined">gesture</span>主页</div>
          </RippleButton>
          <RippleButton class="my-btn">
            <div class="button-content"><span class="material-symbols-outlined">medical_services</span>服务</div>
          </RippleButton>
          <RippleButton class="my-btn" style="border: 1px rgba(var(--text-color), 0.2) solid;">
            <div class="button-content"><span class="material-symbols-outlined">footprint</span>无痕</div>
          </RippleButton>
          <RippleButton class="my-btn" style="border: 1px rgba(var(--text-color), 0.2) solid;">
            <div class="button-content"><span class="material-symbols-outlined">dark_mode</span>勿扰</div>
          </RippleButton>

        </div>
        <div style="width: 80%; justify-self: center;">

          <div style="display: flex; gap: 20px; margin-bottom: 10px; margin-top: 40px; align-items: center;">
            <div style="font-size: 18px; font-weight: bold;">消息</div>
            <div style="margin-left: auto;">
              <RippleButton class="filter-button" :class="{ selected: atReplyPage }"
                @click="atReplyPage = true; switchPage()"
                style="background-color: transparent; box-shadow: none; padding: 5px 10px; justify-self: left;">
                <div style="display: flex; gap: 10px; align-items: center;">
                  <img src="/assets/reply.svg" width="18px" class="icon_">
                  <span>回复我的</span>
                </div>
              </RippleButton>
              <RippleButton class="filter-button" :class="{ selected: !atReplyPage }"
                @click="atReplyPage = false; switchPage()"
                style="background-color: transparent; box-shadow: none; padding: 5px 10px; justify-self: left;">
                <div style="display: flex; gap: 10px; align-items: center;">
                  <img src="/assets/at.svg" width="18px" class="icon_">
                  <span>提到我的</span>
                </div>
              </RippleButton>
            </div>
          </div>
          <TransitionGroup name="fade1">
            <div class="reply-list" v-if="atReplyPage">
              <UserReply @ThreadClicked="onThreadClicked(item.thread_id)" v-for="item in returnData2" msg=""
                :user_name="item.replyer.name || item.replyer.name_show"
                :thread_title="replaceEmoticonsWithImages(item.content)" :avatar="item.replyer.portrait"
                :media="[{ postContent: [{ type: 0, text: replaceEmoticonsWithImages(item.quote_content) }], createTime: String(item.time) }]"
                :create_time="0" :threadId="item.thread_id">
              </UserReply>
            </div>
            <div class="at-list" v-if="!atReplyPage">
              <UserReply @ThreadClicked="onThreadClicked(item.thread_id)" v-for="item in returnData3" msg=""
                :user_name="item.replyer.name || item.replyer.name_show" :thread_title="item.content"
                :avatar="item.replyer.portrait"
                :media="[{ postContent: [{ type: 0, text: item.title }], createTime: item.time }]" :create_time="0"
                :threadId="item.thread_id">
              </UserReply>
            </div>
            <div v-if="!has_more" style="margin: 10px 0">到底了</div>
          </TransitionGroup>
        </div>
      </div>
    </transition>
    <transition name="fade1">
      <Loading class="loading-box" v-if="isLoading || isThreadsLoading"></Loading>
    </transition>
  </Container>
</template>

<style scoped>
.button-content {
  display: flex;
  gap: 10px;
}

.my-btn {
  width: fit-content;
  height: fit-content;
  background-color: rgba(var(--background-color), 0.3);
}

.tags {
  margin-top: 5px;
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
</style>
