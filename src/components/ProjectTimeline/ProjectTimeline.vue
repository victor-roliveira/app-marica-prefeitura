<template>
    <v-card class="pt-card" elevation="2">
        <v-card-text class="pt-root">
            <TimelineHeader :title="headerTitle" :status="data.project.status" />

            <div class="pt-stages-mobile">
                <TimelineStages :stages="sortedStages" :progress-by-stage="progressByStage" :show-emojis="showEmojis"
                    :show-bars="false" />
            </div>

            <TimelineCanvas :project="data.project" :stages="sortedStages" :progress="data.progress"
                :milestones="data.milestones" :alterations="data.alterations" :config="data.config" />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

import TimelineHeader from "./TimelineHeader.vue";
import TimelineStages from "./TimelineStages.vue";
import TimelineCanvas from "./TimelineCanvas.vue";

import type { ProjectTimelineData, Stage, StageProgress } from "./types";

const props = defineProps<{ data: ProjectTimelineData }>();

const headerTitle = computed(() => {
    const name = props.data.project.name_project?.trim() ?? "";
    const pct = Number.isFinite(props.data.project.overall_percent)
        ? Math.round(props.data.project.overall_percent)
        : 0;
    return `${name.toUpperCase()} (${pct}%)`;
});

const sortedStages = computed<Stage[]>(() => {
    return [...props.data.stages].sort((a, b) => a.view_order - b.view_order);
});

const progressByStage = computed<Record<string, StageProgress | undefined>>(() => {
    const map: Record<string, StageProgress | undefined> = {};
    for (const p of props.data.progress) map[p.step_id] = p;
    return map;
});

const showEmojis = computed(() => props.data.config?.show_icons_checked ?? true);
</script>

<style scoped>
.pt-card {
    border-radius: 12px;
}

.pt-root {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.pt-stages-mobile {
  /* alinhamento com o começo das barras no GanttMobile */
  padding-left: 68px;
  padding-right: 60px; /* espaço reservado para a coluna das alterações (110px + gap) */
}

@media (min-width: 960px) {
  .pt-stages-mobile {
    padding-left: 0;
    padding-right: 0;
  }
}

</style>
