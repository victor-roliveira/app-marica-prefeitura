<template>
    <div class="page">
        <div class="topbar">
            <v-btn icon variant="text" @click="onBack">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <div class="topbar-title">{{ vm?.title ?? 'Carregando...' }}</div>
        </div>

        <div v-if="isLoading || !vm || !vm.deadlineCard" class="d-flex justify-center align-center h-100 mt-10">
            <v-progress-circular indeterminate color="primary" size="40" />
            <div class="mt-4 text-caption text-grey">Carregando dados...</div>
        </div>

        <div v-else class="content">
            
            <div class="section">
                <div class="section-title">Prazo Planejado x Atual</div>

                <v-card class="card" rounded="xl" elevation="2">
                    <v-card-text class="card-body">
                        <div class="deadline-grid">
                            <div>
                                <div class="miniLabel">PLANEJADO</div>
                                <div class="dateStrong">{{ fmtDate(vm.deadlineCard?.plannedDate) }}</div>
                            </div>

                            <div class="right">
                                <div class="miniLabel">PREVISTO ATUAL</div>
                                <div class="dateStrong accent">{{ fmtDate(vm.deadlineCard?.currentForecastDate) }}</div>
                            </div>
                        </div>

                        <div class="barWrap">
                            <div class="barBase">
                                <div class="barFill" :style="{ width: clamp(vm.deadlineCard?.progressPct ?? 0) + '%' }" />
                            </div>
                        </div>

                        <div class="deadline-foot">
                            <div class="startLabel">{{ vm.deadlineCard?.startLabel }}</div>

                            <v-chip size="small" variant="tonal" class="deltaChip"
                                :class="toneClass(vm.deadlineCard?.tone)">
                                {{ vm.deadlineCard?.deltaLabel }}
                            </v-chip>
                        </div>
                    </v-card-text>
                </v-card>
            </div>

            <div class="section">
                <div class="section-row">
                    <div class="section-title">{{ vm.delayByDisciplineTitle }}</div>
                    <div class="tag">{{ vm.delayByDisciplineTag }}</div>
                </div>

                <v-card class="card" rounded="xl" elevation="2">
                    <v-card-text class="card-body">
                        <div v-if="!vm.delayItems || vm.delayItems.length === 0" class="pa-6 text-center text-grey text-caption">
                            Nenhum atraso registrado.
                        </div>

                        <div v-else class="delayList">
                            <div v-for="(d, idx) in vm.delayItems" :key="idx" class="delayItem">
                                <div class="delayHead">
                                    <div class="delayName">{{ d.name }}</div>
                                    <div class="delayValue" :class="toneTextClass(d.tone)">
                                        {{ d.delayDays === 0 ? "On time" : `+${d.delayDays} dias` }}
                                    </div>
                                </div>

                                <div class="delayBarBase">
                                    <div class="delayBarFill" :class="toneFillClass(d.tone)"
                                        :style="{ width: delayWidth(d.delayDays) + '%' }" />
                                </div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </div>

            <div class="section">
                <div class="section-title">{{ vm.impactTitle }}</div>

                <v-card class="card" rounded="xl" elevation="2">
                    <v-card-text class="card-body center-body">
                        <ImpactDonutChart 
                            v-if="vm.impact"
                            :items="vm.impact.items" 
                            :totalPctLabel="vm.impact.totalPctLabel"
                            :subtitle="vm.impact.subtitle" 
                        />
                    </v-card-text>
                </v-card>
            </div>

            <div class="section">
                <div class="section-title">{{ vm.plannedRealizedTitle }}</div>

                <v-card class="card" rounded="xl" elevation="2">
                    <v-card-text class="card-body">
                        <PlannedRealizedChart 
                            v-if="vm.plannedRealized" 
                            :vm="vm.plannedRealized" 
                        />
                    </v-card-text>
                </v-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useActiveProject } from "../../../../composables/useActiveProject";
import type { DeliveryAnalysisViewModel, DeliveryStatusTone } from "../types";

