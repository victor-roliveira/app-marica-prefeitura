<template>
    <div class="cf">
        <div class="cf-left">
            <span class="cf-muted">PESO TOTAL:</span>
            <span class="cf-strong">{{ total }}%</span>
        </div>

        <div class="cf-right">
            <span class="cf-dot" />
            <span class="cf-muted">ATUALIZADO:</span>
            <span class="cf-strong">{{ updatedLabel }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    total: number;
    updatedLabel: string;
}>();
</script>

<style scoped>
.cf {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 6px 6px;
    gap: 10px;
    flex-wrap: wrap;
}

.cf-left,
.cf-right {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.cf-muted {
    font-size: 12px;
    font-weight: 800;
    color: #94a3b8;
    letter-spacing: 0.2px;
}

.cf-strong {
    font-size: 12px;
    font-weight: 900;
    color: #64748b;
}

.cf-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #22c55e;
    display: inline-block;
}
</style>
