<template>
  <span v-if="blocked" :class="props.class" :style="props.style" class="media-placeholder">{{ kind === 'avatars' ? '头像已禁用' : '图片已禁用' }}</span>
  <img v-else :class="props.class" :src="displaySrc || undefined" :alt="props.alt" :style="props.style" :loading="props.loading" referrerpolicy="no-referrer" @error="loadThroughProxy">
</template>
<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue';
import { fetchImage } from '@/core/request';
import { useSettingsStore } from '@/stores/settings';
import { normalizeMediaUrl, type MediaKind } from '@/utils/settings-policy';
const props = withDefaults(defineProps<{ src?: string; alt?: string; class?: string; style?: string | Record<string, string>; loading?: 'eager' | 'lazy'; kind?: MediaKind }>(), { src: '', alt: '', loading: 'lazy', kind: 'images' });
const settings = useSettingsStore();
const blocked = computed(() => /^https?:|^\/\//.test(props.src) && settings.isMediaBlocked(props.kind));
const offlineResolve = inject<((url: string) => string) | undefined>('offlineMedia', undefined);
const archivedSrc = computed(() => {
  if (!offlineResolve || !/^https?:|^\/\//.test(props.src)) return '';
  return offlineResolve(normalizeMediaUrl(props.src)) || '';
});
const displaySrc = ref('');
let generation = 0;
let attempted = false;
const normalizeUrl = normalizeMediaUrl;
watch(() => [props.src, blocked.value, settings.useProxy, settings.proxyUrl, archivedSrc.value], () => {
  generation++; attempted = false;
  if (blocked.value) { displaySrc.value = ''; return; }
  if (archivedSrc.value) { displaySrc.value = archivedSrc.value; return; }
  displaySrc.value = settings.useProxy && /^https?:|^\/\//.test(props.src) ? '' : normalizeUrl(props.src);
  if (!blocked.value && settings.useProxy) void loadThroughProxy();
}, { immediate: true, flush: 'sync' });
async function loadThroughProxy() {
  if (attempted || blocked.value || !props.src || !/^https?:|^\/\//.test(props.src)) return;
  const token = generation;
  // 归档副本加载失败（未归档的资源，如未保存的头像）：按设置回退联网加载。
  if (archivedSrc.value) {
    if (settings.archiveOnlineFallback) {
      attempted = true;
      displaySrc.value = normalizeUrl(props.src);
    }
    return;
  }
  attempted = true;
  try { const result = await fetchImage(normalizeUrl(props.src)); if (token === generation && !blocked.value) displaySrc.value = result; }
  catch (error) { console.warn('图片加载失败', error); }
}
</script>
