<template>
    <div class="donut-root">
        <div class="donut-left">
            <svg :width="size" :height="size" viewBox="0 0 120 120" class="donut-svg">
                <circle cx="60" cy="60" r="44" class="track" />

                <g>
                    <template v-for="(seg, idx) in segments" :key="idx">
                        <circle cx="60" cy="60" r="44" class="seg" :class="colorClass(seg.colorKey)"
                            :stroke-dasharray="`${seg.len} ${circumference - seg.len}`"
                            :stroke-dashoffset="seg.offset" />
                    </template>
                </g>

                <text x="60" y="58" text-anchor="middle" class="centerPct">{{ totalPctLabel }}</text>
                <text x="60" y="76" text-anchor="middle" class="centerSub">{{ subtitle }}</text>
            </svg>
        </div>

        <div class="donut-right">
            <div v-for="(i, idx) in items" :key="idx" class="legend-row">
                <span class="dot" :class="colorClass(i.colorKey)" />
                <div class="legend-text">
                    <div class="legend-label">{{ i.label }}</div>
                    <div class="legend-pct">{{ i.pct }}%</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ImpactDistributionItemVm, ImpactColorKey } from "../types";

const props = defineProps<{
    items: ImpactDistributionItemVm[];
    totalPctLabel: string;
    subtitle: string;
    size?: number;
}>();

const size = computed(() => props.size ?? 160);
const circumference = 2 * Math.PI * 44;

function colorClass(k: ImpactColorKey) {
    if (k === "rev_proj") return "c-rev";
    if (k === "ambiental") return "c-amb";
    if (k === "desapropriacao") return "c-des";
    return "c-log";
}

const segments = computed(() => {
    let accPct = 0;

    return props.items.map((it) => {
        const pct = Math.max(0, Math.min(100, it.pct));
        const len = (circumference * pct) / 100;
        const offset = (circumference * accPct) / 100;

        accPct += pct;

        return { len, offset, colorKey: it.colorKey };
    });
});
</script>

<style scoped>
.donut-root {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 14px;
    align-items: center;
}

.donut-svg {
    display: block;
    transform: rotate(-90deg);
}

.track {
    fill: none;
    stroke: #e9eef6;
    stroke-width: 14;
}

.seg {
    fill: none;
    stroke-width: 14;
    stroke-linecap: butt;
}

.centerPct {
    transform: rotate(90deg);
    font-size: 16px;
    font-weight: 900;
    fill: #0e1730;
}

.centerSub {
    transform: rotate(90deg);
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 1.2px;
    fill: #7b879b;
}

.legend-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 6px 0;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    margin-top: 6px;
}

.legend-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.legend-label {
    font-size: 11px;
    font-weight: 800;
    color: #7b879b;
    text-transform: uppercase;
}

.legend-pct {
    font-size: 16px;
    font-weight: 900;
    color: #0e1730;
}

.seg.c-rev {
    stroke: #2563eb;
}

.seg.c-amb {
    stroke: #ef4444;
}

.seg.c-des {
    stroke: #f97316;
}

.seg.c-log {
    stroke: #cbd5e1;
}

.dot.c-rev {
    background: #2563eb;
}

.dot.c-amb {
    background: #ef4444;
}

.dot.c-des {
    background: #f97316;
}

.dot.c-log {
    background: #cbd5e1;
}
</style>
