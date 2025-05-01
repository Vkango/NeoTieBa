<script setup>
import Container from '../components/Container.vue';
import { ref, inject } from 'vue';
import Tip from '../components/Notification/Tip.vue';
const isDev = ref(!import.meta.env.PROD);
const props = defineProps({
  key_: {
    type: Number,
    required: true
  }
})
const sendNotification = inject('deleteTab');
const notify = () => {
  sendNotification(props.key_);
  sendNotification(
    '我是米米世界玩家',
    Tip,
    { Tip: '我是米米世界玩家捏' },
    3000)
};

</script>

<template>
  <Container>
    <div>调试工具</div>
    <button @click="notify">紫砂</button>
    <button @click="throw Error('跌我错了');">紫袍</button>
  </Container>

</template>

<style scoped></style>
