<template>
    <div class="wrap">
        <VChart class="chart" :style="{ height: heightPx + 'px' }" :option="option" :notMerge="true"
            :updateOptions="{ replaceMerge: ['series'] }" autoresize />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";

export type PhysicalEvolutionPoint = {
    label: string;      // "Jan"
    projected: number;  // 0..100
    executed: number;   // 0..100
};

const props = defineProps<{
    data: PhysicalEvolutionPoint[];
    heightPx?: number;
    seriesNames?: {
        projected?: string;
        executed?: string;
    };
}>();

const heightPx = computed(() => props.heightPx ?? 290);
const isCompact = computed(() => heightPx.value < 260);

const safeData = computed(() => Array.isArray(props.data) ? props.data : []);

const x = computed(() => safeData.value.map((d) => d.label));
const projected = computed(() => safeData.value.map((d) => d.projected));
const executed = computed(() => safeData.value.map((d) => d.executed));

const option = computed(() => {
    const projectedName = props.seriesNames?.projected ?? "PROJETADO";
    const executedName = props.seriesNames?.executed ?? "EXECUTADO";

    return {
        grid: {
            left: 34,
            right: 14,
            top: isCompact.value ? 16 : 44,
            bottom: isCompact.value ? 38 : 26,
            containLabel: true,
        },

        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            valueFormatter: (v: unknown) =>
                typeof v === "number" ? `${v.toFixed(0)}%` : String(v),
        },

        legend: isCompact.value
            ? {
                bottom: 6,
                left: "center",
                itemWidth: 10,
                itemHeight: 10,
                textStyle: { fontSize: 10, fontWeight: 600, color: "rgba(15,23,42,.55)" },
                data: [projectedName, executedName],
            }
            : {
                top: 8,
                right: 10,
                itemWidth: 10,
                itemHeight: 10,
                textStyle: { fontSize: 11, fontWeight: 600, color: "rgba(15,23,42,.55)" },
                data: [projectedName, executedName],
            },

        xAxis: {
            type: "category",
            data: x.value,
            axisTick: { show: false },
            axisLine: { lineStyle: { color: "rgba(15,23,42,.10)" } },
            axisLabel: { color: "rgba(15,23,42,.50)", fontSize: 10 },
        },

        yAxis: {
            type: "value",
            min: 0,
            max: 100,
            interval: 25,
            axisLabel: { formatter: "{value}%", color: "rgba(15,23,42,.45)", fontSize: 10 },
            splitLine: { lineStyle: { color: "rgba(15,23,42,.06)" } },
        },

        series: [
            {
                name: projectedName,
                type: "line",
                data: projected.value,          // ✅ NÃO some
                smooth: true,
                symbol: "circle",
                symbolSize: isCompact.value ? 4 : 6,
                lineStyle: { width: isCompact.value ? 2 : 3, color: "rgba(148,163,184,.60)" },
                itemStyle: { color: "rgba(148,163,184,.60)" },
                emphasis: { focus: "series" },
                z: 3,
            },
            {
                name: executedName,
                type: "bar",
                data: executed.value,           // ✅ NÃO some
                barWidth: isCompact.value ? 22 : 42,
                itemStyle: {
                    color: "rgba(79,70,229,.85)",
                    borderRadius: [10, 10, 0, 0],
                },
                emphasis: { focus: "series" },
                z: 2,
            },
        ],
    };
});
</script>

<style scoped>
.wrap {
    width: 100%;
}

.chart {
    width: 100%;
}
</style>
