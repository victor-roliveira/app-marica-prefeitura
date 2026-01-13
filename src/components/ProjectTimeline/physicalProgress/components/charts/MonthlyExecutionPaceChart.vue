<template>
    <VChart class="chart" :option="option" autoresize />
</template>

<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import type { MonthlyExecutionPaceVm } from "../../types";

echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const props = defineProps<{ vm: MonthlyExecutionPaceVm }>();

const option = computed(() => ({
    grid: { left: 40, right: 10, top: 10, bottom: 34 },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: {
        bottom: 0,
        icon: "circle",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontFamily: "Montserrat", fontWeight: 900, color: "#7b879b", fontSize: 10 },
        data: ["Planejado", "Real"],
    },
    xAxis: {
        type: "category",
        data: props.vm.months,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { fontFamily: "Montserrat", fontWeight: 800, color: "#7b879b" },
    },
    yAxis: {
        type: "value",
        min: 0,
        max: 100,
        interval: 25,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontFamily: "Montserrat", fontWeight: 800, color: "#9aa6b6" },
        splitLine: { lineStyle: { color: "#eef2f8" } },
    },
    series: [
        { name: "Planejado", type: "bar", data: props.vm.planned, barWidth: 14, itemStyle: { color: "#cbd5e1", borderRadius: [6, 6, 0, 0] } },
        { name: "Real", type: "bar", data: props.vm.actual, barWidth: 14, itemStyle: { color: "#99f6e4", borderRadius: [6, 6, 0, 0] } },
    ],
}));
</script>

<style scoped>
.chart {
    width: 100%;
    height: 240px;
}
</style>
