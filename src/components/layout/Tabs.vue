<template>
  <transition-group name="tab-list" tag="div" class="tabs" @wheel="onTabScroll"
    @before-leave="(el: Element) => setItemPosition(el as HTMLElement)"
    @leave="(el: Element, done: () => void) => handleLeave(el as HTMLElement, done)" @mousedown="startDragging"
    @mouseup="stopDragging" @mouseleave="stopDragging; showTabInfo = false;">
    <RippleButton class="tab-ripplebutton" v-for="tab in tabStore.visibleTabs" :class="{
      'selected': tab.selected,
      'invert': tab.icon_invert,
      'show': !tab.show,
      'dragging': tabStore.draggingTabId === tab.id,
      'closing': tab.isClosing
    }" :key="`${tab.id}-${tab.renderKey}`" :data-tab-id="tab.id" @click="handleClick(tab)"
      @mousedown.stop="startDrag($event, tab)" @mouseenter="showTabInfo = true; updateTabInfoPos(tab)"
      :style="getTabStyle(tab)">
      <div class="tab-content">
        <img class="icon" :src="getIconPath(tab.icon)" referrerpolicy="no-referrer" />
        <div class="title">{{ tab.title }}</div>
        <span class="material-symbols-outlined" id="close" style="font-size: 12px;" @click.stop
          @click="showTabInfo = false; handleDelete(tab)">close</span>
      </div>
    </RippleButton>

  </transition-group>
  <Transition name="fade1">
    <TabInfo :title="tabMouseOn.title" :desc="tabMouseOn.desc" v-show="showTabInfo" @mouseenter="showTabInfo = true"
      @mouseleave="showTabInfo = false" :componentkey="tabMouseOn.component.__name ?? ''" :icon="tabMouseOn.icon ?? ''"
      :id="tabMouseOn.id" @refresh="emit('onTabRefresh', tabMouseOn.id)">
      <div v-html="tabMouseOn.content"></div>
    </TabInfo>
  </Transition>

</template>

<script setup lang="ts">
import type { TabItem } from '@/types/common';
import { ref, onBeforeUnmount, nextTick, type Component, watch } from 'vue';
import { useTabStore } from '@/stores/tabs';
import RippleButton from '#components/common/RippleButton.vue';
import { getCurrentWindow } from '@tauri-apps/api/window';
import TabInfo from './TabInfo.vue';

// Type definitions
interface TabPosition {
  left: number;
  right: number;
  width: number;
  id: number | string;
}

interface TabMouseOnInfo {
  title: string;
  desc: string;
  icon: string;
  id: number;
  content: string;
  component: { __name?: string };
}

const isMaximized = ref(false);
const showTabInfo = ref(false);
const isMouseDown = ref(false);
const _isMoved = ref(false);
const tabMouseOn = ref<TabMouseOnInfo>({
  title: '',
  desc: '',
  icon: '',
  id: 0,
  content: '',
  component: { __name: '' }
});

const tabStore = useTabStore();

// Emit events for parent components
const emit = defineEmits<{
  (e: 'click'): void;
  (e: 'onSwitchTabs', id: number): void;
  (e: 'onTabDelete', key: string | number): void;
  (e: 'onTabRefresh', id: number): void;
}>();

// Watch for activeKey changes and emit event
watch(
  () => tabStore.activeKey,
  (newActiveKey) => {
    if (newActiveKey) {
      const tab = tabStore.tabs.find((t: TabItem) => t.key === newActiveKey);
      if (tab && typeof tab.id === 'number') {
        emit('onSwitchTabs', tab.id);
      }
    }
  },
  { immediate: true }
);
const itemPositions = ref(new Map<HTMLElement, DOMRect>());
const dragStartX = ref(0);
const _dragStartY = ref(0);
const _tabElements = ref<Element[]>([]);
const tabPositions = ref<TabPosition[]>([]);
const isDragging = ref(false);

