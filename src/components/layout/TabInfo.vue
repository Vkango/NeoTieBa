<template>
    <div class="tab-info">
        <div style="font-weight: bold; max-width: 250px;">{{ props.title }}</div>
        <div style="font-size: 80%; opacity: 0.5; user-select: text;">{{ props.desc }}</div>
        <slot></slot>
        <div style="display: flex; align-items: center; gap: 5px; opacity: 0.5;"><span class="material-symbols-outlined"
                style="font-size: 16px;">link</span>neotieba://{{ props.componentkey.toLowerCase() }}</div>
        <div style="display: flex; gap: 10px">
            <RippleButton @click="emit('refresh', props.id)"
                style="margin-top: 10px; padding: 0; background-color: transparent; box-shadow: none;">
                <div style="display: flex; align-items: center; gap: 10px"><span class="material-symbols-outlined"
                        style="font-size: 18px;">refresh</span>刷新</div>
            </RippleButton>
            <RippleButton @click="emit('copy_info', props.id)"
                style="margin-top: 10px; padding: 0; background-color: transparent; box-shadow: none;">
                <div style="display: flex; align-items: center; gap: 10px"><span class="material-symbols-outlined"
                        style="font-size: 18px;">content_copy</span>复制链接</div>
            </RippleButton>
        </div>

    </div>
</template>

<script setup lang="ts">

import RippleButton from '#components/common/RippleButton.vue';

const emit = defineEmits<{
    (e: 'refresh', id: string | number): void;
    (e: 'copy_info', id: string | number): void;
}>();

const props = withDefaults(defineProps<{
    icon: string;
    title: string;
    desc?: string;
    componentkey: string;
    id: string | number;
}>(), {
    icon: '',
    title: '',
    desc: undefined,
    componentkey: 'Container'
});
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