<script setup>
import Container from '../components/Container.vue';
import { ref, inject } from 'vue';
import LoadingWithTip from '../components/Notification/LoadingWithTip.vue';
const isDev = ref(!import.meta.env.PROD);

const sendNotification = inject('sendNotification');

// const notify = () => {
//   sendNotification(
//     '我是米米世界玩家',
//     LoadingWithTip,
//     { Tip: '我是米米世界玩家捏' },
//     3000)
// };

</script>

<template>
  <div style="width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 5px;
  justify-content: center;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.5;
  gap: 10px;">
    <img src="/assets/spa.svg" width="120px" style="margin-bottom: 20px;filter: invert(var(--invert));">
    <div style="font-size: 220%; font-weight: bold;">欢迎回来</div>
    <div style="font-size: 150%; margin-top: 15px; opacity: 0.5; margin-bottom: 84px;">吾等在此，静候君归</div>

  </div>
  <!-- <button @click="notify">弹出申必通知</button>
    <button @click="throw Error('跌我错了');">千万别点</button> -->
</template>

<style scoped></style>