const updateTabInfoPos = (tab: TabItem): void => {
  const elem = document.getElementsByClassName('tab-info')[0] as HTMLElement | undefined;
  const tabEls = document.querySelectorAll('.tab-ripplebutton');
  const tabIndex = tabStore.visibleTabs.indexOf(tab);
  const currentTab = Array.from(tabEls)[tabIndex] as HTMLElement | undefined;
  if (!elem || !currentTab) return;

  tabMouseOn.value = {
    title: tab.title,
    desc: tab.desc,
    icon: tab.icon,
    id: tab.id,
    content: tab.content,
    component: { __name: (tab.component as Component & { __name?: string })?.__name || '' }
  };
  const rect = currentTab.getBoundingClientRect();
  elem.style.left = rect.left + 'px';
};

const onTabScroll = (event: WheelEvent): void => {
  const container = document.getElementsByClassName('tabs')[0] as HTMLElement | undefined;
  if (!container) return;
  const deltaX = event.deltaY;
  container.scrollLeft += deltaX;
};

const startDragging = (event: MouseEvent): void => {
  if (event.y > 33) return;
  isMouseDown.value = true;
  _isMoved.value = false;
  if (isMaximized.value) {
    return;
  }
  const window = getCurrentWindow();
  window.startDragging();
};

const stopDragging = (): void => {
  isMouseDown.value = false;
};

function getTabStyle(tab: TabItem): Record<string, string> {
  const isTabDragging = tabStore.draggingTabId === tab.id && isDragging.value;

  return {
    transform: isTabDragging ? `translateX(${tabStore.dragOffsetX}px)` : '',
    zIndex: isTabDragging ? '200' : (tab.isClosing ? '-1' : 'auto'),
    transition: isTabDragging ? 'none' : 'all 0.3s ease',
    pointerEvents: tab.isClosing ? 'none' : 'auto',
    cursor: isTabDragging ? 'grabbing' : 'pointer'
  };
}

function startDrag(event: MouseEvent, tab: TabItem): void {
  if (tab.isClosing) return;
  if ((event.target as HTMLElement).id === 'close') return;
  isDragging.value = true;
  dragStartX.value = event.clientX;
  _dragStartY.value = event.clientY;
  tabStore.startDrag(tab.id);
  nextTick(() => {
    captureTabPositions();
  });
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', endDrag);
  event.preventDefault();
}

function captureTabPositions(): void {
  const tabEls = document.querySelectorAll('.tab-ripplebutton');
  _tabElements.value = Array.from(tabEls);
  tabPositions.value = _tabElements.value.map(el => {
    const rect = el.getBoundingClientRect();
    const tabId = el.getAttribute('data-tab-id');
    return {
      left: rect.left,
      right: rect.right,
      width: rect.width,
      id: tabId ? parseInt(tabId, 10) : 0
    };
  });
}

function onDrag(event: MouseEvent): void {
  if (!tabStore.draggingTabId || !isDragging.value) return;

  const deltaX = event.clientX - dragStartX.value;
  tabStore.updateDragOffset(deltaX);

  const tabId = tabStore.draggingTabId;
  const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`) as HTMLElement | null;
  if (tabElement) {
    tabElement.style.transform = `translateX(${deltaX}px)`;
  }

  const draggedTabId = tabId;
  const draggedIdStr = String(draggedTabId);
  if (draggedIdStr.startsWith('closing-')) {
    return;
  }

  const draggedTabIndex = tabStore.tabs.findIndex((t: TabItem) => t.id === draggedTabId);
  if (draggedTabIndex === -1) return;

  const currentX = event.clientX;
  for (let i = 0; i < tabStore.tabs.length; i++) {
    if (i !== draggedTabIndex) {
      const targetTabPos = tabPositions.value.find(p => p.id == tabStore.tabs[i].id);
      if (!targetTabPos) continue;

      const dragThreshold = targetTabPos.width * 0.5;

      if (
        (draggedTabIndex < i && currentX > targetTabPos.left + dragThreshold) ||
        (draggedTabIndex > i && currentX < targetTabPos.right - dragThreshold)
      ) {
        const oldX = event.clientX;
        tabStore.reorderTabs(draggedTabId as number, tabStore.tabs[i].id);
        nextTick(() => {
          captureTabPositions();
          dragStartX.value = oldX - tabStore.dragOffsetX + targetTabPos.width * (deltaX < 0 ? -1 : 1);
        });
        break;
      }
    }
  }
}

function endDrag(): void {
  if (!isDragging.value) return;
  isDragging.value = false;
  if (tabStore.draggingTabId) {
    const tabId = tabStore.draggingTabId;
    const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`) as HTMLElement | null;
    if (tabElement) {
      tabElement.style.transform = '';
    }
  }
  nextTick(() => {
    tabStore.endDrag();
  });
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', endDrag);
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', endDrag);
});

