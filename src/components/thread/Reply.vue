<template>
  <div class="thread" @click.stop>
    <div class="user-info" @click="userNameClicked(props.uid as string | number)">
      <div class="avatar"><img class="avatar"
          :src="'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + avatar"
          referrerpolicy="no-referrer"></div>
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
        <span class="material-symbols-outlined" style="font-size: 16px;">location_on</span>{{ ipAddress }}
        <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 10px;">share</span>分享
        <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 10px;">thumb_up</span> {{ like }} 赞

        <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 10px;">floor</span> {{ floor }} 楼
        <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 10px;"
          v-if="reply_num > 0">forum</span> <span v-if="reply_num > 0">{{ reply_num }} 回复</span>

      </div>
      <div class="subpost" v-if="reply_num > 0">
        <SubPost v-for="item in subpost_list" :thread_content="item.content" @userNameClicked="userNameClicked"
          :avatar="item.author.portrait" :uid="item.author.id" :user_name="item.author.name_show || item.author.name">
        </SubPost>
        <RippleButton v-if="reply_num > 5" @click="emit('viewAllReplies', props)"
          style="box-sizing: border-box; margin: 5px 15px; background-color: transparent; box-shadow: none; width: fit-content;">
          查看全部 {{ reply_num }} 条回复
        </RippleButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, inject } from 'vue';
import { useApiStore } from '@/stores';
import SubPost from './SubPost.vue';
import { getTimeInterval, processContentElements } from '@/utils/helper';
import type { ContentElement } from '@/types/common';

// Props和Emits类型定义
interface Props {
  ipAddress?: string;
  avatar: string;
  uid: string | number;
  user_name: string;
  thread_content: unknown[];
  like: number;
  is_lz: boolean;
  create_time: number;
  reply_num: number;
  tid: string;
  pid: string | number;
  floor: number;
  level?: number;
}

const props = withDefaults(defineProps<Props>(), {
  ipAddress: '未知',
  level: 0
});

const emit = defineEmits<{
  (e: 'userNameClicked', uid: string | number): void;
  (e: 'viewAllReplies', data: Props): void;
}>();

const openImageViewer = inject<((url: string) => void) | undefined>('openImageViewer');
const content = ref('')
const subpost_list = ref<any[]>([])

const userNameClicked = (uid: string | number) => {
  emit('userNameClicked', uid);
}

const handleClick = (event: any) => {
  if (event.target.classList.contains('thread-reply-img')) {
    if (openImageViewer) {
      openImageViewer(event.target.src);
    }
  }
  if (event.target.classList.contains('at-button')) {
    emit('userNameClicked', event.target.getAttribute('uid'));
  }
}

onMounted(() => {
  content.value = processContentElements(props.thread_content as ContentElement[]);
  if (props.reply_num > 0) {
    const apiStore = useApiStore();
    const Api = apiStore.getApi();
    Api.viewSubPost(props.tid, props.pid).then((res: any) => {
      subpost_list.value = res.subpost_list;
      if (subpost_list.value.length > 5) {
        subpost_list.value = subpost_list.value.slice(0, 5);
      }
    });
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
