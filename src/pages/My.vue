<script setup>
import { ref, onMounted, watch, defineEmits, inject } from 'vue';
import { read_file } from '../read_file';
import { tieBaAPI } from '../tieba-api';
import Loading from '../components/Loading.vue';
import Container from '../components/Container.vue';
import Tag from '../components/Tag.vue';
import RippleButton from '../components/RippleButton.vue';
const returnData = ref({});
const isLoading = ref(true);
const openImageViewer = inject('openImageViewer');
let uid = undefined;
const emit = defineEmits(['FavouriteClicked', 'userNameClicked']);
onMounted(async () => {
  isLoading.value = true;
  const bduss = await read_file(import.meta.env.PROD ? './cookie.txt' : '../cookie.txt');
  const api = new tieBaAPI;
  uid = await api.get_self_id(bduss);
  returnData.value = (await api.user_info(uid, 1)).data;
  isLoading.value = false;
});
</script>

<template>
  <Container @yscroll="onScroll">
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
          <div class="button-content"><span class="material-symbols-outlined">history</span>历史</div>
        </RippleButton>
        <RippleButton class="my-btn">
          <div class="button-content" @click="emit('userNameClicked', uid)"><span
              class="material-symbols-outlined">gesture</span>主页</div>
        </RippleButton>
        <RippleButton class="my-btn">
          <div class="button-content"><span class="material-symbols-outlined">settings</span>设置</div>
        </RippleButton>
        <RippleButton class="my-btn">
          <div class="button-content"><span class="material-symbols-outlined">dark_mode</span>夜间</div>
        </RippleButton>
        <RippleButton class="my-btn">
          <div class="button-content"><span class="material-symbols-outlined">medical_services</span>服务</div>
        </RippleButton>
      </div>
    </div>
    <div style="width: 80%; justify-self: center;">
      <h3>消息</h3>
      <div>回复我的 | @我的</div>
    </div>
    <transition name="fade1">
      <Loading class="loading-box" v-if="isLoading"></Loading>
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
