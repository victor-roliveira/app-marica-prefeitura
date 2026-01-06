<template>
    <div>
        <!-- MOBILE: Gantt por tempo (igual ao template) -->
        <TimelineGanttMobile v-if="isMobile" :project="project" :stages="stages" :progress="progress"
            :milestones="milestones" :alterations="alterations" :height-px="440" />

        <!-- DESKTOP: mantém seu layout atual -->
        <div v-else class="tc-root">
            <div class="tc-axis" :style="{ height: 360 + 'px' }">
                <TimelineAxis :milestones="milestones" :range-start="rangeStart" :range-end="rangeEnd"
                    :height-px="360" />
            </div>

            <div class="tc-center">
                <div class="tc-inaug" :style="{ height: 360 + 'px' }">
                    <TimelineInauguration :color="config?.color_inauguration ?? '#0A2A66'" />
                </div>

                <div class="tc-bars">
                    <TimelineBars :stages="stages" :progress="progress" :config="config" orientation="horizontal" />
                </div>
            </div>

            <div class="tc-alterations">
                <TimelineAlterations :alterations="alterations" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";

import TimelineAxis from "./TimelineAxis.vue";
import TimelineInauguration from "./TimelineInauguration.vue";
import TimelineBars from "./TimelineBars.vue";
import TimelineAlterations from "./TimelineAlterations.vue";
import TimelineGanttMobile from "./TimelineGanttMobile.vue";

import type { Project, Stage, StageProgress, Milestone, Alteration, TimelineConfig, ISODate } from "./types";

const display = useDisplay();
const isMobile = computed(() => display.smAndDown.value);

const props = defineProps<{
    project: Project;
    stages: Stage[];
    progress: StageProgress[];
    milestones: Milestone[];
    alterations: Alteration[];
    config?: TimelineConfig;
}>();

const rangeStart = computed<ISODate>(() => {
    const times = props.milestones.map((m) => new Date(m.milestone_date).getTime());
    const min = Math.min(...times);
    return new Date(min).toISOString().slice(0, 10);
});

const rangeEnd = computed<ISODate>(() => props.project.inauguration_date);
</script>

<style scoped>
.tc-root {
    display: grid;
    grid-template-columns: 150px 1fr 150px;
    gap: 12px;
    align-items: start;
    min-width: 0;
}

.tc-center {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 12px;
    min-width: 0;
}

.tc-inaug {
    width: 28px;
}
</style>
