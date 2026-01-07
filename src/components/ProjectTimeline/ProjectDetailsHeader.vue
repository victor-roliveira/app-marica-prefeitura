<template>
    <div class="pd-root">
        <!-- Título + ícones do topo (menu e sair ficam na View, aqui só o conteúdo) -->
        <div class="pd-title-row">
            <div class="pd-title">
                <div class="pd-title-text">{{ vm.title }}</div>

                <div v-if="vm.chips?.length" class="pd-chips">
                    <v-chip v-for="(c, i) in vm.chips" :key="i" size="small" class="pd-chip" variant="tonal">
                        <v-icon v-if="c.icon" start size="16">{{ c.icon }}</v-icon>
                        {{ c.label }}
                    </v-chip>
                </div>

                <div v-if="vm.updatedText" class="pd-updated">
                    <v-icon size="16" class="mr-1">mdi-update</v-icon>
                    <span>{{ vm.updatedText }}</span>
                </div>
            </div>

            <!-- Ações (direita) -->
            <div class="pd-actions" v-if="hasAnyAction">
                <v-btn v-if="vm.actions?.onReport" size="small" class="pd-action-btn" rounded="xl" variant="flat"
                    @click="vm.actions.onReport()">
                    <v-icon start size="18">{{ vm.actions.reportIcon ?? "mdi-file-chart" }}</v-icon>
                    {{ vm.actions.reportLabel ?? "RELATÓRIA" }}
                </v-btn>

                <v-btn v-if="vm.actions?.onOsObject" size="small" class="pd-action-btn" rounded="xl" variant="text"
                    @click="vm.actions.onOsObject()">
                    <v-icon start size="18">{{ vm.actions.osObjectIcon ?? "mdi-file-document-outline" }}</v-icon>
                    {{ vm.actions.osObjectLabel ?? "OBJETO DA OS" }}
                </v-btn>
            </div>
        </div>

        <!-- KPIs (2 colunas no mobile, 4 no desktop quando houver espaço) -->
        <v-row class="mt-4" dense>
            <!-- Entrega prevista -->
            <v-col cols="12" sm="6" md="3">
                <v-card class="pd-kpi" rounded="xl" elevation="1">
                    <v-card-text class="pd-kpi-body">
                        <div class="pd-kpi-icon">
                            <v-icon size="22">mdi-calendar</v-icon>
                        </div>
                        <div class="pd-kpi-meta">
                            <div class="pd-kpi-label">
                                {{ vm.kpis.expectedDeliveryLabel ?? "ENTREGA PREVISTA" }}
                            </div>
                            <div class="pd-kpi-value">
                                {{ fmtDate(vm.kpis.expectedDelivery) }}
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Avanço físico -->
            <v-col cols="12" sm="6" md="3">
                <v-card class="pd-kpi" rounded="xl" elevation="1">
                    <v-card-text class="pd-kpi-body">
                        <div class="pd-kpi-icon">
                            <v-icon size="22">mdi-trending-up</v-icon>
                        </div>
                        <div class="pd-kpi-meta">
                            <div class="pd-kpi-label">
                                {{ vm.kpis.physicalProgressLabel ?? "AVANÇO FÍSICO" }}
                            </div>
                            <div class="pd-kpi-value">
                                {{ clampPercent(vm.kpis.physicalProgressPercent) }}%
                            </div>
                        </div>

                        <v-chip v-if="vm.kpis.physicalTag" size="small" class="pd-kpi-tag"
                            :class="tagClass(vm.kpis.physicalTag)" variant="flat">
                            {{ vm.kpis.physicalTag }}
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Dias de atraso -->
            <v-col cols="12" sm="6" md="3">
                <v-card class="pd-kpi" rounded="xl" elevation="1">
                    <v-card-text class="pd-kpi-body">
                        <div class="pd-kpi-icon">
                            <v-icon size="22">mdi-alert</v-icon>
                        </div>
                        <div class="pd-kpi-meta">
                            <div class="pd-kpi-label">
                                {{ vm.kpis.delayDaysLabel ?? "DIAS DE ATRASO" }}
                            </div>
                            <div class="pd-kpi-value" :class="delayClass(vm.kpis.delayDays)">
                                {{ formatDelay(vm.kpis.delayDays) }}
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Status geral -->
            <v-col cols="12" sm="6" md="3">
                <v-card class="pd-kpi" rounded="xl" elevation="1">
                    <v-card-text class="pd-kpi-body">
                        <div class="pd-kpi-icon">
                            <v-icon size="22">mdi-hospital-box</v-icon>
                        </div>
                        <div class="pd-kpi-meta">
                            <div class="pd-kpi-label">
                                {{ vm.kpis.overallStatusLabel ?? "STATUS GERAL" }}
                            </div>
                            <div class="pd-kpi-value" :class="statusClass(vm.kpis.overallStatus)">
                                {{ vm.kpis.overallStatus }}
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ProjectDetailsViewModel, HealthStatus } from "./projectDetailsTypes";

