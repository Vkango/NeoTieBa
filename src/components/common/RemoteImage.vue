<template>
  <span v-if="blocked" :class="props.class" :style="props.style" class="media-placeholder">{{ kind === 'avatars' ? '头像已禁用' : '图片已禁用' }}</span>
  <img v-else :class="props.class" :src="displaySrc || undefined" :alt="props.alt" :style="props.style" :loading="props.loading" referrerpolicy="no-referrer" @error="loadThroughProxy">
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { fetchImage } from '@/core/request';
import { useSettingsStore } from '@/stores/settings';
import { normalizeMediaUrl, type MediaKind } from '@/utils/settings-policy';
const props = withDefaults(defineProps<{ src?: string; alt?: string; class?: string; style?: string | Record<string, string>; loading?: 'eager' | 'lazy'; kind?: MediaKind }>(), { src: '', alt: '', loading: 'lazy', kind: 'images' });
const settings = useSettingsStore();
const blocked = computed(() => /^https?:|^\/\//.test(props.src) && settings.isMediaBlocked(props.kind));
const displaySrc = ref('');
let generation = 0;
let attempted = false;
const normalizeUrl = normalizeMediaUrl;
watch(() => [props.src, blocked.value, settings.useProxy, settings.proxyUrl], () => { generation++; attempted = false; displaySrc.value = blocked.value || settings.useProxy && /^https?:|^\/\//.test(props.src) ? '' : normalizeUrl(props.src);
 if (!blocked.value && settings.useProxy) void loadThroughProxy(); }, { immediate: true, flush: 'sync' });
async function loadThroughProxy() {
 if (attempted || blocked.value || !props.src || !/^https?:|^\/\//.test(props.src)) return;
 attempted = true;
 const token = generation;
 try { const result = await fetchImage(normalizeUrl(props.src)); if (token === generation && !blocked.value) displaySrc.value = result; }
 catch (error) { console.warn('图片加载失败', error); }
}
</script>
