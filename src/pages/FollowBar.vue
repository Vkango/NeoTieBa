<script setup>
import RippleButton from '../components/RippleButton.vue';
import { onMounted, ref } from 'vue';
import Tag from '../components/Tag.vue';
import { read_file } from '../read_file';
import { tieBaAPI } from '../tieba-api';
import Container from '../components/Container.vue';
const naviListItem = ref([]);
onMounted(async () => {
  const bduss = await read_file('../bduss.txt');
  const api = new tieBaAPI;
  
  naviListItem.value = (await api.FollowBar(bduss, 1)).data.like_forum.list;
})
const emit = defineEmits(['BarNameClicked']);
</script>

<template>
  <Container>
  <div class="bgr">
    <div class="list-title">关注的吧</div>
    <div style="display: flex; gap: 10px; flex-direction: row; flex-wrap: wrap;">
      <button class="bar-button" v-for="item in naviListItem" @click="emit('BarNameClicked', item.forum_name)">
        <img class="avatar" :src="item.avatar" referrerpolicy="no-referrer">
        <div>
          <div class="bar-name">{{ item.forum_name }} <Tag>{{ item.level_id }}</Tag></div>
          <div class="desc">热度 {{ item.hot_num }}</div>
        </div>
      </button>
    </div>
  </div>
  </Container>
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