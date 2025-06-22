<template>
  <RippleButton id="RippleButton" @click="emit('click')" style="background-color: rgba(var(--text-color), 0.05);">
    <div style="display: flex; align-items: center; gap: 15px; padding: 0 10px;">
      <div style="font-variation-settings: 'FILL' 0, 'wght' 100;">
        <span class="material-symbols-outlined">{{ icon }}</span>
      </div>
      <div style="text-align: left;">
        <div class="ripple-button-title">{{ title }}</div>
        <div class="ripple-button-title" style="font-size: 12px; color: rgba(var(--text-color), 0.5);">{{ desc }}</div>
      </div>
    </div>
  </RippleButton>

</template>
<script setup>
import { defineEmits } from 'vue';
import RippleButton from './RippleButton.vue';
const emit = defineEmits(['click']);

defineProps({
  icon: {
    type: String,
    required: true,
    default: 'home'
  },
  title: {
    type: String,
    required: true,
    default: ''
  },
  desc: {
    type: String,
    required: true,
    default: ''
  }
})

</script>
<style scoped>
.ripple-button-title {
  font-size: 13px;
  margin-top: 5px;
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