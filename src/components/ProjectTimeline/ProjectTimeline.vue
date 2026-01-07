<template>
    <v-card class="pt-card" elevation="2">
        <v-card-text class="pt-root">
            <TimelineHeader :title="headerTitle" :status="data.project.status" />

            <!-- Header das etapas: somente no mobile -->
            <div class="pt-stages-mobile-only">
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
    /* mobile defaults já existentes */
    --stage-col-width: 18px;
    --stage-gap: 10px;
}

.pt-stages-mobile-only {
    padding-left: 68px;
    padding-right: 60px;
}

@media (min-width: 960px) {
    .pt-root {
        /* desktop: mais espaço, mantém alinhamento entre topo e gantt */
        --stage-col-width: 34px;
        --stage-gap: 16px;
    }

    .pt-stages-mobile-only {
        display: none;
    }
}
</style>
