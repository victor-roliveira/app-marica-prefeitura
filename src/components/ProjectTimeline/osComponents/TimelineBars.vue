<template>
    <!-- HORIZONTAL (desktop) -->
    <div v-if="orientation === 'horizontal'" class="tb-root-horizontal">
        <div v-for="stage in stages" :key="stage.step_id" class="tb-row" :style="{ height: rowHeightPx }">
            <div class="tb-bar-bg">
                <div class="tb-bar-fill" :style="{
                    width: getPercent(stage.step_id) + '%',
                    backgroundColor: stage.default_color
                }" />
            </div>
        </div>
    </div>

    <!-- VERTICAL (mobile) -->
    <div v-else class="tb-root-vertical" :style="{
        height: heightPx + 'px'
    }">
        <div v-for="stage in stages" :key="stage.step_id" class="tb-col" :title="stage.step_name">
            <div class="tb-vbar-bg">
                <div class="tb-vbar-fill" :style="{
                    height: getPercent(stage.step_id) + '%',
                    backgroundColor: stage.default_color
                }" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Stage, StageProgress, TimelineConfig } from "../helpers/types";

const props = defineProps<{
    stages: Stage[];
    progress: StageProgress[];
    config?: TimelineConfig;
    orientation?: "horizontal" | "vertical";
    heightPx?: number;
}>();

const orientation = computed(() => props.orientation ?? "horizontal");

function getPercent(etapaId: string): number {
    const p = props.progress.find((x) => x.step_id === etapaId);
    if (!p) return 0;
    const v = Number(p.advance_percent);
    if (!Number.isFinite(v)) return 0;
    return Math.max(0, Math.min(100, Math.round(v)));
}

const rowHeightPx = computed(() => {
    const h = props.config?.height_bar_step ?? 32;
    return `${h}px`;
});

const heightPx = computed(() => props.heightPx ?? 220);
</script>

<style scoped>
.tb-root-horizontal {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

.tb-row {
    display: flex;
    align-items: center;
}

.tb-bar-bg {
    width: 100%;
    height: 14px;
    background: rgba(0, 0, 0, 0.12);
    border-radius: 2px;
    overflow: hidden;
}

.tb-bar-fill {
    height: 100%;
    transition: width 0.25s ease;
}

.tb-root-vertical {
    display: flex;
    align-items: flex-end;
    gap: var(--stage-gap, 12px);
    width: 100%;
    overflow-x: auto;

    padding-bottom: 2px;
}

.tb-col {
    min-width: var(--stage-col-width, 34px);
    display: flex;
    justify-content: center;
}

.tb-vbar-bg {
    width: 14px;
    height: 100%;
    background: rgba(0, 0, 0, 0.12);
    border-radius: 2px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
}

.tb-vbar-fill {
    width: 100%;
    transition: height 0.25s ease;
}
</style>
