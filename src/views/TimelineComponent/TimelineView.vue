<template>
    <v-container fluid>
        <div class="container-main">
            <ProjectDetailsHeader :vm="detailsVm" />

            <ProjectTimeline :data="batalhaoMock" />
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { batalhaoMock } from "../../components/ProjectTimeline/mock";
import ProjectDetailsHeader from "../../components/ProjectTimeline/ProjectDetailsHeader.vue";
import type { ProjectDetailsViewModel } from "../../components/ProjectTimeline/projectDetailsTypes";
import ProjectTimeline from "../../components/ProjectTimeline/ProjectTimeline.vue";

// Mock do header/KPIs (depois vem da planilha/serviço)
const detailsVm: ProjectDetailsViewModel = {
    title: "BATALHÃO",
    chips: [
        { icon: "mdi-pound", label: "#2023-8841" },
        { icon: "mdi-domain", label: "Sec. de Educação" },
    ],
    updatedText: "ATUALIZADO: HOJE, 09:30",
    actions: {
        reportLabel: "Relatório IA",
        reportIcon: "mdi-creation",
        onReport: () => { },
        osObjectLabel: "OBJETO DA OS",
        osObjectIcon: "mdi-file-document-outline",
        onOsObject: () => { },
    },
    kpis: {
        expectedDelivery: "2024-11-12",
        physicalProgressPercent: 68,
        physicalTag: "On Track",
        delayDays: 14,
        overallStatus: "Em Risco",
    },
};

</script>

<style scoped>
h1 {
    font-family: 'Montserrat';
    font-weight: 400 !important;
    font-size: 15px;
}

@media (max-width: 768px) {}
</style>