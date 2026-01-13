<template>
    <v-card class="it" rounded="xl" elevation="2">
        <div class="bar" :class="sevBarClass(vm.severity)" />

        <v-card-text class="it-body">
            <div class="it-top">
                <div class="it-meta">
                    <span class="it-tag">{{ vm.idTag }}</span>
                    <span class="it-date">{{ vm.dateLabel }}</span>
                </div>

                <v-chip class="sev" size="small" variant="tonal" :class="sevChipClass(vm.severity)">
                    {{ vm.severity }}
                </v-chip>
            </div>

            <div class="it-title">{{ vm.title }}</div>

            <div class="it-grid">
                <div class="cell">
                    <div class="cell-label">{{ vm.stageLabel }}</div>
                    <div class="cell-val">{{ vm.stageValue }}</div>
                </div>
                <div class="cell">
                    <div class="cell-label">{{ vm.impactLabel }}</div>
                    <div class="cell-val impact">{{ vm.impactValue }}</div>
                </div>
                <div class="cell right">
                    <div class="cell-label">{{ vm.milestoneLabel }}</div>
                    <div class="cell-val milestone">
                        <v-icon size="16">mdi-flag-outline</v-icon>
                        {{ vm.milestoneValue }}
                    </div>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type { InterferenceItemVm, InterferenceSeverity } from "../types";

defineProps<{ vm: InterferenceItemVm }>();

function sevBarClass(s: InterferenceSeverity) {
    return s === "Crítico" ? "b-crit" : s === "Alto" ? "b-alto" : s === "Médio" ? "b-med" : "b-baixo";
}
function sevChipClass(s: InterferenceSeverity) {
    return s === "Crítico" ? "c-crit" : s === "Alto" ? "c-alto" : s === "Médio" ? "c-med" : "c-baixo";
}
</script>

<style scoped>
.it {
    position: relative;
    overflow: hidden;
    border-radius: 18px;
}

.bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6px;
}

.b-crit {
    background: #ef4444;
}

.b-alto {
    background: #f97316;
}

.b-med {
    background: #fb923c;
}

.b-baixo {
    background: #facc15;
}

.it-body {
    padding: 14px 14px 12px 14px;
}

.it-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.it-meta {
    display: flex;
    gap: 10px;
    align-items: center;
    color: #93a1b4;
    font-weight: 800;
    font-size: 11px;
}

.it-tag {
    background: #eef2f8;
    color: #6b7892;
    padding: 4px 8px;
    border-radius: 999px;
    font-weight: 900;
}

.it-date {
    font-weight: 800;
}

.sev {
    font-weight: 900;
    border-radius: 999px;
}

.c-crit {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.12);
}

.c-alto {
    color: #f97316;
    background: rgba(249, 115, 22, 0.12);
}

.c-med {
    color: #fb923c;
    background: rgba(251, 146, 60, 0.14);
}

.c-baixo {
    color: #ca8a04;
    background: rgba(250, 204, 21, 0.14);
}

.it-title {
    margin-top: 10px;
    font-size: 13px;
    font-weight: 900;
    color: #0e1730;
    line-height: 1.25;
}

.it-grid {
    margin-top: 12px;
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 12px;
    align-items: start;
}

.cell-label {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.8px;
    color: #9aa6b6;
    text-transform: uppercase;
}

.cell-val {
    margin-top: 4px;
    font-size: 12px;
    font-weight: 900;
    color: #0e1730;
}

.cell-val.impact {
    color: #ef4444;
}

.cell.right {
    text-align: right;
}

.cell-val.milestone {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #0e1730;
}
</style>
