<script setup lang="ts">
import { computed, nextTick, onActivated, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useTabStore } from '@/stores/tabs';

const props = defineProps<{
  scrollKey?: string;
  tabKey?: string | number;
}>();

const emit = defineEmits<{
  (event: 'yscroll', target: HTMLElement): void;
  (event: 'positionchange', target: HTMLElement): void;
}>();

const tabStore = useTabStore();
const scrollContainer = ref<HTMLElement | null>(null);
const scrollPosition = ref(0);
const isRestoring = ref(false);
let restoreTimer: number | undefined;

const identityKey = computed(() => {
  if (props.tabKey !== undefined && props.tabKey !== null) {
    return String(props.tabKey);
  }
  return props.scrollKey || '';
});

const storageKey = computed(() => identityKey.value ? `scrollPosition:${identityKey.value}` : '');
const isActiveTab = computed(() => {
  if (props.tabKey === undefined || props.tabKey === null) {
    return true;
  }
  return tabStore.activeKey === String(props.tabKey);
});

function getSavedPosition(): number {
  if (!storageKey.value) {
    return scrollPosition.value;
  }

  const savedPosition = sessionStorage.getItem(storageKey.value);
  const parsed = savedPosition ? Number.parseInt(savedPosition, 10) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

function handleScroll(event: Event) {
  const target = event.target as HTMLElement;
  scrollPosition.value = target.scrollTop;
  if (isActiveTab.value) emit('positionchange', target);

  if (isRestoring.value || !isActiveTab.value) {
    return;
  }

  if (storageKey.value) {
    sessionStorage.setItem(storageKey.value, String(scrollPosition.value));
  }

  emit('yscroll', target);
}

function clearRestoreTimer() {
  if (restoreTimer !== undefined) {
    window.clearTimeout(restoreTimer);
    restoreTimer = undefined;
  }
}

function restoreScrollPosition(attempt = 0) {
  if (!isActiveTab.value) {
    return;
  }

  const targetTop = getSavedPosition();
  scrollPosition.value = targetTop;
  clearRestoreTimer();

  nextTick(() => {
    window.requestAnimationFrame(() => {
      const target = scrollContainer.value;
      if (!target || !isActiveTab.value) {
        isRestoring.value = false;
        return;
      }

      isRestoring.value = true;
      const maxScrollTop = Math.max(0, target.scrollHeight - target.clientHeight);
      target.scrollTop = Math.min(targetTop, maxScrollTop);

      if (targetTop > maxScrollTop && attempt < 8) {
        restoreTimer = window.setTimeout(() => restoreScrollPosition(attempt + 1), 80);
        return;
      }

      window.setTimeout(() => {
        isRestoring.value = false;
      }, 0);
    });
  });
}

onActivated(() => {
  restoreScrollPosition();
});

onMounted(() => {
  restoreScrollPosition();
});

watch(
  () => [tabStore.activeKey, storageKey.value] as const,
  () => {
    restoreScrollPosition();
  },
  { flush: 'post' }
);

onBeforeUnmount(() => {
  clearRestoreTimer();
});

function scrollToTop() {
  clearRestoreTimer();
  scrollPosition.value = 0;
  if (storageKey.value) sessionStorage.setItem(storageKey.value, '0');
  scrollContainer.value?.scrollTo({ top: 0, behavior: 'instant' });
}

function scrollToElement(element: HTMLElement) {
  const container = scrollContainer.value;
  if (!container) return;
  clearRestoreTimer();
  isRestoring.value = false;
  const top = Math.max(0, container.scrollTop + element.getBoundingClientRect().top - container.getBoundingClientRect().top - 12);
  scrollPosition.value = top;
  if (storageKey.value) sessionStorage.setItem(storageKey.value, String(top));
  container.scrollTo({ top, behavior: 'instant' });
}

defineExpose({ scrollToTop, scrollToElement, getScrollElement: () => scrollContainer.value });
</script>

<template>
  <div ref="scrollContainer" class="component-container" @scroll="handleScroll">
    <slot></slot>
  </div>
</template>

<style lang="css" scoped>
.component-container {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.02);
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 5px;
}
</style>
