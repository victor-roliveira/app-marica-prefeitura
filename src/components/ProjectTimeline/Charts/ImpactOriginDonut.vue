<template>
    <div class="wrap">
        <VChart class="chart" :style="{ height: heightPx + 'px' }" :option="option" autoresize />

        <div class="legend">
            <div v-for="item in legendItems" :key="item.name" class="legend-item">
                <span class="dot" :style="{ background: item.color }" />
                <div class="legend-text">
                    <div class="legend-name">{{ item.name }}</div>
                    <div class="legend-val">{{ item.pct }}%</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";

export type ImpactCategory = {
    name: string;
    value: number;
    color?: string;
};

const props = defineProps<{
    data: ImpactCategory[];
    centerLabel?: string;
    heightPx?: number; 
}>();

const heightPx = computed(() => props.heightPx ?? 220);

function palette(i: number) {
    const colors = ["#4f46e5", "#10b981", "#f59e0b", "#94a3b8", "#ef4444", "#22c55e"];
    return colors[i % colors.length];
}

const total = computed(() => props.data.reduce((acc, d) => acc + d.value, 0));

const legendItems = computed(() => {
    const t = total.value || 1;
    return props.data.map((d, i) => ({
        name: d.name.toUpperCase(),
        pct: Math.round((d.value / t) * 100),
        color: d.color ?? palette(i),
    }));
});


const seriesData = computed(() =>
    props.data.map((d, i) => ({
        name: d.name,
        value: d.value,
        itemStyle: {
            color: d.color ?? palette(i),
            borderColor: "#fff",
            borderWidth: 6,
        },
    }))
);


const isCompact = computed(
    () => props.heightPx !== undefined && props.heightPx < 210
);

const option = computed(() => ({
    tooltip: { trigger: "item" },

    series: [
        {
            type: "pie",
            radius: isCompact.value ? ["35%", "75%"] : ["40%", "85%"],
            center: ["50%", isCompact.value ? "42%" : "44%"],
            label: { show: false },
            labelLine: { show: false },
            data: seriesData.value,
        },
    ],

    graphic: [
        {
            type: "group",
            left: "center",
            top: isCompact.value ? "30%" : "34%",
            children: [
                {
                    type: "text",
                    style: {
                        text: String(props.data.length),
                        fontSize: isCompact.value ? 26 : 34,
                        fontWeight: 800,
                        fill: "#0f172a",
                        align: "center",
                    },
                },
                {
                    type: "text",
                    top: isCompact.value ? 30 : 44,
                    style: {
                        text: (props.centerLabel ?? "FATORES").toUpperCase(),
                        fontSize: 10,
                        fontWeight: 700,
                        fill: "rgba(15,23,42,.55)",
                        align: "center",
                    },
                },
            ],
        },
    ],
}));


</script>

<style scoped>
.wrap {
    width: 100%;
    font-family: 'Montserrat';
}

.chart {
    width: 100%;
}

.legend {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding-top: 6px;
}

@media (max-width: 420px) {
    .legend {
        grid-template-columns: 1fr;
    }
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    flex: 0 0 auto;
}

.legend-text {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    min-width: 0;
}

.legend-name,
.legend-val {
    font-size: 11px;
    font-weight: 700;
    color: rgba(15, 23, 42, 0.65);
}

.legend-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.legend-val {
    font-weight: 800;
}
</style>
