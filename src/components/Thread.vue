<template>
  <div class="thread" @click="emit('threadClicked')">
    <div class="user-info" @click.stop @click="userNameClicked">
      <div class="avatar"><img class="avatar"
          :src="'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + avatar"></div>
      <div>
        <div class="user-name">{{ user_name }}</div>
        <div class="desc">{{ getTimeInterval(props.create_time * 1000) }}</div>
      </div>
    </div>
    <div class="thread-preview">
      <div class="thread-title">{{ thread_title }}</div>
      <div class="thread-content" v-html="content">
      </div>
      <div class="thread-media">
        <img class="thread-img" v-for="i in media" :src="i.big_pic" referrerpolicy="no-referrer">
      </div>
      <div class="thread-info">
        <span class="material-symbols-outlined" style="font-size: 16px;">share</span>分享
        <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 10px;">forum</span> {{ reply_num }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { getTimeInterval } from '../helper';
const content = ref('')
const create_time1 = ref('')
const emit = defineEmits(['UserNameClicked', "threadClicked"])
const userNameClicked = () => {
  emit('UserNameClicked');
}
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
  props.thread_content.forEach((ele, index) => {
    switch (ele.type) {
      case 0: // text
        // if (index != 0 && props.thread_content[index - 1].type != 0) {
        //   content.value += `<br>`
        // }
        content.value += ele.text;
        break;
      case 2: // emotion
        content.value += `<img class="emotion" src="/assets/emotion/${ele.text}.png" alt="${ele.c}" />`;
        break;
    }
  });
})
const props = defineProps({
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
  thread_content: {
    type: Array,
    required: true,
    default: []
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
  reply_num: {
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


.thread-img {
  max-height: 450px;
  border-radius: 5px;
}

.thread-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thread-preview .thread-title {
  font-weight: bold;
  font-size: 130%;
}

.user-info {
  display: flex;
  gap: 10px;
  align-items: center;
  width: fit-content;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}

.user-info:hover {
  background-color: rgba(var(--text-color), 0.1);
}
</style>