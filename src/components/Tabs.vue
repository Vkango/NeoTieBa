<template>
  <transition-group name="tab-list" tag="div" class="tabs" @before-leave="setItemPosition" @leave="handleLeave"
    @mousedown="startDragging" @mouseup="stopDragging" @mouseleave="stopDragging">
    <RippleButton class="tab-ripplebutton" v-for="tab in visibleTabs" :class="{
      'selected': tab.selected,
      'invert': tab.icon_invert,
      'show': !tab.show,
      'dragging': draggingTab && draggingTab.id === tab.id,
      'closing': tab.isClosing
    }" :key="tab.key" :data-tab-id="tab.id" @click="handleClick(tab.id)" @mousedown.stop="startDrag($event, tab)"
      :style="getTabStyle(tab)">
      <div class="tab-content">
        <img class="icon" :src="getIconPath(tab.icon)" referrerpolicy="no-referrer" />
        <div class="title">{{ tab.title }}</div>
        <span class="material-symbols-outlined" id="close" style="font-size: 12px;" @click.stop
          @click="handleDelete(tab.id)">close</span>
      </div>
    </RippleButton>
  </transition-group>
</template>

<script setup>
import { defineEmits, markRaw, ref, onBeforeUnmount, computed, nextTick } from 'vue';
import RippleButton from './RippleButton.vue';
import { getCurrentWindow } from '@tauri-apps/api/window';
const isMaximized = ref(false);
const isMouseDown = ref(false);
const isMoved = ref(false);

const startDragging = (event) => {
  isMouseDown.value = true;
  isMoved.value = false;
  if (isMaximized.value) {
    return;
  }
  const window = getCurrentWindow();
  window.startDragging();

};
const stopDragging = () => {

  isMouseDown.value = false;
};
const tabs = ref([]);
const emit = defineEmits(['click', 'onSwitchTabs', 'onTabDelete']);

const closingTabs = ref([]);
const itemPositions = ref(new Map());

const visibleTabs = computed(() => {
  return [...tabs.value, ...closingTabs.value].sort((a, b) => a.position - b.position);
});

const draggingTab = ref(null);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragOffsetX = ref(0);
const tabElements = ref([]);
const tabPositions = ref([]);
const isDragging = ref(false);

function getTabStyle(tab) {
  const isTabDragging = draggingTab.value && draggingTab.value.id === tab.id && isDragging.value;

  return {
    transform: isTabDragging ? `translateX(${dragOffsetX.value}px)` : '',
    zIndex: isTabDragging ? '200' : (tab.isClosing ? '-1' : 'auto'),
    transition: isTabDragging ? 'none' : 'all 0.3s ease',
    pointerEvents: tab.isClosing ? 'none' : 'auto',
    cursor: isTabDragging ? 'grabbing' : 'pointer'
  };
}

function startDrag(event, tab) {
  if (tab.isClosing) return;
  if (event.target.id === 'close') return;
  isDragging.value = true;
  dragStartX.value = event.clientX;
  dragStartY.value = event.clientY;
  draggingTab.value = tab;
  nextTick(() => {
    captureTabPositions();
  });
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', endDrag);
  event.preventDefault();
}

function captureTabPositions() {
  const tabEls = document.querySelectorAll('.tab-ripplebutton');
  tabElements.value = Array.from(tabEls);
  tabPositions.value = tabElements.value.map(el => {
    const rect = el.getBoundingClientRect();
    const tabId = el.getAttribute('data-tab-id');
    return {
      left: rect.left,
      right: rect.right,
      width: rect.width,
      id: tabId
    };
  });
}

function onDrag(event) {
  if (!draggingTab.value || !isDragging.value) return;
  const deltaX = event.clientX - dragStartX.value;
  dragOffsetX.value = deltaX;
  const tabId = draggingTab.value.id;
  const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
  if (tabElement) {
    tabElement.style.transform = `translateX(${deltaX}px)`;
  }
  const draggedTabId = draggingTab.value.id;
  if (typeof draggedTabId === 'string' && draggedTabId.startsWith('closing-')) {
    return;
  }

  const draggedTabIndex = tabs.value.findIndex(t => t.id === draggedTabId);
  if (draggedTabIndex === -1) return;

  const currentX = event.clientX;
  for (let i = 0; i < tabs.value.length; i++) {
    if (i !== draggedTabIndex) {
      const targetTabPos = tabPositions.value.find(p => p.id == tabs.value[i].id);
      if (!targetTabPos) continue;

      const dragThreshold = targetTabPos.width * 0.5;

      if (
        (draggedTabIndex < i && currentX > targetTabPos.left + dragThreshold) ||
        (draggedTabIndex > i && currentX < targetTabPos.right - dragThreshold)
      ) {
        const oldX = event.clientX;
        reorderTabs(draggedTabId, tabs.value[i].id);
        nextTick(() => {
          captureTabPositions();
          dragStartX.value = oldX - dragOffsetX.value + targetTabPos.width * (deltaX < 0 ? -1 : 1);
        });
        break;
      }
    }
  }
}

