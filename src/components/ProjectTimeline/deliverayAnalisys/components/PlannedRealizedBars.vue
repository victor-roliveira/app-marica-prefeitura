<template>
    <div class="pr-root">
        <div class="pr-top">
            <div class="pr-status">
                <div class="pr-statusLabel">{{ vm.statusLabel }}</div>
                <div class="pr-headline" :class="toneClass(vm.headlineTone)">{{ vm.headline }}</div>
            </div>

            <div class="pr-legend">
                <div class="leg">
                    <span class="legDot planned" />
                    <span class="legText">{{ vm.legendPlannedLabel }}</span>
                </div>
                <div class="leg">
                    <span class="legDot realized" />
                    <span class="legText">{{ vm.legendRealizedLabel }}</span>
                </div>
            </div>
        </div>

        <div class="chart">
            <div class="grid">
                <div v-for="g in [0, 25, 50, 75, 100]" :key="g" class="gridRow">
                    <span class="gridLabel">{{ g }}</span>
                    <span class="gridLine" />
                </div>
            </div>

            <div class="bars">
                <div v-for="(p, idx) in vm.points" :key="idx" class="barCol">
                    <div class="barStack">
                        <div class="bar planned" :style="{ height: clamp(p.planned) + '%' }" />
                        <div class="bar realized" :style="{ height: clamp(p.realized) + '%' }" />
                    </div>
                    <div class="barMonth">{{ p.monthLabel }}</div>
                </div>
            </div>
        </div>

        <div class="footnote">{{ vm.footnote }}</div>
    </div>
</template>

<script setup lang="ts">
import type { PlannedRealizedVm, DeliveryStatusTone } from "../types";

defineProps<{ vm: PlannedRealizedVm }>();

function clamp(v: number) {
    return Math.max(0, Math.min(100, v));
}

function toneClass(t: DeliveryStatusTone) {
    return t === "critical" ? "t-critical" : t === "risco" ? "t-risco" : "t-ok";
}
</script>

<style scoped>
.pr-root {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.pr-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
}

.pr-statusLabel {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.8px;
    color: #7b879b;
}

.pr-headline {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.6px;
}

.t-critical {
    color: #ef4444;
}

.t-risk {
    color: #f97316;
}

.t-ok {
    color: #16a34a;
}

.pr-legend {
    display: flex;
    gap: 10px;
    align-items: center;
}

.leg {
    display: flex;
    gap: 8px;
    align-items: center;
}

.legDot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
}

.legDot.planned {
    background: #e9eef6;
    border: 1px solid #dbe4f2;
}

.legDot.realized {
    background: #2563eb;
}

.legText {
    font-size: 11px;
    font-weight: 900;
    color: #7b879b;
    letter-spacing: 0.6px;
}

.chart {
    position: relative;
    height: 200px;
    border-radius: 14px;
}

.grid {
    position: absolute;
    inset: 0;
    padding-left: 34px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.gridRow {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 8px;
    align-items: center;
}

.gridLabel {
    font-size: 11px;
    color: #9aa6b6;
    text-align: right;
}

.gridLine {
    height: 1px;
    background: #eef2f8;
    border-radius: 999px;
}

.bars {
    position: absolute;
    inset: 0;
    padding: 10px 10px 10px 44px;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    gap: 10px;
}

.barCol {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 40px;
}

.barStack {
    position: relative;
    width: 38px;
    height: 160px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 6px;
}

.bar {
    width: 10px;
    border-radius: 6px;
}

.bar.planned {
    background: #eef2f8;
}

.bar.realized {
    background: #2563eb;
}

.barMonth {
    font-size: 12px;
    font-weight: 800;
    color: #7b879b;
}

.footnote {
    font-size: 11.5px;
    color: #93a1b4;
    line-height: 1.45;
    font-style: italic;
}
</style>
