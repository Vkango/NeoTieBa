<template>
    <Transition name="fade">
        <div v-if="props.visible" class="image-viewer-overlay" @click.self="handleClose"
            @contextmenu="handleContextMenu" tabindex="0" @keydown="handleKeydown" ref="overlayRef">
            <!-- Main Image Container -->
            <div class="image-wrapper" :style="wrapperStyle" @mousedown="handleMouseDown" @wheel.prevent="handleWheel"
                @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
                <img ref="imageRef" :src="props.imageSrc" class="viewer-image" alt="Preview" draggable="false"
                    referrerpolicy="no-referrer" @load="onImageLoad" />
            </div>

            <!-- Controls Bar -->
            <div class="controls-bar" @click.stop>
                <div class="zoom-info" :title="`DPI: ${dpiScale.toFixed(2)}x`" @click="handleZoomMenu">
                    {{ Math.round(scale * 100) }}%
                </div>

                <div class="divider"></div>

                <button class="control-btn" @click="zoomOut" title="缩小">
                    <span class="material-symbols-outlined">remove</span>
                </button>

                <input type="range" v-model.number="zoomSliderValue" min="10" max="1000" class="zoom-slider"
                    @input="handleSliderChange" />

                <button class="control-btn" @click="zoomIn" title="放大">
                    <span class="material-symbols-outlined">add</span>
                </button>

                <div class="divider"></div>

                <button class="control-btn" @click="rotateLeft" title="向左旋转">
                    <span class="material-symbols-outlined">rotate_left</span>
                </button>
                <button class="control-btn" @click="rotateRight" title="向右旋转">
                    <span class="material-symbols-outlined">rotate_right</span>
                </button>

                <div class="divider"></div>

                <button class="control-btn" @click="resetView" title="重置">
                    <span class="material-symbols-outlined">restart_alt</span>
                </button>

                <div class="divider"></div>

                <button class="control-btn close-btn" @click="handleClose" title="关闭">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <!-- Context Menu -->
            <div v-if="contextMenu.visible" class="context-menu"
                :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }" @click.stop>
                <div class="menu-item" @click="resetView">
                    <span class="material-symbols-outlined">restart_alt</span>
                    <span>重置视图</span>
                </div>
            </div>

            <!-- Zoom Preset Menu -->
            <div v-if="zoomMenu.visible" class="zoom-preset-menu" :style="{ bottom: '85px', left: zoomMenu.x + 'px' }"
                @click.stop>
                <div v-for="preset in [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 4, 8]" :key="preset" class="preset-item"
                    @click="setZoom(preset)" :class="{ active: Math.abs(scale - preset) < 0.01 }">
                    {{ Math.round(preset * 100) }}%
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps<{
    imageSrc: string;
    visible?: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();


// State
const scale = ref(1);
const rotation = ref(0);
const translateX = ref(0);
const translateY = ref(0);
const isDragging = ref(false);
const dpiScale = ref(1);

// Interaction State
const lastMouseX = ref(0);
const lastMouseY = ref(0);
const overlayRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);

// Context Menu State
const contextMenu = ref({
    visible: false,
    x: 0,
    y: 0
});

// Zoom Menu State
const zoomMenu = ref({
    visible: false,
    x: 0
});

// Computed
const wrapperStyle = computed(() => ({
    transform: `translate(${translateX.value}px, ${translateY.value}px) rotate(${rotation.value}deg) scale(${scale.value})`,
    transition: isDragging.value ? 'none' : 'transform 0.15s ease-out'
}));

const zoomSliderValue = computed({
    get: () => Math.round(scale.value * 100),
    set: (val) => {
        scale.value = val / 100;
    }
});

function clampTranslation() {
    if (!imageRef.value) return;

    const img = imageRef.value;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    const isRotated = (rotation.value / 90) % 2 !== 0;

    // Calculate the actual visual size of the image on screen
    const visualW = img.clientWidth * scale.value;
    const visualH = img.clientHeight * scale.value;

    const currentW = isRotated ? visualH : visualW;
    const currentH = isRotated ? visualW : visualH;

    const maxDx = Math.max(0, (currentW - containerWidth) / 2);
    const maxDy = Math.max(0, (currentH - containerHeight) / 2);

    translateX.value = Math.max(-maxDx, Math.min(maxDx, translateX.value));
    translateY.value = Math.max(-maxDy, Math.min(maxDy, translateY.value));
}

