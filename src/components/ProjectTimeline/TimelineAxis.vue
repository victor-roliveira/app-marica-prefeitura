<template>
    <div class="ta-root" :style="{ height: heightPx + 'px' }">
        <!-- Linha guia do range (topo -> fundo) -->
        <div class="ta-guide" />

        <div v-for="m in sortedMilestones" :key="m.milestone_id" class="ta-item" :class="{ fixed: m.fixed }"
            :style="{ top: getTopPx(m.milestone_date) + 'px' }">
            <div class="ta-tick" />
            <div class="ta-text">
                <div class="ta-date">{{ formatDate(m.milestone_date) }}</div>
                <div class="ta-label">{{ m.description }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ISODate, Milestone } from "./types";

const props = defineProps<{
    milestones: Milestone[];
    rangeStart: ISODate;
    rangeEnd: ISODate;
    heightPx: number;
}>();

const sortedMilestones = computed(() =>
    [...props.milestones].sort(
        (a, b) => new Date(a.milestone_date).getTime() - new Date(b.milestone_date).getTime()
    )
);

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("pt-BR");
}

function clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
}

function getTopPx(dateIso: ISODate): number {
    const start = new Date(props.rangeStart).getTime();
    const end = new Date(props.rangeEnd).getTime();
    const d = new Date(dateIso).getTime();

    const denom = Math.max(1, end - start);
    const ratio = clamp((d - start) / denom, 0, 1);

    // padding mínimo, bem “achatado”
    const padTop = 8;
    const padBottom = 8;
    const usable = Math.max(1, props.heightPx - padTop - padBottom);

    return padTop + ratio * usable;
}
</script>

<style scoped>
.ta-root {
    position: relative;
    min-width: 0;
}

/* linha guia (ajuda a perceber o alinhamento com a barra) */
.ta-guide {
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgba(0, 0, 0, 0.08);
    border-radius: 2px;
}

.ta-item {
    position: absolute;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: grid;
    grid-template-columns: 18px 1fr;
    align-items: center;
    gap: 6px;
    min-width: 0;
}

.ta-tick {
    width: 10px;
    height: 2px;
    background: rgba(0, 0, 0, 0.35);
    border-radius: 2px;
    margin-left: 6px;
}

.ta-text {
    min-width: 0;
}

.ta-date {
    font-size: 11px;
    font-weight: 800;
    line-height: 1.05;
}

.ta-label {
    font-size: 10px;
    line-height: 1.05;
    opacity: 0.85;
    white-space: normal;
    word-break: break-word;
}

.ta-item.fixed .ta-date {
    font-weight: 900;
}
</style>
