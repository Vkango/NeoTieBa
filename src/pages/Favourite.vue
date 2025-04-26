<script setup>
import RippleButton from '../components/RippleButton.vue';
import { onMounted, ref } from 'vue';
import Tag from '../components/Tag.vue';
import { read_file } from '../read_file';
import { tieBaAPI } from '../tieba-api';
import Container from '../components/Container.vue';
import Loading from '../components/Loading.vue';
import ThreadLite from '../components/ThreadLite.vue';
const naviListItem = ref([]);
const isLoading = ref(true);
const isThreadsLoading = ref(true);
let offset = 0;
const api = new tieBaAPI;
let bduss = "";
const threadList = ref([]);
onMounted(async () => {
  bduss = "BDUSS=" + await read_file(import.meta.env.PROD ? './bduss.txt' : '../bduss.txt');
  loadData()
})
const loadData = async () => {
  isThreadsLoading.value = true;
  const ret = await api.Favourite(bduss, offset);
  console.log(ret)
  threadList.value = [...threadList.value, ...ret.store_thread];
  isLoading.value = false;
  isThreadsLoading.value = false;
}
const onScroll = (target) => {
  if ((target.scrollTop + target.clientHeight + 20 >= target.scrollHeight)) {
    if (isThreadsLoading.value) {
      return;
    }
    offset += 20;
    loadData();
  }
}
const emit = defineEmits(['threadClick']);
const handleClick = (id) => {
  emit('threadClick', id);
}
</script>

<template>
  <Container @yscroll="onScroll">
    <transition name="fade1">
      <div class="bgr" v-if="!isLoading">
        <div class="list-title">我的收藏</div>
        <div style="display: flex; gap: 10px; flex-direction: row; flex-wrap: wrap;">
          <ThreadLite @click="handleClick(item.thread_id)" v-for="item in threadList" :thread_title="item.title"
            :media="item.media" :user_name="item.author.name_show || item.author.name"
            :avatar="item.author.user_portrait" :create_time="item.last_time"
            :style="{ opacity: item.is_deleted ? 0.5 : 1 }"
            :msg="item.is_deleted ? '贴子以被删除' : item.forum_name + '吧 | ' + (item.post_no_msg == '' ? '无更新' : item.post_no_msg)">
          </ThreadLite>
        </div>

      </div>
    </transition>
    <transition name="fade1">
      <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
    </transition>
  </Container>
</template>

<style scoped>
.bgr {
  width: 80%;
  padding: 0 10px;
  justify-self: center;
}

.thread {
  width: 100%;
}

.desc {
  font-size: 13px;
  opacity: 0.5;
  margin-top: 5px;
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