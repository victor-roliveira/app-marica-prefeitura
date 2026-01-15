<template>
  <div>
    <TimelineGanttMobile
      v-if="isMobile"
      :project="project"
      :stages="stages"
      :progress="progress"
      :milestones="milestones"
      :alterations="alterations"
      :height-px="440"
    />

    <TimelineGanttDesktop
      v-else
      :project="project"
      :stages="stages"
      :progress="progress"
      :milestones="milestones"
      :alterations="alterations"
      
      :inaugur-color="config?.color_inauguration ?? '#0A2A66'"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";

import TimelineGanttMobile from "./TimelineGanttMobile.vue";
import TimelineGanttDesktop from "./TimelineGanttDesktop.vue";

import type { Project, Stage, StageProgress, Milestone, Alteration, TimelineConfig } from "../helpers/types";

const display = useDisplay();
const isMobile = computed(() => display.smAndDown.value);

defineProps<{
  project: Project;
  stages: Stage[];
  progress: StageProgress[];
  milestones: Milestone[];
  alterations: Alteration[];
  config?: TimelineConfig;
}>();
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
