<template>
    <div class="pinned-thread">
        <span class="material-symbols-outlined">vertical_align_top</span>
        <span style="color: #ff3e46; font-weight: bold;">置顶</span>
        <span class="thread-title">{{ title }}</span>
    </div>

</template>
<script setup>
import { defineProps } from 'vue';
defineProps({
    icon: {
        type: String,
        required: true,
        default: 'home'
    },
    title: {
        type: String,
        required: false,
        default: ''
    },
})
</script>
<style scoped>

.pinned-thread {
  width: 80%;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 8px 10px;
  display: flex;
  border-radius: 8px;
  font-size: 13px;
  gap: 5px;
}
</style>