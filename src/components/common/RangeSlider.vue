<template>
    <div class="range-slider" :class="{ 'is-dragging': isDragging }">
        <div class="range-track" aria-hidden="true">
            <div class="range-fill" :style="{ width: `${progress}%` }"></div>
            <div class="range-thumb" :style="{ left: `calc(${progress}% + ${(0.5 - progress / 100) * 11}px)` }"></div>
        </div>
        <input ref="rangeRef" class="range-input" type="range" :min="min" :max="max" :step="step" :value="modelValue"
            :aria-label="ariaLabel" :aria-valuenow="modelValue" :aria-valuemin="min" :aria-valuemax="max"
            :aria-valuetext="ariaValueText" @input="handleInput"
            @change="emit('change', normalizedValue($event.target.value))" @keydown="handleKeydown"
            @pointerdown="isDragging = true" @pointerup="isDragging = false" @pointercancel="isDragging = false" />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
const props = defineProps({
    modelValue: {
        type: Number,
        default: 0
    },
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 100
    },
    step: {
        type: Number,
        default: 1
    },
    ariaLabel: {
        type: String,
        default: ''
    },
    ariaValueText: {
        type: String,
        default: undefined
    }
})

const emit = defineEmits(['update:modelValue', 'input', 'change', 'keydown'])
const rangeRef = ref(null)
const isDragging = ref(false)
const progress = computed(() => {
    const span = props.max - props.min
    if (!span) return 0
    return Math.max(0, Math.min(100, (Number(props.modelValue) - props.min) / span * 100))
})

const normalizedValue = (value) => {
    const next = Number(value)
    return Number.isFinite(next) ? Math.max(props.min, Math.min(props.max, next)) : props.min
}

const handleInput = (event) => {
    const value = normalizedValue(event.target.value)
    emit('update:modelValue', value)
    emit('input', value)
}

const handleKeydown = (event) => {
    emit('keydown', event)
}

const focus = () => rangeRef.value?.focus()
defineExpose({ focus })
</script>

<style scoped>
.range-slider {
    position: relative;
    flex: 1;
    min-width: 100px;
    height: 18px;
    padding: 7px 0;
    cursor: grab;
    touch-action: none;
}

.range-slider.is-dragging {
    cursor: grabbing;
}

.range-track {
    position: relative;
    width: 100%;
    height: 4px;
    border-radius: 99px;
    background: rgba(255, 255, 255, 0.22);
}

.range-fill {
    height: 100%;
    border-radius: inherit;
    background: rgba(var(--text-color), 0.9);
}

.range-thumb {
    position: absolute;
    top: 50%;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: rgb(var(--text-color));
    box-shadow: 0 2px 7px rgba(0, 0, 0, 0.4);
    transform: translate(-50%, -50%);
}

.range-input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    outline: none;
    cursor: inherit;
}
</style>
