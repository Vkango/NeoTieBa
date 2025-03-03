<template>
    <div class="loading">
    <img src="../assets/loading.svg">
    <span>Loading...</span>
    </div>
</template>
<style scoped>
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 8px 15px;
    background-color: rgba(0, 0, 0, 0.5);
    width: fit-content;
    border-radius: 50px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>