const props = defineProps<{
    vm: ProjectDetailsViewModel;
}>();

const hasAnyAction = computed(() => !!props.vm.actions?.onReport || !!props.vm.actions?.onOsObject);

function fmtDate(iso: string) {
    // Mantém simples e previsível: pode substituir por date-fns depois.
    // Espera "YYYY-MM-DD"
    const [y, m, d] = iso.split("-");
    if (!y || !m || !d) return iso;
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const mm = Number(m);
    const label = months[mm - 1] ?? m;
    return `${d} ${label} ${y}`;
}

function clampPercent(n: number) {
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
}

function formatDelay(days: number) {
    const d = Math.round(days);
    if (d === 0) return "0 dias";
    if (d > 0) return `+${d} dias`;
    return `${d} dias`; // negativo = adiantado
}

function tagClass(tag: HealthStatus) {
    return tag === "On Track" ? "pd-tag-ok" : tag === "Em Risco" ? "pd-tag-risk" : "pd-tag-crit";
}

function delayClass(days: number) {
    if (days > 0) return "pd-delay-bad";
    if (days < 0) return "pd-delay-good";
    return "pd-delay-neutral";
}

function statusClass(s: HealthStatus) {
    return s === "On Track" ? "pd-status-ok" : s === "Em Risco" ? "pd-status-risk" : "pd-status-crit";
}
</script>

<style scoped>
.pd-root {
    padding: 8px 2px;
}

.pd-title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
}

.pd-title-text {
    font-size: 28px;
    font-weight: 800;
    line-height: 1.05;
}

.pd-chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 10px;
}

.pd-chip {
    border-radius: 999px;
}

.pd-updated {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    font-size: 12px;
    opacity: 0.75;
    letter-spacing: 0.3px;
    text-transform: uppercase;
}

.pd-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.pd-action-btn {
    text-transform: none;
    font-weight: 700;
}

/* KPI */
.pd-kpi {
    border: 1px solid rgba(0, 0, 0, 0.06);
}

.pd-kpi-body {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    padding: 16px;
}

.pd-kpi-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, 0.04);
}

.pd-kpi-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.pd-kpi-label {
    font-size: 12px;
    letter-spacing: 0.4px;
    opacity: 0.7;
    text-transform: uppercase;
    font-weight: 700;
}

.pd-kpi-value {
    font-size: 22px;
    font-weight: 900;
}

.pd-kpi-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    font-weight: 800;
    border-radius: 999px;
}

/* Tags/status colors (sem depender do theme) */
.pd-tag-ok,
.pd-status-ok {
    background: rgba(46, 125, 50, 0.14);
}

.pd-tag-risk,
.pd-status-risk {
    background: rgba(198, 40, 40, 0.12);
}

.pd-tag-crit,
.pd-status-crit {
    background: rgba(255, 143, 0, 0.18);
}

.pd-delay-bad {
    color: #d32f2f;
}

.pd-delay-good {
    color: #2e7d32;
}

.pd-delay-neutral {
    opacity: 0.75;
}

/* Mobile fine-tuning */
@media (max-width: 420px) {
    .pd-title-text {
        font-size: 24px;
    }
}
</style>
