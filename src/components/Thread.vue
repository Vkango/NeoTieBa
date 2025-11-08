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
        <img class="thread-img" v-for="i in media?.filter(item => item.type == 3)" :src="i.big_pic"
          referrerpolicy="no-referrer">
        <span v-for="i in media?.filter(item => item.type == 5)">
          <img class="thread-img" :src="i.vpic" referrerpolicy="no-referrer">
          <span class="material-symbols-outlined"
            style="position: relative; font-size: 28px; top: 0%; left: 0%; opacity: 0.7; transform: translate(-110%, -10%);">play_circle</span>
        </span>

        </img>
      </div>
      <div class="thread-info">
        <span v-if="fromBar != ''" style="display: flex; align-items: center;"><img :src="fromBarAvatar"
            style="width: 16px; height: 16px; border-radius: 16px; margin-right: 5px;"
            referrerpolicy="no-referrer"><span style="margin-right: 5px;">{{ fromBar }}吧</span></span>

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
        if (index != 0 && props.thread_content[index - 1].type == 3) {
          content.value += `<br>`
        }
        content.value += ele.text;
        break;
      case 1: // link
        content.value += `<a href="${ele.text}" target="_blank" rel="noopener noreferrer">${ele.text}</a>`;
        break;
      case 2: // emotion
        content.value += `<img class="emotion" src="${('/assets/emotion/' + ele.text + '.png')}" alt="${ele.c}" />`;
        break;
      case 3: // image
        content.value += (index != 0 ? `<br>` : ``) + `<img class="thread-reply-img" style="  max-height: 450px; max-width: 300px; border-radius: 5px;" src="${ele.big_cdn_src || ele.origin_src}" referrerpolicy="no-referrer">`;
        break;
      case 4: // at
        content.value += `<button class="at-button" uid="${ele.uid}">${ele.text}</button>`;
        break;
      case 5: // video
        content.value += (index != 0 ? `<br>` : ``) + `<video class="thread-reply-img" style="max-height: 450px; max-width: 300px; border-radius: 5px;" src="${ele.link}" referrerpolicy="no-referrer" controls></video>`;
        break;
      default:
        content.value += `<div style='color: red'>Failed to parse: ` + JSON.stringify(ele) + `</div>`;
        break;
    }
  });
})
const props = defineProps({
  fromBarAvatar: {
    type: String,
    required: false,
    default: ''
  },
  fromBar: {
    type: String,
    required: false,
    default: ''
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