function reorderTabs(fromId, toId) {
  const fromIndex = tabs.value.findIndex(tab => tab.id === fromId);
  const toIndex = tabs.value.findIndex(tab => tab.id === toId);

  if (fromIndex < 0 || toIndex < 0) return;

  const currentOffset = dragOffsetX.value;

  const newTabs = [...tabs.value];
  const [movedTab] = newTabs.splice(fromIndex, 1);
  newTabs.splice(toIndex, 0, movedTab);

  const draggedKey = draggingTab.value ? draggingTab.value.key : null;
  newTabs.forEach((tab, index) => {
    tab.id = index;
    tab.position = index;
    if (draggedKey && tab.key === draggedKey) {
      draggingTab.value = tab;
    }
  });

  tabs.value = newTabs;
  dragOffsetX.value = currentOffset;
}

function endDrag() {
  if (!isDragging.value) return;
  isDragging.value = false;
  if (draggingTab.value) {
    const tabId = draggingTab.value.id;
    const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
    if (tabElement) {
      tabElement.style.transform = '';
    }
  }
  nextTick(() => {
    draggingTab.value = null;
    dragOffsetX.value = 0;
  });
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', endDrag);
}


onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', endDrag);
});

function setItemPosition(el) {
  const rect = el.getBoundingClientRect();
  itemPositions.value.set(el, rect);
}

function handleLeave(el, done) {
  const rect = el.getBoundingClientRect();
  const prevPos = itemPositions.value.get(el);
  if (prevPos) {
    const dx = prevPos.left - rect.left;
    const dy = prevPos.top - rect.top;

    el.style.transform = `translate(${dx}px, ${dy}px)`;
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

const handleDelete = (id) => {
  const tabToClose = tabs.value.find(tab => tab.id === id);
  if (!tabToClose) return;
  emit('onTabDelete', tabToClose.key);
  const wasSelected = tabToClose.selected;
  const position = tabToClose.position || id;

  const closingTab = {
    ...tabToClose,
    isClosing: true,
    position: position,
    id: `closing-${tabToClose.id}-${Date.now()}`
  };

  closingTabs.value.push(closingTab);

  tabs.value = tabs.value.filter(tab => tab.id !== id);

  tabs.value.forEach((tab, index) => {
    tab.id = index;
    tab.position = index;
  });


  if (wasSelected && tabs.value.length > 0) {
    let newSelectedId = id < tabs.value.length ? id : tabs.value.length - 1;
    tabs.value[newSelectedId].selected = true;
    emit('onSwitchTabs', newSelectedId);
  }

  setTimeout(() => {
    closingTabs.value = closingTabs.value.filter(tab => tab.key !== closingTab.key);
  }, 300);
}

const handleClick = (id) => {
  if (typeof id === 'string' && id.startsWith('closing-')) {
    return;
  }
  const tab = tabs.value.find(tab => tab.id === id);
  if (!tab) return;

  tabs.value.forEach((item) => {
    item.selected = item.id === id;
  });
  emit('onSwitchTabs', id);
};

const addTab = (key, icon, title, component, props, icon_invert = false, show = true) => {
  let found = false;
  tabs.value.forEach(element => {
    if (element.key == key) {
      element.selected = true;
      emit('onSwitchTabs', element.id);
      found = true
      return;
    }
    element.selected = false;
  });
  if (found) { return; }
  tabs.value.push({ id: tabs.value.length, key: String(key), selected: true, icon: icon, title: title, component: markRaw(component), props: props, icon_invert: icon_invert, show: show, position: tabs.value.length });
  emit('onSwitchTabs', tabs.value.length - 1);
};

const getTab = (id) => {
  return tabs.value[id];
};

const setTitle = (key, title) => {
  tabs.value.forEach((item) => {
    if (item.key == key) {
      item.title = title;
    }
  });
};

const setIcon = (key, icon) => {
  tabs.value.forEach((item) => {
    if (item.key == key) {
      item.icon = icon;
    }
  });
};

const getIconPath = (icon) => {
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
defineExpose({
  addTab,
  getTab,
  setTitle,
  setIcon,
  tabs,
  handleClick,
  handleDelete
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
  gap: 5px;
  padding: 5px 0px;
  position: relative;
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