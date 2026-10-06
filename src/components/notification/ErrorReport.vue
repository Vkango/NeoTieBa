<template>
    <div class="error-report">
        <div class="error-summary">{{ summary }}</div>
        <div class="error-actions">
            <button class="error-action-button" @click.stop="copyReport">
                <span class="material-symbols-outlined" style="font-size: 14px;">content_copy</span>
                <span>{{ copied ? '已复制' : '复制详情' }}</span>
            </button>
            <button v-if="report.stack" class="error-action-button" @click.stop="showStack = !showStack">
                <span class="material-symbols-outlined" style="font-size: 14px;">stacks</span>
                <span>{{ showStack ? '收起堆栈' : '查看堆栈' }}</span>
            </button>
        </div>
        <pre v-if="showStack" class="error-stack">{{ report.stack }}</pre>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { describeReport, formatReport, type ErrorReport as ErrorReportModel } from '@/core/error-service';

const props = defineProps<{
    report: ErrorReportModel;
}>();

const copied = ref(false);
const showStack = ref(false);

const summary = computed((): string => describeReport(props.report));

const copyReport = async (): Promise<void> => {
    try {
        await writeText(formatReport(props.report));
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 2000);
    } catch (e) {
        console.error('Failed to copy error report:', e);
    }
};
</script>
<style scoped>
.error-report {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    text-align: left;
}

.error-summary {
    word-break: break-all;
    width: 100%;
}

.error-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.error-action-button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 5px;
    border: 1px solid rgba(var(--text-color), 0.2);
    background: rgba(var(--text-color), 0.06);
    color: rgb(var(--text-color));
    cursor: pointer;
}

.error-action-button:hover {
    background: rgba(var(--text-color), 0.12);
}

.error-stack {
    max-height: 180px;
    overflow: auto;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: 6px 8px;
    border-radius: 5px;
    background: rgba(var(--text-color), 0.06);
    font-size: 11px;
    line-height: 1.4;
    white-space: pre-wrap;
    word-break: break-all;
}
</style>
