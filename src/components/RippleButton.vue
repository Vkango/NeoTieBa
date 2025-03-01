<template>
    <button
      class="ripple-button"
      @mousedown="startRipple"
      @mouseup="endRipple"
      @mouseleave="endRipple"
    >
      <span class="ripple-content">
        <slot></slot>
      </span>
      <span
        v-for="(ripple, index) in ripples"
        :key="index"
        class="ripple"
        :style="{
          left: `${ripple.x}px`,
          top: `${ripple.y}px`,
          width: `${ripple.size}px`,
          height: `${ripple.size}px`,
          opacity: ripple.opacity,
          transform: ripple.scale ? 'scale(1)' : 'scale(0)'
        }"
      ></span>
    </button>
</template>

<script>
import { ref } from 'vue';

export default {
setup() {
    const ripples = ref([]);

    const startRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left; // 涟漪的 X 坐标
    const y = event.clientY - rect.top; // 涟漪的 Y 坐标

    const size = Math.max(rect.width, rect.height) * 2; // 涟漪的最大尺寸
    const newRipple = {
        x: x - size / 2, // 涟漪的左上角 X 坐标
        y: y - size / 2, // 涟漪的左上角 Y 坐标
        size, // 涟漪的宽度和高度
        opacity: 0.3, // 涟漪的初始透明度
        scale: false // 是否开始扩散
    };

    ripples.value.push(newRipple);

    // 开始涟漪动画
    setTimeout(() => {
        ripples.value[ripples.value.length - 1].scale = true;
    }, 10);

    // 动画结束后移除涟漪
    setTimeout(() => {
        ripples.value.shift();
    }, 1000);
    };

    const endRipple = () => {
    ripples.value = ripples.value.map((ripple) => ({
        ...ripple,
        opacity: 0
    }));
    };

    return {
    ripples,
    startRipple,
    endRipple
    };
}
};
</script>

<style scoped>
.ripple-button {
    position: relative;
    overflow: hidden;
    color: rgba(var(--text-color));
    border: none;
    border-radius: 4px;
    outline: none;
    transition: background-color 0.3s ease box-shadow 0.3s ease;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.ripple-button:hover {
    background-color: rgba(var(--background-color), 0.5);
}

.ripple-button:active {
    background-color: rgba(var(--background-color), 0.3);
}



.ripple {
    position: absolute;
    background-color: rgba(var(--text-color), 0.3);
    border-radius: 50%;
    pointer-events: none;
    transition: transform 0.5s ease, opacity 0.5s ease;
}
</style>