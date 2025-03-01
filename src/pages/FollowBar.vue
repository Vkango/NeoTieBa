<script setup>
import RippleButton from '../components/RippleButton.vue';
import { ref } from 'vue';
const naviListItem = ref([
  { icon: 'https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=d4b5ecc4910735fa91f04abbae6a678e/08f790529822720e735eac253ecb0a46f31fab59.jpg?tbpicau=2025-03-12-05_78075b54a9f78702ef3e20e2efd88630', title: '易语言吧' },
  { icon: 'https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=d4b5ecc4910735fa91f04abbae6a678e/08f790529822720e735eac253ecb0a46f31fab59.jpg?tbpicau=2025-03-12-05_78075b54a9f78702ef3e20e2efd88630', title: '孙笑川吧' },
  { icon: 'https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=d4b5ecc4910735fa91f04abbae6a678e/08f790529822720e735eac253ecb0a46f31fab59.jpg?tbpicau=2025-03-12-05_78075b54a9f78702ef3e20e2efd88630', title: '弔图吧' },
  { icon: 'https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=d4b5ecc4910735fa91f04abbae6a678e/08f790529822720e735eac253ecb0a46f31fab59.jpg?tbpicau=2025-03-12-05_78075b54a9f78702ef3e20e2efd88630', title: 'ps吧' }
]);
</script>

<template>
  <div class="list-title">关注的吧</div>
  <div style="display: flex; gap: 10px; flex-direction: column;">
    <button class="bar-button" v-for="item in naviListItem">
      <img class="avatar" :src="item.icon">
      <div class="bar-name">{{ item.title }}</div>
    </button>
  </div>
</template>

<style scoped>
.bar-name {
  font-size: 13px;
}
.bar-button {
  display: flex;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: none;
}
.avatar {
  width: 20px;
  height: 20px;
  border-radius: 20px;
}
.list-title {
  padding: 10px 5px;
}
.bar-button {
  width: 100%;
  text-align: left;
  align-items: center;
  padding: 10px 15px;
  border-radius: 5px;
}
</style>