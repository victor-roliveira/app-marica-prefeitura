<template>
    <div class="ts-root">
        <div v-for="s in stages" :key="s.step_id" class="ts-col">
            <!-- Nome da etapa (vertical para economizar espaço) -->
            <div class="ts-stage-name" :class="{ 'is-vertical': s.orientation_text === 'vertical' }"
                :title="s.step_name">
                {{ s.step_name }}
            </div>

            <!-- Avanço: emoji se concluída (e showEmojis), senão percentual -->
            <div class="ts-stage-progress">
                <template v-if="isCompleted(s.step_id)">
                    <span v-if="showEmojis">{{ s.checked_icon }}</span>
                    <span v-else>100%</span>
                </template>

                <template v-else>
                    <span v-if="shouldShowPercent(s.step_id)">
                        {{ getPercent(s.step_id) }}%
                    </span>
                    <span v-else>-</span>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Stage, StageProgress } from "./types";

const props = defineProps<{
    stages: Stage[];
    progressByStage: Record<string, StageProgress | undefined>;
    showEmojis: boolean;
}>();

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
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 6px;
}

.ts-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 34px;
    /* coluninha estreita, parecido com a ideia do print */
    gap: 6px;
}

.ts-stage-name {
    font-size: 12px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.75);
    max-width: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Texto vertical */
.ts-stage-name.is-vertical {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    max-width: unset;
}

.ts-stage-progress {
    font-size: 12px;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.75);
}
</style>
