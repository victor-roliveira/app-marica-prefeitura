<template>
    <div class="msr">
        <ProgressRing :value="item.progressPct" />

        <div class="msr-text">
            <div class="msr-title" :title="item.title">{{ item.title }}</div>
            <div class="msr-subtitle" :title="item.subtitle">{{ item.subtitle }}</div>
        </div>

        <div class="msr-col msr-progress">{{ pct(item.progressPct) }}</div>
        <div class="msr-col msr-weight">{{ pct(item.weightPct) }}</div>

        <StatusBadge :status="item.status" />
    </div>
</template>

<script setup lang="ts">
import { MacroStageItem } from "../helpers/macroTypes";
import ProgressRing from "./ProgressRing.vue";
import StatusBadge from "./StatusBadge.vue";

defineProps<{ item: MacroStageItem }>();

function pct(v: number) {
    const n = Number.isFinite(v) ? Math.round(v) : 0;
    return `${Math.max(0, Math.min(100, n))}%`;
}
</script>

<style scoped>
.msr {
    display: grid;
    grid-template-columns: 64px 1fr 84px 64px 84px;
    align-items: center;
    gap: 12px;
    padding: 12px 6px;
}

.msr+.msr {
    border-top: 1px solid rgba(15, 23, 42, 0.06);
}

.msr-text {
    min-width: 0;
}

.msr-title {
    font-weight: 800;
    font-size: 14px;
    color: #0f172a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.msr-subtitle {
    margin-top: 2px;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 0.2px;
    color: #94a3b8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.msr-col {
    font-weight: 800;
    color: #0f172a;
    text-align: center;
}

@media (max-width: 520px) {
    .msr {
        grid-template-columns: 56px 1fr 70px 56px 78px;
    }

    .msr-col {
        font-size: 12px;
    }
}
</style>
