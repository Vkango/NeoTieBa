<template>
  <div class="subpost-1">
    <div class="user-info" @click="emit('userNameClicked', props.uid)">
      <div class="avatar"><img class="avatar"
          :src="'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + avatar"></div>
      <div class="user-name">{{ user_name }}</div>
    </div>
    <div class="subpost-preview">
      <div class="thread-content" @click="handleClick" v-html="content">
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, defineEmits } from 'vue';
import { processContentElements } from '../helper';
const content = ref('')
const emit = defineEmits(['userNameClicked'])
const handleClick = (event) => {
  if (event.target.classList.contains('at-button')) {
    emit('userNameClicked', event.target.getAttribute('uid'));
  }
}
onMounted(() => {
  content.value = processContentElements(props.thread_content);
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
  thread_content: {
    type: Array,
    required: true,
    default: []
  },
  uid: {
    required: true,
  }
})
</script>
<style scoped>
.subpost-1 {
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.subpost-1 .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
}

.subpost-1 {
  box-sizing: border-box;
  padding: 8px 15px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  font-size: 13px;
  gap: 10px;
  transition: background-color 0.3s ease;
}

.subpost-1:hover {
  background-color: rgba(var(--text-color), 0.1);
}

.subpost-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.subpost-preview .thread-title {
  font-weight: bold;
  font-size: 16px;
}

.user-info {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>