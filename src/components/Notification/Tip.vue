<template>
    <div id="loading-with-tip">
        <div id="content">{{ Tip }}</div>
    </div>
</template>
<script setup>
defineProps({
    Tip: {
        required: true
    }
})
</script>
<style scoped>
#loading-with-tip {
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