<template>
  <v-container fluid>
    <div class="container-main">
      <!-- DETALHES -->
      <ProjectDetailsHeader :vm="detailsVm" />

      <!-- GRÁFICO (dinâmico) -->
      <ProjectTimeline :data="timeline" />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useActiveProject } from "../../composables/useActiveProject";

import ProjectDetailsHeader from "../../components/ProjectTimeline/ProjectDetailsHeader.vue";
import ProjectTimeline from "../../components/ProjectTimeline/ProjectTimeline.vue";

const { screenData } = useActiveProject();

const detailsVm = computed(() => screenData.value.details);
const timeline = computed(() => screenData.value.timeline);

</script>

<style scoped>
.container-main {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>
