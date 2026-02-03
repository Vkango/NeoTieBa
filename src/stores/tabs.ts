import { defineStore } from 'pinia';
import { ref, computed, markRaw } from 'vue';
import type { TabItem } from '@/types/common';

let tabIdCounter = 0;

export const useTabStore = defineStore('tabs', () => {
  const tabs = ref<TabItem[]>([]);
  const activeKey = ref<string | null>(null);
  const closingTabs = ref<TabItem[]>([]);

  const draggingTabId = ref<number | null>(null);
  const dragOffsetX = ref(0);

  const visibleTabs = computed(() => {
    return [...tabs.value, ...closingTabs.value].sort((a, b) => a.position - b.position);
  });

  const currentTab = computed(() => {
    return tabs.value.find(t => t.key === activeKey.value) || null;
  });

  function addTab(config: Partial<TabItem> & { key: string }) {
    const id = ++tabIdCounter;
    const newTab: TabItem = {
      id,
      key: config.key,
      renderKey: config.key,
      selected: true,
      icon: config.icon || '',
      title: config.title || '',
      component: config.component ? markRaw(config.component) : null,
      props: config.props || {},
      icon_invert: false,
      show: true,
      position: tabs.value.length,
      desc: config.title || '',
      content: '',
      isClosing: false,
      origin: config.origin,
      if: true
    } as TabItem;

    const existing = tabs.value.find(t => t.key === config.key);
    if (existing) {
      switchTab(existing.key);
      return id;
    }

    tabs.value.push(newTab);
    switchTab(config.key);
    return id;
  }

  function switchTab(key: string | number) {
    tabs.value.forEach(tab => {
      tab.selected = tab.key === key;
    });
    activeKey.value = String(key);
  }

  function removeTab(id: number | string) {
    const tab = tabs.value.find(t => t.id === id);
    if (!tab) return;

    const wasActive = tab.selected;
    const idx = tabs.value.findIndex(t => t.id === id);

    tabs.value = tabs.value.filter(t => t.id !== id);

    const closingTab: TabItem = {
      ...tab,
      isClosing: true,
      id: `closing-${tab.id}-${Date.now()}` as unknown as number
    };
    closingTabs.value.push(closingTab);

    tabs.value.forEach((t, index) => {
      t.position = index;
    });

    if (wasActive && tabs.value.length > 0) {
      const nextIdx = Math.min(idx, tabs.value.length - 1);
      switchTab(tabs.value[nextIdx].key);
    } else if (tabs.value.length === 0) {
      activeKey.value = null;
    }

    setTimeout(() => {
      closingTabs.value = closingTabs.value.filter(t => !String(t.id).startsWith('closing-'));
    }, 300);
  }

  function updateTabMeta(key: string | number, meta: Partial<Pick<TabItem, 'title' | 'icon' | 'renderKey'>>) {
    const tab = tabs.value.find(t => t.key === String(key));
    if (tab) {
      Object.assign(tab, meta);
    }
  }

  function refreshTab(key: string | number) {
    const tab = tabs.value.find(t => t.key === key);
    if (tab) {
      tab.renderKey = `${key}-${Date.now()}`;
      tab.icon = '/assets/loading.svg';
      tab.title = '正在加载';
    }
  }

  function getTab(id: number | string) {
    return tabs.value.find(t => t.id === id || t.key === id);
  }

  function setTab(id: number | string, partial: Partial<TabItem>) {
    const tab = getTab(id);
    if (tab) Object.assign(tab, partial);
  }

  function reorderTabs(fromId: number, toId: number) {
    const fromIdx = tabs.value.findIndex(t => t.id === fromId);
    const toIdx = tabs.value.findIndex(t => t.id === toId);

    if (fromIdx < 0 || toIdx < 0) return;

    const [movedTab] = tabs.value.splice(fromIdx, 1);
    tabs.value.splice(toIdx, 0, movedTab);

    tabs.value.forEach((tab, idx) => {
      tab.position = idx;
    });
  }

  function startDrag(tabId: number) {
    draggingTabId.value = tabId;
  }

  function updateDragOffset(offsetX: number) {
    dragOffsetX.value = offsetX;
  }

  function endDrag() {
    draggingTabId.value = null;
    dragOffsetX.value = 0;
  }

  return {
    tabs,
    closingTabs,
    visibleTabs,
    activeKey,
    currentTab,
    draggingTabId,
    dragOffsetX,
    addTab,
    switchTab,
    removeTab,
    updateTabMeta,
    refreshTab,
    getTab,
    setTab,
    reorderTabs,
    startDrag,
    updateDragOffset,
    endDrag
  };
});
