<!-- src/components/ui/ChartCard.vue -->
<template>
    <section class="cc-root">
        <header class="cc-head">
            <div>
                <h3 class="cc-title">{{ title }}</h3>
                <p v-if="subtitle" class="cc-subtitle">{{ subtitle }}</p>
            </div>

            <slot name="actions" />
        </header>

        <div class="cc-body">
            <slot />
        </div>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    subtitle?: string;
}>();
</script>

<style scoped>
.cc-root {
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.08);
    border-radius: 16px;
    padding: 16px;
}

.cc-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
}

.cc-title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
}

.cc-subtitle {
    margin: 2px 0 0;
    font-size: 12px;
    color: rgba(15, 23, 42, 0.55);
}

.cc-body {
    margin-top: 8px;
}
</style>
