<script setup>
import RippleButton from '../components/RippleButton.vue';
import { onMounted, ref } from 'vue';
import Tag from '../components/Tag.vue';
import { read_file } from '../read_file';
import { tieBaAPI } from '../tieba-api';
import Container from '../components/Container.vue';
import Loading from '../components/Loading.vue';
const naviListItem = ref([]);
const isLoading = ref(true);
onMounted(async () => {
  const bduss = await read_file('../cookie.txt');
  const api = new tieBaAPI;
  
  naviListItem.value = (await api.FollowBar(bduss, 1)).data.like_forum.list;
  isLoading.value = false;
})
const emit = defineEmits(['BarNameClicked']);
</script>

<template>
  <Container>
  <div class="bgr">
    <div class="list-title">关注的吧</div>
    <transition name="fade1">
    <div style="display: flex; gap: 10px; flex-direction: row; flex-wrap: wrap;" v-if="!isLoading">
      <button class="bar-button" v-for="item in naviListItem" @click="emit('BarNameClicked', item.forum_name)">
        <img class="avatar" :src="item.avatar" referrerpolicy="no-referrer">
        <div style="margin-left: 5px;">
          <div class="bar-name">{{ item.forum_name }} </div>
          <div class="desc"><span class="level" :class="{ 'color1' : item.level_id >= 0 && item.level_id < 4, 'color2': item.level_id >= 4 && item.level_id < 10, 'color3': item.level_id >= 10 && item.level_id < 16, 'color4': item.level_id > 16}">{{ item.level_id }}</span><span>热度 {{ item.hot_num }}</span></div>
        </div>
      </button>
    </div>
    </transition>
  </div>
  <transition name="fade1">
    <Loading class="loading-box" v-if="isLoading"></Loading>
  </transition>
  </Container>
</template>

<style scoped>
.level {
  margin: 0;
}
.bgr {
  width: 80%;
  justify-self: center;
}
.desc {
  font-size: 13px;
  opacity: 0.5;
  display: flex;
  align-items : center;
  gap: 5px;
}
.bar-name {
  font-size: 16px;
  font-weight: bold;
  width: 200px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
}
.bar-button {
  display: flex;
  gap: 10px;
  background-color: rgba(var(--text-color), 0.05);
  box-shadow: none;
  width: 300px;
  text-align: left;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px 15px;
  border-radius: 5px;
  align-items: center;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}
.list-title {
  padding: 10px 5px;
  font-size: 16px;
  font-weight: bold;
  position: relative;
}
</style>