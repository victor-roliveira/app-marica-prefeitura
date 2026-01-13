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

import type { ProgressComparisonVm } from "../../types";

echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const props = defineProps<{ vm: ProgressComparisonVm }>();

const option = computed(() => ({
    grid: { left: 40, right: 10, top: 10, bottom: 40 },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: {
        bottom: 0,
        icon: "circle",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontFamily: "Montserrat", fontWeight: 900, color: "#7b879b", fontSize: 10 },
        data: ["PLANEJADO", "REPLANEJADO", "REAL"],
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
        { name: "PLANEJADO", type: "bar", data: props.vm.planned, barWidth: 10, itemStyle: { color: "#fdba74", borderRadius: [6, 6, 0, 0] } },
        { name: "REPLANEJADO", type: "bar", data: props.vm.replanned, barWidth: 10, itemStyle: { color: "#14b8a6", borderRadius: [6, 6, 0, 0] } },
        { name: "REAL", type: "bar", data: props.vm.actual, barWidth: 10, itemStyle: { color: "#bae6fd", borderRadius: [6, 6, 0, 0] } },
    ],
}));
</script>

<style scoped>
.chart {
    width: 100%;
    height: 260px;
}
</style>
