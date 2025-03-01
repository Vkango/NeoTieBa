<script setup>
import RippleButtonWithIcon from '../components/RippleButtonWithIcon.vue';
import { ref } from 'vue';
const naviListItem = ref([
  { icon: 'home', title: '首页' },
  { icon: 'apps', title: '进吧看帖' },
  { icon: 'favorite', title: '收藏' },
  { icon: 'settings', title: '设置' }
]);
</script>

<template>
  <div class="navi">
    <RippleButtonWithIcon class="navi-button" v-for="item in naviListItem" :icon="item.icon" :title="item.title"></RippleButtonWithIcon>
  </div>
</template>

<style scoped>
.navi {
  width: 85px;
  height: 100%;
  background-color: #1e1f20;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
}
</style>