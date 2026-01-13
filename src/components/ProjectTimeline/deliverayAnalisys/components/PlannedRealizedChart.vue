<template>
    <div class="chart-root">
        <div class="pr-top">
            <div class="pr-status">
                <div class="pr-statusLabel">{{ vm.statusLabel }}</div>
                <div class="pr-headline" :class="headlineClass">{{ vm.headline }}</div>
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

        <VChart class="chart" :option="option" autoresize />

        <div class="footnote">{{ vm.footnote }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    // TitleComponent, // se quiser usar title do echarts
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import type { PlannedRealizedVm } from "../types";

echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const props = defineProps<{ vm: PlannedRealizedVm }>();

function clamp(v: number) {
    return Math.max(0, Math.min(100, v));
}

const categories = computed(() => props.vm.points.map((p) => p.monthLabel));
const planned = computed(() => props.vm.points.map((p) => clamp(p.planned)));
const realized = computed(() => props.vm.points.map((p) => clamp(p.realized)));

const headlineClass = computed(() => {
    const t = props.vm.headlineTone;
    return t === "critical" ? "t-critical" : t === "risco" ? "t-risk" : "t-ok";
});

const option = computed(() => ({
    grid: {
        left: 34,
        right: 10,
        top: 10,
        bottom: 26,
        containLabel: false,
    },
    tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: any) => {
            // params: [{seriesName, value, axisValue, ...}, ...]
            const title = params?.[0]?.axisValue ?? "";
            const a = params?.find((p: any) => p.seriesName === props.vm.legendPlannedLabel)?.value ?? 0;
            const b = params?.find((p: any) => p.seriesName === props.vm.legendRealizedLabel)?.value ?? 0;
            return `${title}<br/>${props.vm.legendPlannedLabel}: ${a}%<br/>${props.vm.legendRealizedLabel}: ${b}%`;
        },
    },
    xAxis: {
        type: "category",
        data: categories.value,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
            fontFamily: "Montserrat",
            fontWeight: 800,
            color: "#7b879b",
            margin: 10,
        },
    },
    yAxis: {
        type: "value",
        min: 0,
        max: 100,
        interval: 25,
        axisLabel: {
            fontFamily: "Montserrat",
            fontWeight: 800,
            color: "#9aa6b6",
        },
        splitLine: {
            lineStyle: { color: "#eef2f8" },
        },
        axisLine: { show: false },
        axisTick: { show: false },
    },
    series: [
        {
            name: props.vm.legendPlannedLabel,
            type: "bar",
            data: planned.value,
            barWidth: 10,
            barGap: "60%",
            itemStyle: {
                color: "#bdc8fd",
                borderRadius: [6, 6, 6, 6],
            },
            emphasis: { focus: "series" },
        },
        {
            name: props.vm.legendRealizedLabel,
            type: "bar",
            data: realized.value,
            barWidth: 10,
            itemStyle: {
                color: "#2563eb",
                borderRadius: [6, 6, 6, 6],
            },
            emphasis: { focus: "series" },
        },
    ],
}));
</script>

<style scoped>
.chart-root {
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
    font-family: "Montserrat";
}

.pr-headline {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.6px;
    font-family: "Montserrat";
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
    background: #eef2f8;
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
    font-family: "Montserrat";
}

.chart {
    width: 100%;
    height: 210px;
}

.footnote {
    font-size: 11.5px;
    color: #93a1b4;
    line-height: 1.45;
    font-style: italic;
    font-family: "Montserrat";
}
</style>
