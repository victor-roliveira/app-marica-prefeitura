<template>
    <div class="pd-wrap">
        <!-- HEADER -->
        <div class="pd-header">
            <!-- Linha 1: Título + Relatória -->
            <div class="pd-row1">
                <h1 class="pd-title">{{ vm.title }}</h1>

                <v-btn v-if="vm.actions?.onReport" class="pd-report-btn" rounded="xl" size="small" variant="flat"
                    @click="vm.actions.onReport()">
                    <v-icon start size="18">{{ vm.actions.reportIcon ?? "mdi-sparkles" }}</v-icon>
                    {{ vm.actions.reportLabel ?? "RELATÓRIA" }}
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

                <v-btn v-if="vm.actions?.onOsObject" class="pd-oslink" variant="text" size="small"
                    @click="vm.actions.onOsObject()">
                    <v-icon start size="18">{{ vm.actions.osObjectIcon ?? "mdi-file-document-outline" }}</v-icon>
                    {{ vm.actions.osObjectLabel ?? "OBJETO DA OS" }}
                </v-btn>
            </div>

            <!-- Linha 3: atualizado -->
            <div v-if="vm.updatedText" class="pd-updated">
                <v-icon size="18">mdi-update</v-icon>
                <span>{{ vm.updatedText }}</span>
            </div>
        </div>

        <!-- KPIs (2x2) -->
        <div class="pd-kpis">
            <!-- Entrega prevista -->
            <div class="pd-card">
                <div class="pd-iconbox">
                    <v-icon size="22">mdi-calendar</v-icon>
                </div>

                <div class="pd-meta">
                    <div class="pd-label">{{ vm.kpis.expectedDeliveryLabel ?? "ENTREGA PREVISTA" }}</div>
                    <div class="pd-value">{{ fmtDate(vm.kpis.expectedDelivery) }}</div>
                </div>
            </div>

            <!-- Avanço físico -->
            <div class="pd-card">
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
            </div>

            <!-- Dias de atraso -->
            <div class="pd-card pd-card-warn">
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

                <!-- bolha decorativa (canto sup. direito) -->
                <div class="pd-blob" />
            </div>

            <!-- Status geral -->
            <div class="pd-card">
                <div class="pd-iconbox pd-iconbox-red">
                    <v-icon size="22">mdi-hospital-box</v-icon>
                </div>

                <div class="pd-meta">
                    <div class="pd-label">{{ vm.kpis.overallStatusLabel ?? "STATUS GERAL" }}</div>
                    <div class="pd-value pd-status-risk">
                        {{ vm.kpis.overallStatus }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ProjectDetailsViewModel } from './projectDetailsTypes';

const props = defineProps<{ vm: ProjectDetailsViewModel }>();

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
/* ====== Tokens (cores iguais ao print) ====== */
.pd-wrap {
    padding: 8px 0 4px;
    font-family: 'Montserrat';
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

/* chips cinza claro */
.pd-chip {
    background: #eef2f6;
    color: #2c3a4b;
    font-weight: 800;
    border-radius: 999px;
}

/* botão azul "Relatória" */
.pd-report-btn {
    background: #2563eb;
    /* azul do print */
    color: #ffffff;
    font-weight: 400;
    letter-spacing: 0.2px;
    text-transform: none;
}

/* link "Objeto da OS" azul */
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

/* ====== KPIs grid ====== */
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
    box-shadow:
        0 1px 0 rgba(12, 16, 24, 0.06),
        0 8px 18px rgba(12, 16, 24, 0.05);
    padding: 14px 14px;
    min-height: 96px;
    display: flex;
    align-items: center;
    gap: 12px;
}

/* ícone em quadrado cinza */
.pd-iconbox {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #f3f5f8;
    display: grid;
    place-items: center;
    color: #0b1220;
}

/* variações do ícone (para ficar idêntico ao print) */
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
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #67768b;
        font-size: 10px;
}

.pd-value {
    font-size: 12px;
    font-weight: 900;
    color: #0b1220;
    line-height: 1.1;
}

/* Tag "On Track" */
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

/* atraso: +14 vermelho e "dias" cinza */
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

/* Status geral (Em Risco em vermelho) */
.pd-status-risk {
    color: #ef4444;
}

/* bolha decorativa (card “Dias de atraso”) */
.pd-card-warn {
    overflow: hidden;
}

.pd-blob {
    position: absolute;
    right: -22px;
    top: -18px;
    width: 72px;
    height: 72px;
    border-radius: 999px;
    background: rgba(245, 158, 11, 0.18);
}

/* Responsivo (mantém 2 colunas no print; cai para 1 em telas bem pequenas) */
@media (max-width: 360px) {
    .pd-kpis {
        grid-template-columns: 1fr;
    }
}
</style>
