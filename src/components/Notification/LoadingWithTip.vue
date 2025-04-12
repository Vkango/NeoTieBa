<template>
    <div id="loading-with-tip">
        <img src="/assets/loading.svg" width="16" height="16"></img>
        <div id="content">{{ Tip }}</div>
    </div>
</template>
<script setup>
defineProps({
    Tip: {
        type: String,
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
    /* position: absolute; */
    left: 32px;
    display: inline-block;
    margin: auto;
    height: fit-content;
    margin-left: 10px;
    word-break: break-all;
}
</style>