<template>
    <Transition name="fade-slide">
        <div class="image-viewer" v-show="visible" @wheel.prevent="handleWheel">
            <div class="image-container" ref="containerRef" :style="containerStyle" @mousedown.prevent="handleMouseDown"
                @mousemove.prevent="handleMouseMove" @mouseup.prevent="handleMouseUp"
                @mouseleave.prevent="handleMouseUp" @touchstart.prevent="handleTouchStart"
                @touchmove.prevent="handleTouchMove" @touchend.prevent="handleTouchEnd" @dragstart.prevent>
                <img :src="imageSrc" alt="Image" ref="imageRef" @load="handleImageLoad" referrerpolicy="no-referrer"
                    draggable="false" />
            </div>
            <div class="controls">
                <button @click="saveImage">保存图像</button>
                <button @click="$emit('close')">关闭</button>
            </div>
        </div>

    </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    imageSrc: {
        type: String,
        required: true
    },
    visible: {
        type: Boolean,
        default: false
    }
});

defineEmits(['close']);

// 状态变量
const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const startTranslateX = ref(0);
const startTranslateY = ref(0);
const containerRef = ref(null);
const imageRef = ref(null);
const initialDistance = ref(0);
const initialScale = ref(1);
const lastCenter = ref({ x: 0, y: 0 });
const lastScale = ref(1);
// 图片边界
const bounds = ref({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0
});

// 计算样式
const containerStyle = computed(() => ({
    transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
    transition: isDragging.value ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
}));

// 处理图片加载，计算初始边界
const handleImageLoad = () => {
    if (!imageRef.value || !containerRef.value) return;

    const img = imageRef.value;
    const container = containerRef.value;

    // 重置缩放和位置
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;

    // 计算边界
    updateBounds();
};

// 更新边界值
const updateBounds = () => {
    if (!imageRef.value || !containerRef.value) return;

    const img = imageRef.value;
    const container = containerRef.value;
    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const maxOffset = (scale.value - 1) * Math.max(imgRect.width, imgRect.height) / 2;

    bounds.value = {
        minX: -maxOffset,
        maxX: maxOffset,
        minY: -maxOffset,
        maxY: maxOffset
    };
};

// 确保位置在边界内
const clampPosition = () => {
    translateX.value = Math.min(Math.max(translateX.value, bounds.value.minX), bounds.value.maxX);
    translateY.value = Math.min(Math.max(translateY.value, bounds.value.minY), bounds.value.maxY);
};

// 处理滚轮缩放
const handleWheel = (event) => {
    const delta = event.deltaY;
    const factor = delta < 0 ? 1.1 : 0.9;
    const newScale = Math.min(Math.max(scale.value * factor, 0.5), 5);

    if (newScale !== scale.value) {
        zoom(newScale, {
            x: event.clientX,
            y: event.clientY
        });
    }
};

// 鼠标事件处理
const handleMouseDown = (event) => {
    isDragging.value = true;
    startX.value = event.clientX;
    startY.value = event.clientY;
    startTranslateX.value = translateX.value;
    startTranslateY.value = translateY.value;
    event.preventDefault(); // 阻止默认行为
};

const handleMouseMove = (event) => {
    if (!isDragging.value) return;

    const deltaX = event.clientX - startX.value;
    const deltaY = event.clientY - startY.value;

    translateX.value = startTranslateX.value + deltaX;
    translateY.value = startTranslateY.value + deltaY;

    clampPosition();
};

const handleMouseUp = () => {
    isDragging.value = false;
};

// 触摸事件处理
const handleTouchStart = (event) => {
    event.preventDefault(); // 阻止默认行为

    if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];

        // 计算初始距离和中心点
        initialDistance.value = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );

        lastCenter.value = {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };

        lastScale.value = scale.value;
        isDragging.value = false;
    } else {
        handleMouseDown(event.touches[0]);
    }
};

const handleTouchMove = (event) => {
    event.preventDefault(); // 阻止默认行为

    if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];

        // 计算当前两指距离和中心点
        const currentDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );

        const currentCenter = {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };

        const newScale = Math.min(
            Math.max(lastScale.value * (currentDistance / initialDistance.value), 0.5),
            5
        );

        zoom(newScale, currentCenter);
    } else if (isDragging.value) {
        handleMouseMove(event.touches[0]);
    }
};

const handleTouchEnd = () => {
    initialDistance.value = 0;
    handleMouseUp();
};
const zoom = (newScale, center) => {
    const oldScale = scale.value;
    const containerRect = containerRef.value.getBoundingClientRect();
    const containerCenter = {
        x: containerRect.left + containerRect.width / 2,
        y: containerRect.top + containerRect.height / 2
    };

    // 计算鼠标/触摸点相对于容器中心的偏移
    const deltaX = center.x - containerCenter.x;
    const deltaY = center.y - containerCenter.y;

    // 计算新的偏移量
    const scaleDiff = newScale - oldScale;
    translateX.value += (deltaX * scaleDiff) / oldScale;
    translateY.value += (deltaY * scaleDiff) / oldScale;

    scale.value = newScale;
    updateBounds();
    clampPosition();
};

// 保存图像
const saveImage = () => {
    const link = document.createElement('a');
    link.href = props.imageSrc;
    link.download = 'image.jpg';
    link.click();
};

// 生命周期钩子
onMounted(() => {
    window.addEventListener('resize', updateBounds);
});

onUnmounted(() => {
    window.addEventListener('resize', updateBounds);
});
</script>

<style scoped>
.image-viewer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    user-select: none;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 1000;
}

.image-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    will-change: transform;
    touch-action: none;
    /* 禁用浏览器默认触摸行为 */
    cursor: grab;
}

.image-container:active {
    cursor: grabbing;
}

img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    pointer-events: none;
    /* 禁用图片的鼠标事件 */
    user-drag: none;
    /* 禁用图片拖拽 */
    -webkit-user-drag: none;
}

.controls {
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 20px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    border-radius: 4px;
    backdrop-filter: blur(10px);
    transition: background-color 0.3s;
}

button:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* 进入/退出动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>