import ImpactDonutChart from "./charts/ImpactDonutChart.vue";
import PlannedRealizedChart from "./PlannedRealizedChart.vue";

const router = useRouter();
const { screenData, isLoading } = useActiveProject();

const vm = computed<DeliveryAnalysisViewModel | undefined>(() => {
    return screenData.value?.deliveryAnalysis;
});

function onBack() {
    router.back();
}

function clamp(v: number) {
    return Math.max(0, Math.min(100, v));
}

function toneClass(t: DeliveryStatusTone | undefined) {
    if (!t) return "";
    return t === "critical" ? "t-critical" : t === "risco" ? "t-risco" : "t-ok";
}

function delayWidth(days: number) {
    const max = 20;
    return clamp((Math.max(0, days) / max) * 100);
}

function fmtDate(iso: string | undefined) {
    if (!iso) return "--/--";
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return iso;
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${String(d).padStart(2, "0")} ${months[(m ?? 1) - 1]} ${y}`;
}

function toneTextClass(t: DeliveryStatusTone) {
    return t === "critical" ? "tone-text-critical" : t === "risco" ? "tone-text-risk" : "tone-text-ok";
}

function toneFillClass(t: DeliveryStatusTone) {
    return t === "critical" ? "tone-fill-critical" : t === "risco" ? "tone-fill-risk" : "tone-fill-ok";
}
</script>

<style scoped>
/* (Mantenha seus estilos originais) */
.page { background: #f3f6fb; min-height: 100vh; font-family: 'Montserrat'; }
.topbar { height: 56px; display: grid; grid-template-columns: 56px 1fr 56px; align-items: center; background: #ffffff; border-bottom: 1px solid #eef2f8; }
.topbar-title { text-align: center; font-weight: 900; color: #0e1730; }
.content { padding: 14px 14px 20px; display: grid; grid-template-columns: 1fr; gap: 18px; }
@media (min-width: 960px) { .content { grid-template-columns: 1fr 1fr; } }
.section { display: flex; flex-direction: column; height: 100%; }
.section-title { font-size: 18px; font-weight: 900; color: #0e1730; margin: 6px 2px 10px; flex: 0 0 auto; }
.section-row { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; flex: 0 0 auto; }
.tag { font-size: 12px; font-weight: 900; color: #f97316; }
.card { border-radius: 18px; width: 100%; flex: 1; display: flex; flex-direction: column; }
.card-body { padding: 14px; width: 100%; flex: 1; display: flex; flex-direction: column; }
.center-body { justify-content: center; align-items: center; }
.deadline-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.right { text-align: right; }
.miniLabel { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; color: #7b879b; }
.dateStrong { margin-top: 4px; font-size: 18px; font-weight: 900; color: #0e1730; }
.dateStrong.accent { color: #2563eb; }
.barWrap { margin-top: 12px; }
.barBase { height: 8px; background: #eef2f8; border-radius: 999px; overflow: hidden; }
.barFill { height: 100%; background: #2563eb; border-radius: 999px; }
.deadline-foot { margin-top: 12px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.startLabel { font-size: 12px; color: #93a1b4; font-weight: 700; }
.deltaChip { font-weight: 900; }
.delayList { display: flex; flex-direction: column; gap: 14px; }
.delayHead { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.delayName { font-weight: 800; color: #0e1730; font-size: 13px; }
.delayValue { font-weight: 900; font-size: 12px; }
.delayBarBase { margin-top: 8px; height: 6px; background: #eef2f8; border-radius: 999px; overflow: hidden; }
.delayBarFill { height: 100%; border-radius: 999px; }
.tone-text-critical { color: #ef4444; }
.tone-text-risk { color: #f97316; }
.tone-text-ok { color: #16a34a; }
.tone-fill-critical { background-color: #ef4444; }
.tone-fill-risk { background-color: #f97316; }
.tone-fill-ok { background-color: #16a34a; }
.t-critical { color: #ef4444 !important; }
.t-risco { color: #f97316 !important; }
.t-ok { color: #16a34a !important; }
</style>