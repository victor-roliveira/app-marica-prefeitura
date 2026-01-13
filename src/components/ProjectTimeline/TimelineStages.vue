<template>
    <div class="ts-root">
        <div v-for="s in stages" :key="s.step_id" class="ts-col">
            <div class="ts-stage-name" :class="{ 'is-vertical': s.orientation_text === 'vertical' }"
                :title="s.step_name">
                {{ s.step_name }}
            </div>
            <div class="ts-stage-progress">
                <template v-if="isCompleted(s.step_id)">
                    <span v-if="showEmojis">{{ s.checked_icon }}</span>
                    <span v-else>100%</span>
                </template>

                <template v-else>
                    <span v-if="shouldShowPercent(s.step_id)">
                        {{ getPercent(s.step_id) }}%
                    </span>
                    <span v-else>0%</span>
                </template>
            </div>
            <div v-if="showBars" class="ts-vbar-bg" :style="{ height: barsHeightPx + 'px' }">
                <div class="ts-vbar-fill" :style="{
                    height: getPercent(s.step_id) + '%',
                    backgroundColor: s.default_color
                }" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Stage, StageProgress } from "./helpers/types";

const props = defineProps<{
    stages: Stage[];
    progressByStage: Record<string, StageProgress | undefined>;
    showEmojis: boolean;
    showBars?: boolean;
    barsHeightPx?: number;
}>();

const showBars = props.showBars ?? false;
const barsHeightPx = props.barsHeightPx ?? 140;

function getProgress(etapaId: string): StageProgress | undefined {
    return props.progressByStage[etapaId];
}

function getPercent(etapaId: string): number {
    const p = getProgress(etapaId);
    if (!p) return 0;
    const val = Number(p.advance_percent);
    if (!Number.isFinite(val)) return 0;
    return Math.max(0, Math.min(100, Math.round(val)));
}

function isCompleted(etapaId: string): boolean {
    const p = getProgress(etapaId);
    if (!p) return false;
    return p.completed === true || getPercent(etapaId) >= 100;
}

function shouldShowPercent(etapaId: string): boolean {
    const p = getProgress(etapaId);
    if (!p) return false;
    return p.show_percent === true && getPercent(etapaId) < 100;
}
</script>

<style scoped>
.ts-root {
  display: flex;
  align-items: flex-end;
  gap: 7px;
  overflow-x: auto;
  padding-bottom: 2px;
  font-family: 'Montserrat';
  width: 400px;
  margin-top: 20px;
}

.ts-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: var(--stage-col-width, 18px);
  gap: 2px;                  
}

.ts-stage-name {
  font-size: 10px;             
  font-weight: 600;
  color: rgba(0, 0, 0, 0.75);
  white-space: nowrap;
  line-height: 1.05;
}

.ts-stage-name.is-vertical {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.ts-stage-progress {
  font-size: 10px;            
  font-weight: 700;
  color: rgba(0, 0, 0, 0.7);
  line-height: 1;
  padding-top: 10px;
}

.ts-vbar-bg {
    width: 12px;
    background: rgba(0, 0, 0, 0.12);
    border-radius: 999px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
}

.ts-vbar-fill {
    width: 100%;
    transition: height 0.25s ease;
}
</style>
