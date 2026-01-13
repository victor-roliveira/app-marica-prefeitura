<template>
    <div class="page">
        <div class="topbar">
            <v-btn icon variant="text" @click="onBack">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <div class="topbar-title">{{ vm.headerTitle }}</div>

            <div />
        </div>

        <div class="content">
            <SupportTabs v-model="tab" :vm="vm.tabs" />

            <v-card class="card" rounded="xl" elevation="2">
                <v-card-text class="card-body">
                    <TableHeader :vm="vm.columns" />
                    <div class="rows">
                        <SupportRow v-for="(r, idx) in filteredRows" :key="idx" :vm="r" />
                    </div>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import type { SupportTableViewModel, SupportTabKey } from "../types";
import { supportTableFallbackMock, supportTableMockByProjectId } from "../mock";

import SupportTabs from "./SupportTabs.vue";
import TableHeader from "./TableHeader.vue";
import SupportRow from "./SupportRow.vue";

const route = useRoute();
const router = useRouter();

const projectId = computed(() => String(route.params.projectId ?? ""));

const vm = computed<SupportTableViewModel>(() => {
    return supportTableMockByProjectId[projectId.value] ?? supportTableFallbackMock;
});

const tab = ref<SupportTabKey>("all");

const filteredRows = computed(() => {
    const rows = vm.value.rows;

    if (tab.value === "all") return rows;
    if (tab.value === "late") return rows.filter((r) => r.situation === "Atrasado");
    if (tab.value === "done") return rows.filter((r) => r.situation === "Concluída");
    return rows.filter((r) => r.situation === "Em Andamento");
});

function onBack() {
    router.back();
}
</script>

<style scoped>
.page {
    background: #f3f6fb;
    min-height: 100%;
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