function setItemPosition(el: HTMLElement): void {
  const rect = el.getBoundingClientRect();
  itemPositions.value.set(el, rect);
}

function handleLeave(el: HTMLElement, done: () => void): void {
  const rect = el.getBoundingClientRect();
  const prevPos = itemPositions.value.get(el);
  if (prevPos) {
    const dx = prevPos.left - rect.left;

    el.style.transform = `translate(${dx}px, 0px)`;
    el.style.opacity = '0';
    el.style.height = '0';
    el.style.width = '0';
    el.style.margin = '0';
    el.style.padding = '0';

    requestAnimationFrame(() => {
      el.style.transition = 'all 300ms ease';
      el.style.transform = 'translate(0, 0)';

      setTimeout(done, 300);
    });
  } else {
    done();
  }
}

const handleDelete = (tab: TabItem): void => {
  emit('onTabDelete', tab.key);
  tabStore.removeTab(tab.id);
};

const handleClick = (tab: TabItem): void => {
  if (String(tab.id).startsWith('closing-')) {
    return;
  }
  tabStore.switchTab(tab.key);
  emit('onSwitchTabs', tab.id);
};

// Backward compatibility methods (exposed for parent components)
const addTab = (
  key: string | number,
  icon: string,
  title: string,
  component: Component,
  props: Record<string, unknown>,
  icon_invert = false,
  show = true,
  desc = "",
  content = ""
): void => {
  tabStore.addTab({
    key: String(key),
    icon,
    title,
    component,
    props,
    icon_invert,
    show,
    desc: desc || title,
    content
  });
};

const getTab = (id: number): TabItem | undefined => {
  return tabStore.getTab(id);
};

const setTab = (id: number, tab: Partial<TabItem>): void => {
  tabStore.setTab(id, tab);
};

const setTitle = (key: string | number, title: string): void => {
  tabStore.updateTabMeta(key, { title });
};

const setIcon = (key: string | number, icon: string): void => {
  tabStore.updateTabMeta(key, { icon });
};

const getIconPath = (icon: string): string => {
  if (!icon) return '';
  if (icon.startsWith('http') || icon.startsWith('data:')) {
    return icon;
  }
  if (icon.startsWith('/')) {
    return icon;
  }
  try {
    return new URL(`${icon}`, import.meta.url).href;
  } catch (e) {
    console.error('Failed to load icon:', icon);
    return '/assets/vue.svg';
  }
};

const findIdByKey = (searchKey: string | number): number => {
  const tab = tabStore.tabs.find((t: TabItem) => t.key == searchKey);
  return tab ? (tab.id as number) : -1;
};

defineExpose({
  addTab,
  getTab,
  setTitle,
  setIcon,
  tabs: tabStore.tabs,
  handleClick,
  handleDelete,
  findIdByKey,
  setTab
});
</script>

<style scoped>
.tab-list-move {
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.tab-list-enter-active,
.tab-list-leave-active {
  transition: all 0.3s ease;
}

.tab-list-enter-from,
.tab-list-leave-to {
  opacity: 0;
  width: 0;
  transform: translateX(-30px);
}

#close {
  position: absolute;
  right: 10px;
}

#close:hover {
  opacity: 0.5;
}

.icon {
  width: 16px;
  height: 16px;
  border-radius: 16px;
}


