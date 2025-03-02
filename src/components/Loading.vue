<template>
  <div class="loading-container" :style="containerStyle">
    <div class="loading-spinner" :style="spinnerStyle"></div>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';

export default {
  name: 'LoadingBox',
  props: {
    // 圆环宽度
    ringWidth: {
      type: Number,
      default: 2,
    },
    // 圆环颜色
    ringColor: {
      type: String,
      default: '#ffffff',
    },
    // 组件宽度
    width: {
      type: Number,
      default: 100,
    },
    // 组件高度
    height: {
      type: Number,
      default: 100,
    },
  },
  setup(props) {
    // 定义容器样式
    const containerStyle = computed(() => ({
      width: `${props.width}px`,
      height: `${props.height}px`,
    }));

    // 定义加载框样式
    const spinnerStyle = computed(() => ({
      width: `${props.width - 2 * props.ringWidth}px`,
      height: `${props.height - 2 * props.ringWidth}px`,
      borderWidth: `${props.ringWidth}px`,
      borderColor: `${props.ringColor} transparent transparent transparent`,
    }));

    return {
      containerStyle,
      spinnerStyle,
    };
  },
};
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.loading-spinner {
  border: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s ease-in-out infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>