<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue';
import { read_file } from '../read_file';
import { tieBaAPI } from '../tieba-api';
import Loading from '../components/Loading.vue';
import Container from '../components/Container.vue';
import Tag from '../components/Tag.vue';
import RippleButton from '../components/RippleButton.vue';
const returnData = ref({});
const isLoading = ref(true);
onMounted(async () => {
  isLoading.value = true;
  const bduss = await read_file(import.meta.env.PROD ? './cookie.txt' : '../cookie.txt');
  const api = new tieBaAPI;
  returnData.value = await api.myProfile(bduss);

  isLoading.value = false;
});
</script>

<template>
  <Container @yscroll="onScroll">
    <div v-if="!isLoading">
      <div class="bar-banner">
        <div class="image-container">
          <img class="background-image"
            :src="'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + returnData.data.user.portrait"
            referrerpolicy="no-referrer">
        </div>
        <div class="banner-content">
          <img class="avatar"
            :src="'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + returnData.data.user.portrait"
            referrerpolicy="no-referrer">
          <div>
            <div class="title">{{ returnData.data.user.name_show }}</div>
            <div class="description">{{ returnData.data.user.intro }}</div>
            <div class="tags">
              <Tag>吧0：10.0年</Tag>
              <Tag>发帖：114514</Tag>
              <Tag>IP属地：日本东京下北泽</Tag>
              <Tag>粉丝：114514</Tag>
              <Tag>关注：1919810</Tag>
            </div>
          </div>
        </div>
      </div>
      <div class="pinned-thread-list">
        <RippleButton class="my-btn">
          <div class="button-content"><span class="material-symbols-outlined">favorite</span>收藏</div>
        </RippleButton>
        <RippleButton class="my-btn">
          <div class="button-content"><span class="material-symbols-outlined">history</span>历史</div>
        </RippleButton>
        <RippleButton class="my-btn">
          <div class="button-content"><span class="material-symbols-outlined">gesture</span>主页</div>
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
      <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
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
  filter: blur(50px);
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
