<template>
  <Container>
    <div class="list-title">还没做</div>
  </Container>
</template>
<script setup>
import Container from '../components/Container.vue';
import { onMounted, defineEmits, defineProps } from 'vue';
const emit = defineEmits(['setTabInfo']);
const props = defineProps({
  key_: {
    required: true
  },
});

onMounted(() => {
  emit('setTabInfo', { key: props.key_, title: "首页", icon: "/assets/home.svg" });
});
</script>