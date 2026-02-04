<template>
    <div class="page">
        <div class="topbar">
            <v-btn icon variant="text" @click="onBack">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <div class="topbar-title">{{ vm?.header.title }}</div>
        </div>

        <div v-if="isLoading || !vm" class="d-flex justify-center align-center h-100 mt-10">
            <v-progress-circular indeterminate color="primary" size="40" />
        </div>

        <div v-else class="content">
            
            <PhysicalSummaryCard :vm="vm.summary" />

            <MacroStagesCard v-if="macroStagesVm" :vm="macroStagesVm" />

            <v-card class="card" rounded="xl" elevation="2">
                <v-card-text class="card-body">
                    <SectionHeader :title="vm.milestonesEvolution.title"
                        :rightLabel="vm.milestonesEvolution.deltaLabelRight"
                        :rightValue="vm.milestonesEvolution.deltaValue" 
                        :rightTone="vm.milestonesEvolution.deltaTone" />
                    <MilestonesEvolutionChart :vm="vm.milestonesEvolution" />
                </v-card-text>
            </v-card>

            <v-card class="card" rounded="xl" elevation="2">
                <v-card-text class="card-body">
                    <SectionTitle :title="vm.progressComparison.title" />
                    <ProgressComparisonChart :vm="vm.progressComparison" />
                    <div class="footnote">{{ vm.progressComparison.footnote }}</div>
                </v-card-text>
            </v-card>

            <v-card class="card" rounded="xl" elevation="2">
                <v-card-text class="card-body">
                    <SectionTitle :title="vm.monthlyExecutionPace.title" />
                    <MonthlyExecutionPaceChart :vm="vm.monthlyExecutionPace" />
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

// === MUDANÇA 1: Usar o Composable Global ===
import { useActiveProject } from "../../../../composables/useActiveProject"; 

// Types (ajuste os caminhos conforme sua pasta)
import type { PhysicalProgressViewModel } from "../types";
import type { MacroStagesVm } from "../../helpers/macroTypes"; // Use o tipo global correto

// Componentes
import PhysicalSummaryCard from "./PhysicalSummaryCard.vue";
import SectionHeader from "./SectionHeader.vue";
import SectionTitle from "./SectionTitle.vue";
import MilestonesEvolutionChart from "./charts/MilestonesEvolutionChart.vue";
import ProgressComparisonChart from "./charts/ProgressComparisonChart.vue";
import MonthlyExecutionPaceChart from "./charts/MonthlyExecutionPaceChart.vue";
import MacroStagesCard from "../../macroStages/MacroStagesCard.vue";

const router = useRouter();

// === MUDANÇA 2: Consumir dados reais ===
const { screenData, isLoading } = useActiveProject();

const vm = computed<PhysicalProgressViewModel | undefined>(() => {
    return screenData.value?.physicalProgress;
});

const macroStagesVm = computed<MacroStagesVm | undefined>(() => {
    return screenData.value?.macro;
});

function onBack() {
    router.back();
}
</script>

<style scoped>
/* Mantendo seus estilos originais */
.page {
    background: #f3f6fb;
    min-height: 100vh; /* Ajuste para cobrir a tela */
    font-family: "Montserrat";
}

.topbar {
    height: 56px;
    display: grid;
    grid-template-columns: 56px 1fr 56px;
    align-items: center;
    background: #ffffff;
    border-bottom: 1px solid #eef2f8;
}

.topbar-title {
    text-align: center;
    font-weight: 900;
    color: #0e1730;
}

.content {
    padding: 14px 14px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.card {
    border-radius: 18px;
}

.card-body {
    padding: 14px;
}

.footnote {
    margin-top: 10px;
    font-size: 11.5px;
    color: #93a1b4;
    line-height: 1.45;
    font-style: italic;
}

@media (min-width: 1024px) {
    .content {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        align-items: stretch;
    }

    .content > :nth-child(1),
    .content > :nth-child(2) {
        grid-column: 1 / -1;
    }

    .card {
        height: 100%;
        display: flex;
    }

    .card-body {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
}
</style>