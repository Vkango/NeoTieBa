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
  <div class="bgr">
    <div class="list-title">关注的吧</div>
    <div style="display: flex; gap: 10px; flex-direction: row; flex-wrap: wrap;">
      <button class="bar-button" v-for="item in naviListItem">
        <img class="avatar" :src="item.icon" referrerpolicy="no-referrer">
        <div>
          <div class="bar-name">{{ item.title }}</div>
          <div class="desc">已签</div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.bgr {
  width: 80%;
  justify-self: center;
}
.desc {
  font-size: 13px;
  opacity: 0.5;
  margin-top: 2px;
}
.bar-name {
  font-size: 14px;
  font-weight: bold;
  width: fit-content;
}
.bar-button {
  display: flex;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: none;
  width: fit-content;
  text-align: left;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px 15px;
  border-radius: 5px;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}
.list-title {
  padding: 10px 5px;
  font-size: 16px;
  font-weight: bold;
  position: relative;
}
</style>