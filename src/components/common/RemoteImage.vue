<template>
  <img :class="props.class" :src="displaySrc || props.src" :alt="props.alt" :style="props.style"
    :loading="props.loading" referrerpolicy="no-referrer" @error="loadThroughProxy">
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { invoke } from '@tauri-apps/api/core';

const props = withDefaults(defineProps<{
  src: string;
  alt?: string;
  class?: string;
  style?: string | Record<string, string>;
  loading?: 'eager' | 'lazy';
}>(), {
  alt: '',
  class: undefined,
  style: undefined,
  loading: 'lazy',
});

const displaySrc = ref('');
const proxyAttempted = ref(false);

function normalizeUrl(value: string): string {
  if (value.startsWith('//')) return `https:${value}`;
  if (value.startsWith('http://')) return `https://${value.slice('http://'.length)}`;
  return value;
}

async function loadThroughProxy(): Promise<void> {
  if (proxyAttempted.value || !props.src || props.src.startsWith('data:')) return;
  proxyAttempted.value = true;
  try {
    displaySrc.value = await invoke<string>('fetch_image_base64', { url: normalizeUrl(props.src) });
  } catch (error) {
    console.warn('图片加载失败:', props.src, error);
  }
}

watch(() => props.src, () => {
  proxyAttempted.value = false;
  displaySrc.value = normalizeUrl(props.src);
}, { immediate: true });
</script>
