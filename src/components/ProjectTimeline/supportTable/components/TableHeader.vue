<template>
    <div class="thead">
        <div class="c1">{{ vm.stage }}</div>
        <div class="c2">{{ vm.situation }}</div>
        <div class="c3">{{ vm.end }}</div>
        <div class="c4">{{ vm.progress }}</div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    vm: { stage: string; situation: string; end: string; progress: string };
}>();
</script>

<style scoped>
.thead {
    display: grid;
    grid-template-columns: 1.6fr 1.1fr 0.9fr 0.9fr;
    gap: 10px;
    padding: 12px 14px;
    background: #ffffff;
    border-bottom: 1px solid #eef2f8;
    color: #9aa6b6;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.c4 {
    text-align: right;
}
</style>
