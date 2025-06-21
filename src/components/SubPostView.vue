<template>
  <Container @yscroll="onScroll" style="background-color: transparent;">
    <div class="thread" @click.stop>
      <div class="user-info" @click="userNameClicked(props.uid)">
        <div class="avatar"><img class="avatar"
            :src="'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + avatar"></div>
        <div>
          <div class="user-name">{{ user_name }}<span class="level"
              :class="{ 'color1': level >= 0 && level < 4, 'color2': level >= 4 && level < 10, 'color3': level >= 10 && level < 16, 'color4': level >= 16 }">{{
                level }} {{ is_lz ? '楼主' : '' }}</span>
          </div>
          <div class="desc">{{ getTimeInterval(props.create_time * 1000) }}</div>
        </div>


      </div>
      <div class="thread-preview">
        <div class="thread-content" v-html="content" style="user-select: text;" @click="handleClick">
        </div>
        <div class="thread-info">
          <!-- <button @click="dom2img">申必</button> -->
          <span class="material-symbols-outlined" style="font-size: 16px;">share</span>分享
          <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 10px;">thumb_up</span> {{ like }}
          赞
          <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 10px;">floor</span> {{ floor }} 楼
          <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 10px;"
            v-if="reply_num > 0">forum</span> <span v-if="reply_num > 0">{{ reply_num }} 回复</span>

        </div>
        <div class="subpost" v-if="reply_num > 0">
          <SubPost v-for="item in subpost_list" :thread_content="item.content" @userNameClicked="userNameClicked"
            :avatar="item.author.portrait" :uid="item.author.id" :user_name="item.author.name_show || item.author.name">
          </SubPost>
        </div>

      </div>
      <transition name="fade1">
        <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
      </transition>
    </div>
  </Container>
</template>

<script setup>
import { defineProps, onMounted, ref, defineEmits, inject } from 'vue';
import { tieBaAPI } from '../tieba-api';
import SubPost from './SubPost.vue';
import { getTimeInterval } from '../helper';
import RippleButton from './RippleButton.vue';
import Loading from './Loading.vue';
import Container from './Container.vue';
const sendToast = inject('sendToast');
const openImageViewer = inject('openImageViewer');
const content = ref('')
const currentPage = ref(1);
const isThreadsLoading = ref(true);
const create_time1 = ref('')
const subpost_list = ref([])
let pageInfo;
const emit = defineEmits(['userNameClicked'])
const onScroll = (target) => {
  if ((target.scrollTop + target.clientHeight + 20 >= target.scrollHeight)) {
    if (isThreadsLoading.value) {
      return;
    }
    if (pageInfo.current_page >= pageInfo.total_page) {
      sendToast('没有更多回复了', 2000);
      return;
    }
    nextPage();
  }
}
const nextPage = async () => {
  currentPage.value++;
  loadData();
}
const loadData = async () => {
  isThreadsLoading.value = true;
  const res = await new tieBaAPI().viewSubPost(props.tid, props.pid, currentPage.value)
  subpost_list.value = [...subpost_list.value, ...res.subpost_list];
  pageInfo = res.page;
  console.log(pageInfo);
  isThreadsLoading.value = false;
}
const userNameClicked = (uid) => {
  emit('userNameClicked', uid);
}

const handleClick = (event) => {
  if (event.target.classList.contains('thread-reply-img')) {
    openImageViewer(event.target.src);
  }
  if (event.target.classList.contains('at-button')) {
    emit('userNameClicked', event.target.getAttribute('uid'));
  }
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
  if (props.reply_num > 0) {
    const Api = new tieBaAPI;
    Api.viewSubPost(props.tid, props.pid).then((res) => {
      subpost_list.value = res.subpost_list;

      pageInfo = res.page;
      console.log(pageInfo.total_count, pageInfo.total_page, pageInfo.current_page);
    });
    isThreadsLoading.value = false;
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
  like: {
    type: Number,
    required: true,
    default: 0
  },
  is_lz: {
    type: Boolean,
    default: false
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

.thread {
  width: 100%;
  background-color: transparent;
}

.thread:hover {
  background-color: transparent;

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