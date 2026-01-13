<template>
    <VChart class="chart" :option="option" autoresize />
</template>

<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import * as echarts from "echarts/core";
import { LineChart, ScatterChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import type { MilestonesEvolutionVm } from "../../types";

echarts.use([LineChart, ScatterChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const props = defineProps<{ vm: MilestonesEvolutionVm }>();

const option = computed(() => ({
    grid: { left: 42, right: 10, top: 38, bottom: 40 },
    tooltip: { trigger: "axis" },
    legend: {
        bottom: 0,
        itemWidth: 18,
        itemHeight: 8,
        textStyle: { fontFamily: "Montserrat", fontWeight: 800, color: "#7b879b", fontSize: 10 },
        data: ["P. INICIAL", "REPLANEJADO", "REAL (DISPERSÃO)"],
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
        name: "Marcos de Entrega (%)",
        nameTextStyle: { fontFamily: "Montserrat", fontWeight: 800, color: "#9aa6b6" },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontFamily: "Montserrat", fontWeight: 800, color: "#9aa6b6" },
        splitLine: { lineStyle: { color: "#eef2f8" } },
    },
    series: [
        {
            name: "P. INICIAL",
            type: "line",
            data: props.vm.initialPlanned,
            showSymbol: false,
            lineStyle: { width: 3, color: "#fb923c" },
        },
        {
            name: "REPLANEJADO",
            type: "line",
            data: props.vm.replanned,
            showSymbol: false,
            lineStyle: { width: 2, type: "dashed", color: "#06b6d4" },
        },
        {
            name: "REAL (DISPERSÃO)",
            type: "scatter",
            data: props.vm.actualScatter,
            symbolSize: 10,
            itemStyle: { color: "#111827" },
        },
    ],
}));
</script>

<style scoped>
.chart {
    width: 100%;
    height: 320px;
}
</style>