// Lifecycle
onMounted(() => {
    dpiScale.value = window.devicePixelRatio || 1;
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

watch(() => props.visible, (newVal) => {
    if (newVal) {
        resetView();
        contextMenu.value.visible = false;
        zoomMenu.value.visible = false;
        nextTick(() => {
            overlayRef.value?.focus();
        });
    }
});


watch([scale, rotation], () => {
    nextTick(() => clampTranslation());
});

// Event Handlers
function handleClose() {
    emit('close');
}

function onImageLoad() {
    resetView();
}

function handleResize() {
    dpiScale.value = window.devicePixelRatio || 1;
    clampTranslation();
}

function handleKeydown(e: KeyboardEvent) {
    if (!props.visible) return;

    if (e.key === 'Escape') handleClose();
    if (e.key === 'ArrowLeft') translateX.value -= 50;
    if (e.key === 'ArrowRight') translateX.value += 50;
    if (e.key === 'ArrowUp') translateY.value -= 50;
    if (e.key === 'ArrowDown') translateY.value += 50;
    if (e.key === '+' || e.key === '=') zoomIn();
    if (e.key === '-') zoomOut();
    clampTranslation();
}

// Mouse Interaction
function handleMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;
    e.preventDefault();
    isDragging.value = true;
    lastMouseX.value = e.clientX;
    lastMouseY.value = e.clientY;
    contextMenu.value.visible = false;
    zoomMenu.value.visible = false;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(e: MouseEvent) {
    if (!isDragging.value) return;
    e.preventDefault();

    const deltaX = e.clientX - lastMouseX.value;
    const deltaY = e.clientY - lastMouseY.value;

    const rad = -rotation.value * (Math.PI / 180);
    const dx = deltaX * Math.cos(rad) - deltaY * Math.sin(rad);
    const dy = deltaX * Math.sin(rad) + deltaY * Math.cos(rad);

    translateX.value += dx;
    translateY.value += dy;

    clampTranslation();

    lastMouseX.value = e.clientX;
    lastMouseY.value = e.clientY;
}

function handleMouseUp() {
    isDragging.value = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
}

function handleWheel(e: WheelEvent) {
    contextMenu.value.visible = false;
    zoomMenu.value.visible = false;

    let zoomFactor = 0;
    if (e.ctrlKey) {
        // Pinch gesture or Ctrl+Wheel
        zoomFactor = -e.deltaY * 0.01;
    } else {
        zoomFactor = -e.deltaY * 0.001;
    }

    const newScale = Math.max(0.1, Math.min(10, scale.value + scale.value * zoomFactor));
    scale.value = newScale;
}

// Touch Interaction
interface TouchState {
    distance: number;
    lastCenter: { x: number, y: number };
}
let lastTouchState: TouchState | null = null;

function handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
        isDragging.value = true;
        lastMouseX.value = e.touches[0].clientX;
        lastMouseY.value = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        isDragging.value = false;
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const centerX = (t1.clientX + t2.clientX) / 2;
        const centerY = (t1.clientY + t2.clientY) / 2;
        lastTouchState = { distance, lastCenter: { x: centerX, y: centerY } };
    }
}

function handleTouchMove(e: TouchEvent) {
    if (e.touches.length === 1 && isDragging.value) {
        const t = e.touches[0];
        const deltaX = t.clientX - lastMouseX.value;
        const deltaY = t.clientY - lastMouseY.value;

        const rad = -rotation.value * (Math.PI / 180);
        const dx = deltaX * Math.cos(rad) - deltaY * Math.sin(rad);
        const dy = deltaX * Math.sin(rad) + deltaY * Math.cos(rad);

        translateX.value += dx;
        translateY.value += dy;
        clampTranslation();

        lastMouseX.value = t.clientX;
        lastMouseY.value = t.clientY;
    } else if (e.touches.length === 2 && lastTouchState) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const centerX = (t1.clientX + t2.clientX) / 2;
        const centerY = (t1.clientY + t2.clientY) / 2;

        const ratio = distance / lastTouchState.distance;
        scale.value = Math.max(0.1, Math.min(10, scale.value * ratio));

        const deltaX = centerX - lastTouchState.lastCenter.x;
        const deltaY = centerY - lastTouchState.lastCenter.y;

        const rad = -rotation.value * (Math.PI / 180);
        const dx = deltaX * Math.cos(rad) - deltaY * Math.sin(rad);
        const dy = deltaX * Math.sin(rad) + deltaY * Math.cos(rad);

        translateX.value += dx;
        translateY.value += dy;
        clampTranslation();

        lastTouchState = { distance, lastCenter: { x: centerX, y: centerY } };
    }
}

