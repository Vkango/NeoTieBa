<template>
    <div id="tip">
        <div id="content">{{ Tip }}</div>
    </div>
</template>
<script setup lang="ts">
defineProps({
    Tip: {
        required: true
    }
})
</script>
<style scoped>
#tip {
    height: fit-content;
    width: 100%;
    display: flex;
    align-items: center;
}

#loading {
    display: inline-block;
}

#content {
    display: inline-block;
    height: fit-content;
    word-break: break-all;
    text-align: left;
}
</style>