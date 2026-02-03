<template>
  <RippleButton id="RippleButton" @click="emit('click')">
    <div style="font-variation-settings: 'FILL' 0, 'wght' 100;">
      <span class="material-symbols-outlined">{{ icon }}</span>
    </div>
    <div class="ripple-button-title">{{ title }}</div>
  </RippleButton>

</template>
<script setup lang="ts">

import RippleButton from '#components/common/RippleButton.vue';
const emit = defineEmits(['click']);

defineProps({
  icon: {
    type: String,
    required: true,
    default: 'home'
  },
  title: {
    type: String,
    required: false,
    default: ''
  },
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