function handleTouchEnd() {
    isDragging.value = false;
    lastTouchState = null;
}

// Controls
function zoomIn() {
    scale.value = Math.min(10, scale.value * 1.2);
}
function zoomOut() {
    scale.value = Math.max(0.1, scale.value * 0.8);
}
function handleSliderChange() {
    // handled by v-model
}
function rotateLeft() {
    rotation.value -= 90;
}
function rotateRight() {
    rotation.value += 90;
}
function resetView() {
    scale.value = 1;
    rotation.value = 0;
    translateX.value = 0;
    translateY.value = 0;
    nextTick(() => clampTranslation());
}

// Context Menu
function handleContextMenu(e: MouseEvent) {
    if ((e.target as HTMLElement | null)?.closest('.viewer-image')) {
        contextMenu.value.visible = false;
        zoomMenu.value.visible = false;
        return;
    }

    e.preventDefault();

    const menuWidth = 220;
    const menuHeight = 180;
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) x -= menuWidth;
    if (y + menuHeight > window.innerHeight) y -= menuHeight;

    zoomMenu.value.visible = false;
    contextMenu.value = {
        visible: true,
        x,
        y
    };
}

// Zoom Preset Menu
function handleZoomMenu(e: MouseEvent) {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    zoomMenu.value = {
        visible: !zoomMenu.value.visible,
        x: rect.left + rect.width / 2 - 50 // Center roughly
    };
    contextMenu.value.visible = false;
}

function setZoom(preset: number) {
    scale.value = preset;
    zoomMenu.value.visible = false;
}


</script>

<style scoped>
.image-viewer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.94);
    backdrop-filter: blur(5px);
    z-index: 20000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    user-select: none;
    outline: none;
}

.image-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: transform;
    cursor: grab;
}

.image-wrapper:active {
    cursor: grabbing;
}

.viewer-image {
    max-width: 85%;
    max-height: 85%;
    object-fit: contain;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.7);
    pointer-events: auto;
}

.controls-bar {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(35, 35, 35, 0.9);
    backdrop-filter: blur(15px);
    padding: 12px 24px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    z-index: 20001;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.12);
}

.control-btn {
    background: transparent;
    border: none;
    color: #eee;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.control-btn:hover {
    background-color: rgba(255, 255, 255, 0.18);
    color: #fff;
    transform: scale(1.15);
}

.control-btn:active {
    transform: scale(0.9);
}

.control-btn.close-btn:hover {
    background-color: rgba(255, 60, 60, 0.45);
}

.material-symbols-outlined {
    font-size: 24px;
}

.zoom-info {
    font-size: 14px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    min-width: 52px;
    text-align: center;
    opacity: 0.95;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.zoom-info:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.zoom-slider {
    width: 130px;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
}

.zoom-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.divider {
    width: 1px;
    height: 24px;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 0 8px;
}

.context-menu {
    position: fixed;
    background: #1e1e1e;
    border-radius: 12px;
    padding: 8px;
    min-width: 220px;
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.7);
    z-index: 20002;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    animation: menu-pop 0.15s cubic-bezier(0, 0, 0.2, 1);
}

@keyframes menu-pop {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.context-menu .menu-item {
    padding: 10px 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 14px;
    border-radius: 8px;
    transition: background 0.2s;
}

.context-menu .menu-item:hover {
    background-color: rgba(255, 255, 255, 0.12);
}

.context-menu .menu-item .material-symbols-outlined {
    font-size: 20px;
    color: #ccc;
}

.menu-divider {
    height: 1px;
    background-color: rgba(255, 255, 255, 0.1);
    margin: 6px 8px;
}

.zoom-preset-menu {
    position: fixed;
    background: #1e1e1e;
    border-radius: 12px;
    padding: 6px;
    min-width: 100px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    z-index: 20002;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.zoom-preset-menu .preset-item {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
    border-radius: 6px;
    text-align: center;
    transition: background 0.2s;
}

.zoom-preset-menu .preset-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.zoom-preset-menu .preset-item.active {
    background-color: #3b82f6;
    color: white;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
