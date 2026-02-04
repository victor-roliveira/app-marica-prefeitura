<template>
    <div class="pd-wrap" v-if="vm">
        <!-- HEADER -->
        <div class="pd-header">
            <!-- Linha 1: Título + Relatório -->
            <div class="pd-row1">
                <h1 class="pd-title">{{ vm.title }}</h1>

                <v-btn v-if="hasReportAction" class="pd-report-btn" rounded="xl" size="small" variant="flat"
                    @click="handleReport()">
                    <v-icon start size="18">{{ vm.actions?.reportIcon ?? "mdi-sparkles" }}</v-icon>
                    {{ vm.actions?.reportLabel ?? "Relatório" }}
                </v-btn>
            </div>

            <!-- Linha 2: chips + Objeto da OS -->
            <div class="pd-row2">
                <div class="pd-chips" v-if="vm.chips?.length">
                    <v-chip v-for="(c, i) in vm.chips" :key="i" class="pd-chip" size="small" variant="flat">
                        <v-icon v-if="c.icon" start size="16">{{ c.icon }}</v-icon>
                        {{ c.label }}
                    </v-chip>
                </div>

                <v-btn v-if="hasOsAction" class="pd-oslink" variant="text" size="small" @click="handleOsObject()">
                    <v-icon start size="18">{{ vm.actions?.osObjectIcon ?? "mdi-file-document-outline" }}</v-icon>
                    {{ vm.actions?.osObjectLabel ?? "Objeto da OS" }}
                </v-btn>
            </div>

            <div v-if="vm.updatedText" class="pd-updated">
                <v-icon size="18">mdi-update</v-icon>
                <span>{{ vm.updatedText }}</span>
            </div>
        </div>

        <!-- KPIs (2x2) -->
        <div class="pd-kpis">
            <!-- Entrega prevista -->
            <!-- Entrega prevista (CLICÁVEL) -->
            <button type="button" class="pd-card pd-card-clickable" @click="goToDeliveryAnalysis"
                @keydown.enter.prevent="goToDeliveryAnalysis" @keydown.space.prevent="goToDeliveryAnalysis"
                aria-label="Abrir Análise de Entrega">
                <div class="pd-iconbox">
                    <v-icon size="22">mdi-calendar</v-icon>
                </div>

                <div class="pd-meta">
                    <div class="pd-label">{{ vm.kpis.expectedDeliveryLabel ?? "ENTREGA PREVISTA" }}</div>
                    <div class="pd-value">{{ fmtDate(vm.kpis.expectedDelivery) }}</div>
                </div>

                <v-icon class="pd-chev" size="18">mdi-chevron-right</v-icon>
            </button>

            <!-- Avanço físico -->
            <button type="button" class="pd-card pd-card-clickable" @click="goToPhysicalProgress"
                @keydown.enter.prevent="goToPhysicalProgress" @keydown.space.prevent="goToPhysicalProgress"
                aria-label="Abrir Avanço Físico">
                <div class="pd-iconbox pd-iconbox-green">
                    <v-icon size="22">mdi-trending-up</v-icon>
                </div>

                <div class="pd-meta">
                    <div class="pd-label">{{ vm.kpis.physicalProgressLabel ?? "AVANÇO FÍSICO" }}</div>
                    <div class="pd-value">{{ clampPercent(vm.kpis.physicalProgressPercent) }}%</div>
                </div>

                <div v-if="vm.kpis.physicalTag" class="pd-tag">
                    {{ vm.kpis.physicalTag }}
                </div>

                <v-icon class="pd-chev" size="18">mdi-chevron-right</v-icon>
            </button>


            <!-- Dias de atraso -->
            <button type="button" class="pd-card pd-card-warn pd-card-clickable" @click="goToInterferences"
                @keydown.enter.prevent="goToInterferences" @keydown.space.prevent="goToInterferences"
                aria-label="Abrir Interferências">
                <div class="pd-iconbox pd-iconbox-warn">
                    <v-icon size="22">mdi-alert</v-icon>
                </div>

                <div class="pd-meta">
                    <div class="pd-label">{{ vm.kpis.delayDaysLabel ?? "DIAS DE ATRASO" }}</div>
                    <div class="pd-value">
                        <span class="pd-delay-num">{{ formatDelayNumber(vm.kpis.delayDays) }}</span>
                        <span class="pd-delay-suf">dias</span>
                    </div>
                </div>

                <div class="pd-blob" />
                <v-icon class="pd-chev" size="18">mdi-chevron-right</v-icon>
            </button>

            <!-- Saúde do projeto -->
            <button type="button" class="pd-card pd-card-clickable" @click="goToSupportTable"
                @keydown.enter.prevent="goToSupportTable" @keydown.space.prevent="goToSupportTable"
                aria-label="Abrir Tabela de Apoio">
                <div class="pd-iconbox pd-iconbox-red">
                    <v-icon size="22">mdi-hospital-box</v-icon>
                </div>

                <div class="pd-meta">
                    <div class="pd-label">{{ vm.kpis.overallHealthLabel ?? "STATUS GERAL" }}</div>
                    <div class="pd-value" :class="overallHealthClass">
                        {{ vm.kpis.overallHealth }}
                    </div>
                </div>

                <v-icon class="pd-chev" size="18">mdi-chevron-right</v-icon>
            </button>

        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ProjectDetailsViewModel } from "../helpers/projectDetailsTypes";

const router = useRouter();
const route = useRoute();
const props = defineProps<{ vm: ProjectDetailsViewModel }>();
const projectId = computed(() => String(route.params.projectId ?? ""));

