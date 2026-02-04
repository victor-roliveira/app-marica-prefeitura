<template>
  <v-container fluid>
    <div v-if="screenData" class="container-main">
      <ProjectDetailsHeader :vm="detailsVm" />
      
      <ProjectTimeline :data="timelineData" />
    </div>

    <div v-else class="d-flex justify-center align-center h-100">
      <v-progress-circular indeterminate color="primary" />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useActiveProject } from "../../composables/useActiveProject";

// Garanta que os caminhos estão corretos
import ProjectDetailsHeader from "../../components/ProjectTimeline/osComponents/ProjectDetailsHeader.vue";
import ProjectTimeline from "../../components/ProjectTimeline/osComponents/ProjectTimeline.vue";

const route = useRoute();
const router = useRouter();
// Importante: Pegue o isLoading também para controlar feedback visual se quiser
const { screenData, setActiveProjectId, isLoading } = useActiveProject();

const projectId = computed(() => String(route.params.projectId || ""));

watch(
  projectId,
  (id) => {
    if (!id) return;
    setActiveProjectId(id);
    
    // Removi o redirect agressivo. 
    // Se redirecionar enquanto está carregando (isLoading), o usuário toma um "kick" desnecessário.
    // Deixe o router ou o v-else cuidar disso.
  },
  { immediate: true }
);

// CORREÇÃO AQUI:
// O screenData PODE ser null/undefined no início. Use ?. para evitar erro "cannot read property of undefined"
const detailsVm = computed(() => screenData.value?.details);

// CORREÇÃO CRÍTICA: 
// No adapter fizemos "...p.timelineData", então o screenData JÁ É o timelineData.
// Não existe screenData.value.timeline.
const timelineData = computed(() => screenData.value);

</script>

<style scoped>
.container-main {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>