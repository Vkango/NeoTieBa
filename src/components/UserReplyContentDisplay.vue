<template>
  <div class="thread">
    <div class="thread-preview">
      <div class="thread-content" v-html="content">
      </div>
      <div class="thread-info">
        <span class="material-symbols-outlined" style="font-size: 16px;">schedule</span>{{ create_time1 }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
const create_time1 = ref('');
const content = ref('');
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

const props = defineProps({
  content: {
    type: Array,
    required: true,
    default: []
  },
  createTime: {
    type: String,
    required: true,
    default: 0
  },
})
onMounted(() => {
  create_time1.value = ref(formatDate(props.createTime));
  console.log(props.content, "content")
  props.content.forEach((ele, index) => {
    console.log(ele);
    switch (ele.type) {
      case 0: // text
        content.value += ele.text
        if (index != 0 && props.content[index - 1].type == 3) {
          content.value += `<br>`
        }
        break;
      case 2: // emotion
        content.value += `<img class="emotion" src="/assets/emotion/${ele.text}.png" alt="${ele.c}" />`;
        break;
      case 4: // emotion
        content.value += `<span style="font-weight: bold">${ele.text}</span>`;
        break;
    }
  });
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
  width: 100%;
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

.user-info {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>