const hasReportAction = computed(() => Boolean(props.vm.actions?.reportRoute || props.vm.actions?.onReport));
const hasOsAction = computed(() => Boolean(props.vm.actions?.osObjectRoute || props.vm.actions?.onOsObject));

function goToDeliveryAnalysis() {
    if (!projectId.value) return;
    router.push({
        name: "project-delivery-analysis",
        params: { projectId: projectId.value },
    });
}

function goToPhysicalProgress() {
    const projectId = String(route.params.projectId ?? "");
    if (!projectId) return;
    router.push({ name: "project-physical-progress", params: { projectId } });
}

function goToInterferences() {
    const projectId = String(route.params.projectId ?? "");
    if (!projectId) return;
    router.push({ name: "project-interferences", params: { projectId } });
}

function goToSupportTable() {
    const projectId = String(route.params.projectId ?? "");
    if (!projectId) return;
    router.push({ name: "project-support-table", params: { projectId } });
}

function handleReport() {
    const route = props.vm.actions?.reportRoute;
    if (route) return router.push(route);
    props.vm.actions?.onReport?.();
}

function handleOsObject() {
    const route = props.vm.actions?.osObjectRoute;
    if (route) return router.push(route);
    props.vm.actions?.onOsObject?.();
}

const overallHealthClass = computed(() => {
    const v = props.vm.kpis.overallHealth;
    if (v === "Em Dia") return "pd-status-ok";
    if (v === "Em Risco") return "pd-status-risk";
    return "pd-status-crit"; 
});

function fmtDate(iso: string) {
    const [y, m, d] = (iso ?? "").split("-");
    if (!y || !m || !d) return iso;
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const mm = Number(m);
    return `${d} ${months[mm - 1] ?? m} ${y}`;
}

function clampPercent(n: number) {
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
}

function formatDelayNumber(days: number) {
    const d = Math.round(days);
    if (d > 0) return `+${d}`;
    if (d < 0) return `${d}`;
    return "0";
}
</script>

<style scoped>
.pd-wrap {
    padding: 8px 0 4px;
    font-family: "Montserrat";
}

.pd-header {
    padding: 4px 2px 10px;
}

.pd-title {
    font-size: 34px;
    font-weight: 900;
    letter-spacing: 0.2px;
    margin: 0;
    line-height: 1.1;
    color: #0b1220;
}

.pd-row1,
.pd-row2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.pd-row2 {
    margin-top: 10px;
}

.pd-chips {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.pd-chip {
    background: #eef2f6;
    color: #2c3a4b;
    font-weight: 800;
    border-radius: 999px;
}

.pd-report-btn {
    background: #2563eb;
    color: #ffffff;
    font-weight: 400;
    letter-spacing: 0.2px;
    text-transform: none;
}

.pd-oslink {
    color: gray;
    font-weight: 600;
    text-transform: none;
    padding-left: 10px;
    padding-right: 10px;
    border: 2px solid gray;
    border-radius: 30px;
}

.pd-updated {
    margin-top: 12px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #93a0b4;
    font-weight: 800;
    font-size: 12px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
}

.pd-kpis {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 10px;
}

.pd-card {
    position: relative;
    border-radius: 16px;
    background: #ffffff;
    border: 1px solid #eef2f6;
    box-shadow: 0 1px 0 rgba(12, 16, 24, 0.06), 0 8px 18px rgba(12, 16, 24, 0.05);
    padding: 14px 14px;
    min-height: 96px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.pd-iconbox {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    padding: 10px;
    background: #f3f5f8;
    display: grid;
    place-items: center;
    color: #0b1220;
}

.pd-iconbox-green {
    background: #eefaf2;
    color: #16a34a;
}

.pd-iconbox-warn {
    background: #fff3e9;
    color: #f97316;
}

.pd-iconbox-red {
    background: #fff1f2;
    color: #ef4444;
}

.pd-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.pd-label {
    font-weight: 600;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #67768b;
    font-size: 8px;
}

.pd-value {
    font-size: 10px;
    font-weight: 900;
    color: #0b1220;
    line-height: 1.1;
}

.pd-tag {
    position: absolute;
    right: 12px;
    top: 12px;
    background: #e9f8ee;
    color: #1f7a3b;
    font-weight: 900;
    font-size: 6px;
    padding: 4px;
    border-radius: 999px;
}

.pd-delay-num {
    color: #ef4444;
    font-weight: 900;
    margin-right: 6px;
}

.pd-delay-suf {
    color: #8b97a8;
    font-weight: 900;
    font-size: 14px;
}

.pd-status-ok {
    color: #16a34a;
}

.pd-status-risk {
    color: #ef4444;
}

.pd-status-crit {
    color: #b91c1c;
}

.pd-card-warn {
    overflow: hidden;
}

.pd-blob {
    position: absolute;
    right: -22px;
    top: -20px;
    width: 60px;
    height: 60px;
    border-radius: 999px;
    background: rgba(245, 158, 11, 0.18);
}

@media (min-width: 1024px) {
    .pd-kpis {
        grid-template-columns: repeat(4, 1fr);
    }

    .pd-label {
        font-size: 10px;
        margin-left: 40px;
    }

    .pd-value {
        font-size: 12px;
        margin-left: 40px;
    }

    .pd-chev {
        margin-left: 150px;
        transition: ease-in-out 0.3s;
    }

    .pd-chev:hover {
        scale: 1.6;
    }
}
</style>
