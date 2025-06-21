<template>
    <div class="tab-info">
        <div style="font-weight: bold; max-width: 250px;">{{ props.title }}</div>
        <div style="font-size: 80%; opacity: 0.5; user-select: text;">{{ props.desc }}</div>
        <slot></slot>
        <div style="display: flex; align-items: center; gap: 5px; opacity: 0.5;"><span class="material-symbols-outlined"
                style="font-size: 16px;">link</span>neotieba://{{ props.componentkey.toLowerCase() }}</div>
        <RippleButton @click="emit('refresh', props.id)"
            style="margin-top: 10px; padding: 0; background-color: transparent; box-shadow: none;">
            <div style="display: flex; align-items: center; gap: 10px"><span class="material-symbols-outlined"
                    style="font-size: 18px;">refresh</span>刷新</div>
        </RippleButton>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import RippleButton from './RippleButton.vue';
const emit = defineEmits(['refresh']);
const props = defineProps({
    icon: {
        required: true,
        default: ''
    },
    title: {
        type: String,
        required: true,
        default: ''
    },
    desc: {
        type: String,
        required: false,
        default: undefined
    },
    componentkey: {
        type: String,
        required: true,
        default: 'Container'
    },
    id: {
        required: true,
    }
})
</script>

<style scoped>
.tab-info {
    position: relative;
    top: 45px;
    left: 70px;
    box-sizing: border-box;
    padding: 10px;
    background-color: rgba(var(--background-color), 0.3);
    width: fit-content;
    border-radius: 5px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(20px);
    transition: all 0.3s ease;
}
</style>