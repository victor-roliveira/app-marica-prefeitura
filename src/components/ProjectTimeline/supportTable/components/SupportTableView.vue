<template>
    <div class="page">
        <div class="topbar">
            <v-btn icon variant="text" @click="onBack">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <div class="topbar-title">{{ vm?.headerTitle }}</div>

            <div />
        </div>

        <div v-if="isLoading || !vm" class="d-flex justify-center align-center h-100 mt-10">
            <v-progress-circular indeterminate color="primary" size="40" />
        </div>

        <div v-else class="content">
            <SupportTabs v-model="tab" :vm="vm.tabs" />

            <v-card class="card" rounded="xl" elevation="2">
                <v-card-text class="card-body">
                    <TableHeader :vm="vm.columns" />
                    
                    <div class="rows">
                        <div v-if="filteredRows.length === 0" class="pa-6 text-center text-grey text-caption">
                            Nenhum item encontrado neste filtro.
                        </div>

                        <SupportRow v-for="(r, idx) in filteredRows" :key="idx" :vm="r" />
                    </div>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

// === MUDANÇA 1: Importar Composable e Types ===
import { useActiveProject } from "../../../../composables/useActiveProject"; 
import type { SupportTableViewModel, SupportTabKey } from "../types";

// (Removemos os Mocks aqui)

import SupportTabs from "./SupportTabs.vue";
import TableHeader from "./TableHeader.vue";
import SupportRow from "./SupportRow.vue";

const router = useRouter();

// === MUDANÇA 2: Consumir dados globais ===
const { screenData, isLoading } = useActiveProject();

const vm = computed<SupportTableViewModel | undefined>(() => {
    return screenData.value?.supportTable;
});

const tab = ref<SupportTabKey>("all");

const filteredRows = computed(() => {
    // Proteção: Se vm ainda não carregou, retorna array vazio
    if (!vm.value) return [];

    const rows = vm.value.rows;

    if (tab.value === "all") return rows;
    if (tab.value === "late") return rows.filter((r) => r.situation === "Atrasado");
    if (tab.value === "done") return rows.filter((r) => r.situation === "Concluída");
    // "progress"
    return rows.filter((r) => r.situation === "Em Andamento");
});

function onBack() {
    router.back();
}
</script>

<style scoped>
/* Seus estilos originais mantidos */
.page {
    background: #f3f6fb;
    min-height: 100vh; /* Ajustado para cobrir a tela toda */
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
    gap: 12px;
}

.card {
    border-radius: 18px;
    overflow: hidden;
}

.card-body {
    padding: 0;
}

.rows {
    display: flex;
    flex-direction: column;
}
</style>