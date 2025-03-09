<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue';
import Loading from '../components/Loading.vue';
import Container from '../components/Container.vue';
import Tag from '../components/Tag.vue';
onMounted(async() => {
  isLoading.value = true;
  isLoading.value = false;
});
</script>

<template>
  <Container @yscroll="onScroll">
  <div v-if="!isLoading">
  <div class="bar-banner">
    <div class="image-container">
      <img class="background-image" src="" referrerpolicy="no-referrer">
    </div>
    <div class="banner-content">
      <img class="avatar" src="" referrerpolicy="no-referrer">
      <div>
        <div class="title">这东西一次能吃一袋我丢🌈</div>
        <div class="description">申必简介</div>
        <div class="tags">
          <Tag>吧0：10.0年</Tag>
          <Tag>发帖：114514</Tag>
          <Tag>IP属地：日本东京下北泽</Tag>
        </div>
      </div>
    </div>
  </div>
  <div class="pinned-thread-list">
    <div>收藏</div>
    <div>历史</div>
  </div>
  </div>
  <transition name="fade1">
    <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
  </transition>
  </Container>
</template>

<style scoped>
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
  border-radius: 80px;
}
.bar-banner {
  width: 100%;
  height: 200px;
  position: relative;
}
</style>
