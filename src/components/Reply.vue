<template>
  <div class="thread" @click.stop>
    <div class="user-info" @click="userNameClicked(props.uid)">
      <div class="avatar"><img class="avatar"
          :src="'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + avatar"></div>
      <div>
        <div class="user-name">{{ user_name }}<span class="level"
            :class="{ 'color1': level >= 0 && level < 4, 'color2': level >= 4 && level < 10, 'color3': level >= 10 && level < 16, 'color4': level > 16 }">{{
              level }}</span>
        </div>
        <div class="desc">{{ getTimeInterval(props.create_time * 1000) }}</div>
      </div>


    </div>
    <div class="thread-preview">
      <div class="thread-content" v-html="content">
      </div>
      <div class="thread-info">

        <span class="material-symbols-outlined" style="font-size: 16px;">share</span>分享
        <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 10px;">floor</span> {{ floor }} 楼
        <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 10px;"
          v-if="reply_num > 0">forum</span> <span v-if="reply_num > 0">{{ reply_num }}</span>

      </div>
      <div class="subpost" v-if="reply_num > 0">
        <SubPost v-for="item in subpost_list" :thread_content="item.content" @userNameClicked="userNameClicked"
          :avatar="item.author.portrait" :uid="item.author.id" :user_name="item.author.name_show || item.author.name">
        </SubPost>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, defineEmits } from 'vue';
import { tieBaAPI } from '../tieba-api';
import SubPost from './SubPost.vue';
import { getTimeInterval } from '../helper';
const content = ref('')
const create_time1 = ref('')
const subpost_list = ref([])
const emit = defineEmits(['userNameClicked'])
const userNameClicked = (uid) => {
  emit('userNameClicked', uid);
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
        if (index != 0) {
          content.value += props.thread_content[index].type == 0 ? `<br>` : ``;
        }
        content.value += ele.text;
        break;
      case 2: // emotion
        content.value += `<img class="emotion" src="${('../src/assets/emotion/' + ele.text + '.png')}" alt="${ele.c}" />`;
        break;
      case 3: // image
        content.value += (index != 0 ? `<br>` : ``) + `<img style="  max-height: 450px; max-width: 300px; border-radius: 5px;" src="${ele.big_cdn_src || ele.origin_src}" referrerpolicy="no-referrer">`;
        break;

    }
  });
  if (props.reply_num > 0) {
    const Api = new tieBaAPI;
    Api.viewSubPost(props.tid, props.pid).then((res) => {
      subpost_list.value = res.subpost_list;
      if (subpost_list.value.length > 5) {
        subpost_list.value = subpost_list.value.slice(0, 5);
      }
    });
  }
})
const props = defineProps({
  avatar: {
    type: String,
    required: true,
    default: ''
  },
  uid: {
    type: Number,
    required: true,
  },
  user_name: {
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
  tid: {
    type: Number,
    required: true,
    default: ''
  },
  pid: {
    type: Number,
    required: true,
    default: ''
  },
  floor: {
    type: Number,
    required: true
  },
  level: {
    type: Number,
    required: false,
    default: 0
  }
})

</script>
<style scoped>
.subpost {
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: rgba(var(--text-color), 0.02);
  gap: 8px;
  border: 1px solid rgba(var(--text-color), 0.03);
  margin-bottom: 10px;
}

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


.thread-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thread-preview .thread-title {
  font-weight: bold;
  font-size: 16px;
}
</style>