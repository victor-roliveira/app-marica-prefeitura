<template>
  <v-container fluid>
    <div class="container-main">
      <ProjectDetailsHeader :vm="detailsVm" />
      <ProjectTimeline :data="timeline" />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useActiveProject } from "../../composables/useActiveProject";

import ProjectDetailsHeader from "../../components/ProjectTimeline/osComponents/ProjectDetailsHeader.vue";
import ProjectTimeline from "../../components/ProjectTimeline/osComponents/ProjectTimeline.vue";

const route = useRoute();
const router = useRouter();
const { screenData, setActiveProjectId } = useActiveProject();

const projectId = computed(() => String(route.params.projectId || ""));

// sincroniza o estado global com a rota
watch(
  projectId,
  (id) => {
    if (!id) return;
    setActiveProjectId(id);

    if (!screenData.value) router.replace("/acompanhamento/BAT01");
  },
  { immediate: true }
);

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