.tabs {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.tabs:hover {
  overflow-x: scroll;
}

.tab-ripplebutton:hover {
  background-color: rgba(var(--text-color), 0.1);
}

.tab-ripplebutton {
  text-align: left;
  background-color: transparent;
  border: none;
  box-shadow: none;
  padding: 5px 10px;
  font-size: 13px;
  font-weight: normal;
  height: 35px;
  width: 180px;
  margin-right: 5px;
  min-width: 100px;
  transition: all 0.3s ease;
  touch-action: none;
  position: relative;
}

.tab-ripplebutton.closing {
  opacity: 0;
  width: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
  transform: translateX(-30px);
  pointer-events: none;
  position: absolute;
}

.tab-ripplebutton.dragging {
  opacity: 0.9;
  background-color: rgba(var(--text-color), 0.2);
  user-select: none;
  pointer-events: none;
  transition: none !important;
  will-change: transform;
}

.tab-content {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}

.title {
  left: 35px;
  width: calc(100% - 60px);
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  -webkit-mask-image: linear-gradient(to right, black, black, black, black, transparent);
  mask-image: linear-gradient(to right, black, black, black, black, transparent);
}


.ripple-button-title {
  font-size: 13px;
  margin-top: 5px;
}

.tab-ripplebutton.selected {
  background-color: rgba(var(--text-color), 0.1);
  box-shadow: none;
  font-weight: bold;
}

.tab-ripplebutton.invert .icon {
  filter: invert(var(--invert));
}

.tab-ripplebutton.show {
  display: none;
}

#RippleButton {
  background-color: transparent;
  box-shadow: none;
  padding: 10px 5px;
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 100,
    'GRAD' 0,
    'opsz' 24
}
</style>

<style scoped>
.tab-list-move {
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.tab-list-enter-active,
.tab-list-leave-active {
  transition: all 0.3s ease;
}

.tab-list-enter-from,
.tab-list-leave-to {
  opacity: 0;
  width: 0;
  transform: translateX(-30px);
}

#close {
  position: absolute;
  right: 10px;
}

#close:hover {
  opacity: 0.5;
}

.icon {
  width: 16px;
  height: 16px;
  border-radius: 16px;
}


.tabs {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.tabs:hover {
  overflow-x: scroll;
}

.tab-ripplebutton:hover {
  background-color: rgba(var(--text-color), 0.1);
}

.tab-ripplebutton {
  text-align: left;
  background-color: transparent;
  border: none;
  box-shadow: none;
  padding: 5px 10px;
  font-size: 13px;
  font-weight: normal;
  height: 35px;
  width: 180px;
  margin-right: 5px;
  min-width: 100px;
  /* max-width: 200px;
  min-width: 100px; */
  transition: all 0.3s ease;
  touch-action: none;
  position: relative;
}

.tab-ripplebutton.closing {
  opacity: 0;
  width: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
  transform: translateX(-30px);
  pointer-events: none;
  position: absolute;
}

.tab-ripplebutton.dragging {
  opacity: 0.9;
  background-color: rgba(var(--text-color), 0.2);
  user-select: none;
  pointer-events: none;
  transition: none !important;
  will-change: transform;
}

.tab-content {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}

.title {
  left: 35px;
  width: calc(100% - 60px);
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  -webkit-mask-image: linear-gradient(to right, black, black, black, black, transparent);
  mask-image: linear-gradient(to right, black, black, black, black, transparent);
}


.ripple-button-title {
  font-size: 13px;
  margin-top: 5px;
}

.tab-ripplebutton.selected {
  background-color: rgba(var(--text-color), 0.1);
  box-shadow: none;
  font-weight: bold;
}

.tab-ripplebutton.invert .icon {
  filter: invert(var(--invert));
}

.tab-ripplebutton.show {
  display: none;
}

#RippleButton {
  background-color: transparent;
  box-shadow: none;
  padding: 10px 5px;
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 100,
    'GRAD' 0,
    'opsz' 24
}
</style>