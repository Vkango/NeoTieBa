<template>
  <div :style="{ backgroundColor: bgColor }" class="tag">
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  bgColor: {
    type: String,
    default: 'rgba(var(--text-color), 0.1)'
  }
});
</script>

<style scoped>
.tag {
  display: inline-block;
  padding: 0px 7px;
  border-radius: 5px;
  color: rgba(var(--text-color));
  font-size: 12px;
  margin: 0px 3px;
}
</style>