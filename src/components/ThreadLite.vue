<template>
    <div class="thread">
      <div class="user-info">
        <div class="avatar"><img class="avatar" :src="'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + avatar"></div>
        <div class="user-name">{{ user_name }}</div>
      </div>
      <div class="thread-preview">
        <div class="thread-title">{{ thread_title }}</div>
        <div class="thread-media">
          <img class="thread-img" v-if="media.length != 0" :src="media[0].big_pic" referrerpolicy="no-referrer">
        </div>
        <div class="thread-info">
          <span class="material-symbols-outlined" style="font-size: 16px;">schedule</span>{{ create_time1 }}
        </div>
        <div class="thread-info">{{ msg }}</div>
      </div>
    </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';
const create_time1 = ref('')
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0"); 
  const hh = String(date.getHours()).padStart(2, "0"); 
  const minute = String(date.getMinutes()).padStart(2, "0"); 
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd} ${hh}:${minute}:${ss}`;
}
onMounted(() => {
  create_time1.value = ref(formatDate(props.create_time));
})
const props = defineProps({
    msg: {
      type: String,
      required: false,
      default: '来自我的收藏'
    },
    avatar: {
        type: String,
        required: true,
        default: ''
    },
    user_name: {
        type: String,
        required: true,
        default: ''
    },
    thread_title: {
        type: String,
        required: true,
        default: ''
    },
    avatar: {
        type: String,
        required: true,
        default: ''
    },
    media: {
        type: Array,
        required: true,
        default: []
    },
    create_time: {
        type: Number,
        required: true,
        default: 0
    },
})
</script>
<style scoped>
.thread-info {
  display: flex;
  gap: 5px;
  opacity: 0.5;
  align-items: center;
}
.emotion {
  width: 24px;
  height: 24px;
}
.thread-media {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.thread .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
}
.thread {
  width: 80%;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  font-size: 13px;
  gap: 10px;
  transition: background-color 0.3s ease;
}
.thread:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.thread-img {
  max-width: 100px;
  max-height: 100px;
  border-radius: 5px;
}
.thread-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.thread-preview .thread-title {
  font-weight: bold;
  font-size: 16px;
}
.user-info {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>