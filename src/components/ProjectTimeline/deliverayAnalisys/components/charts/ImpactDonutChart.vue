<template>
    <div class="chart-root">
        <VChart class="chart" :option="option" autoresize />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import type { ImpactDistributionItemVm, ImpactColorKey } from "../../types";

echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

const props = defineProps<{
    items: ImpactDistributionItemVm[];
    totalPctLabel: string; 
    subtitle: string;      
}>();

function colorByKey(k: ImpactColorKey) {
    if (k === "rev_proj") return "#2563eb";
    if (k === "ambiental") return "#ef4444";
    if (k === "desapropriacao") return "#f97316";
    return "#cbd5e1";
}

const seriesData = computed(() =>
    props.items.map((i) => ({
        name: i.label,
        value: i.pct,
        itemStyle: { color: colorByKey(i.colorKey) },
    }))
);

const pctByLabel = computed(() => {
    const m = new Map<string, number>();
    for (const it of props.items) m.set(it.label, it.pct);
    return m;
});

const option = computed(() => ({
    tooltip: {
        trigger: "item",
        formatter: (p: any) => `${p.name}: ${p.value}%`,
    },
    legend: {
        orient: "vertical",
        right: 10,
        top: "middle",
        itemWidth: 10,
        itemHeight: 10,
        icon: "circle",
        itemGap: 10,

        data: props.items.map((i) => i.label),

        formatter: (name: string) => {
            const pct = pctByLabel.value.get(name) ?? 0;
            const labelUp = name.toUpperCase();
            return `{label|${labelUp}}\n{pct|${pct}%}`;
        },

        textStyle: {
            fontFamily: "Montserrat",
            fontSize: 11,
            fontWeight: 800,
            color: "#7b879b",
            rich: {
                label: {
                    fontFamily: "Montserrat",
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#7b879b",
                    lineHeight: 14,
                },
                pct: {
                    fontFamily: "Montserrat",
                    fontSize: 16,
                    fontWeight: 900,
                    color: "#0e1730",
                    lineHeight: 18,
                },
            },
        },
    },

    series: [
        {
            name: "Impacto",
            type: "pie",
            radius: ["40%", "85%"],
            center: ["30%", "50%"],
            avoidLabelOverlap: true,
            label: { show: false },
            labelLine: { show: false },
            data: seriesData.value,
            emphasis: { scale: true, scaleSize: 6 },
        },
    ],
    graphic: [
        {
            type: "text",
            left: "30%",
            top: "46%",
            style: {
                text: props.totalPctLabel,
                fontFamily: "Montserrat",
                fontSize: 18,
                fontWeight: 900,
                fill: "#0e1730",
                align: "center",
            },
        },
        {
            type: "text",
            left: "30%",
            top: "56%",
            style: {
                text: props.subtitle,
                fontFamily: "Montserrat",
                fontSize: 9,
                fontWeight: 800,
                fill: "#7b879b",
                letterSpacing: 1.2,
                align: "center",
            },
        },
    ],
}));
</script>

<style scoped>
.chart-root {
    width: 100%;
    height: 170px;
}

.chart {
    width: 100%;
    height: 100%;
}
</style>
