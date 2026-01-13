<template>
    <div class="title">{{ title }}</div>
</template>
<script setup lang="ts">defineProps<{ title: string }>();</script>
<style scoped>
.title {
    font-size: 14px;
    font-weight: 900;
    color: #0e1730;
    margin-bottom: 10px;
}
</style>
