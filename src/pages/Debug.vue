<script setup>
import Container from '../components/Container.vue';
import { inject } from 'vue';
import Tip from '../components/Notification/Tip.vue';
const props = defineProps({
  key_: {
    type: Number,
    required: true
  }
})
const sendNotification = inject('sendNotification');
const onClick = () => {
  console.log('点击了通知');
}
const notify = () => {
  sendNotification(
    '你有一条新回复',
    '<span class="material-symbols-outlined" style="font-size: 17px;">reply</span>消息',
    Tip,
    onClick,
    { Tip: '米线山🐉：你说什么？【米线山吧】' },
    60000
  )
};

</script>

<template>
  <Container>
    <div>调试工具</div>
    <button @click="notify">紫砂</button>
    <button @click="throw Error('跌我错了');">紫袍</button>
  </Container>

</template>
