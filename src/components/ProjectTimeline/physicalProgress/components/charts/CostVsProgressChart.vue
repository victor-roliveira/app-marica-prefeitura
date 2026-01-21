<template>
    <VChart class="chart" :option="option" autoresize />
</template>

<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import type { CostVsPhysicalProgressVm } from "../../types";

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const props = defineProps<{ vm: CostVsPhysicalProgressVm }>();

function fmtMoneyM(v: number, unit: string) {
    return `${unit}${v.toFixed(1)}M`;
}

const option = computed(() => ({
    grid: { left: 40, right: 48, top: 10, bottom: 34 },
    tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
            const month = params?.[0]?.axisValue ?? "";
            const p = params?.find((x: any) => x.seriesName === "Avanço Real")?.value ?? 0;
            const c = params?.find((x: any) => x.seriesName === "Custo Real")?.value ?? 0;
            return `${month}<br/>Avanço Real: ${p}%<br/>Custo Real: ${fmtMoneyM(c, props.vm.costUnitLabel)}`;
        },
    },
    legend: {
        bottom: 0,
        icon: "circle",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontFamily: "Montserrat", fontWeight: 900, color: "#7b879b", fontSize: 10 },
        data: ["Avanço Real", "Custo Real"],
    },
    xAxis: {
        type: "category",
        data: props.vm.months,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { fontFamily: "Montserrat", fontWeight: 800, color: "#7b879b" },
    },
    yAxis: [
        {
            type: "value",
            min: 0,
            max: 100,
            interval: 25,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { fontFamily: "Montserrat", fontWeight: 800, color: "#9aa6b6", formatter: "{value}%" },
            splitLine: { lineStyle: { color: "#eef2f8" } },
        },
        {
            type: "value",
            min: 0,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                fontFamily: "Montserrat",
                fontWeight: 800,
                color: "#86efac",
                formatter: (v: number) => fmtMoneyM(v, props.vm.costUnitLabel),
            },
            splitLine: { show: false },
        },
    ],
    series: [
        {
            name: "Avanço Real",
            type: "line",
            yAxisIndex: 0,
            data: props.vm.progressActual,
            symbolSize: 8,
            lineStyle: { width: 3, color: "#a5f3fc" },
            itemStyle: { color: "#a5f3fc" },
        },
        {
            name: "Custo Real",
            type: "line",
            yAxisIndex: 1,
            data: props.vm.costActualM,
            symbolSize: 10,
            lineStyle: { width: 3, color: "#86efac" },
            itemStyle: { color: "#86efac" },
        },
    ],
}));
</script>

<style scoped>
.chart {
    width: 100%;
    height: 260px;
}
</style>
