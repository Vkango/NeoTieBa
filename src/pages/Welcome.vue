<script setup>
import Container from '../components/Container.vue';
import { ref, inject } from 'vue';
import LoadingWithTip from '../components/Notification/LoadingWithTip.vue';
const isDev = ref(!import.meta.env.PROD);

const sendNotification = inject('sendNotification');

const notify = () => {
  sendNotification(
    '我是米米世界玩家',
    LoadingWithTip,
    { Tip: '我是米米世界玩家捏' },
    3000)
};

</script>

<template>
  <Container class="page" @yscroll="onScroll">
    <h1><img src="/assets/ico.svg" width="100px" style="opacity: 0.5;"><br>欢迎{{ isDev ? "Debug build" : "" }}</h1>
    <button @click="notify">弹出申必通知</button>
    <button @click="throw Error('跌我错了');">千万别点</button>
  </Container>
</template>

<style scoped>
.page {
  position: absolute;
}

.my-btn {
  width: 200px;
  height: 200px;
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
