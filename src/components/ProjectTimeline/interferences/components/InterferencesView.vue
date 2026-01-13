<template>
    <div class="page">
        <div class="topbar">
            <v-btn icon variant="text" @click="onBack">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <div class="topbar-title">{{ vm.headerTitle }}</div>
        </div>

        <div class="content">
            <div class="kpi-row">
                <KpiCard :vm="vm.kpis.active" />
                <KpiCard :vm="vm.kpis.impact" />
            </div>

            <div class="section-head">
                <div class="section-title">{{ vm.list.title }}</div>
                <div class="section-right">{{ vm.list.rightLabel }}</div>
            </div>

            <div class="list">
                <InterferenceCard v-for="(it, idx) in vm.list.items" :key="idx" :vm="it" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import type { InterferencesViewModel } from "../types";
import { interferencesFallbackMock, interferencesMockByProjectId } from "../mock";

import KpiCard from "./KpiCard.vue";
import InterferenceCard from "./InterferenceCard.vue";

const route = useRoute();
const router = useRouter();

const projectId = computed(() => String(route.params.projectId ?? ""));

const vm = computed<InterferencesViewModel>(() => {
    return interferencesMockByProjectId[projectId.value] ?? interferencesFallbackMock;
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
    gap: 14px;
}

.kpi-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.section-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 4px;
}

.section-title {
    font-size: 18px;
    font-weight: 900;
    color: #0e1730;
}

.section-right {
    font-size: 12px;
    font-weight: 800;
    color: #7b879b;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>
