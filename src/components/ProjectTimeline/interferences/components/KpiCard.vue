<template>
    <v-card class="kpi" rounded="xl" elevation="2">
        <v-card-text class="kpi-body">
            <div class="kpi-top">
                <v-icon size="18" :class="toneIconClass(vm.tone)">{{ vm.icon }}</v-icon>
                <div class="kpi-label" :class="toneTextClass(vm.tone)">{{ vm.label }}</div>
            </div>

            <div class="kpi-value" :class="toneValueClass(vm.tone)">{{ vm.value }}</div>
            <div class="kpi-sub">{{ vm.sublabel }}</div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type { InterferenceKpiVm, Tone } from "../types";
defineProps<{ vm: InterferenceKpiVm }>();

function toneTextClass(t: Tone) {
    return t === "critical" ? "t-critical" : t === "risk" ? "t-risk" : "t-ok";
}
function toneValueClass(t: Tone) {
    return t === "critical" ? "v-critical" : t === "risk" ? "v-risk" : "v-ok";
}
function toneIconClass(t: Tone) {
    return t === "critical" ? "i-critical" : t === "risk" ? "i-risk" : "i-ok";
}
</script>

<style scoped>
.kpi {
    border-radius: 18px;
}

.kpi-body {
    padding: 14px;
}

.kpi-top {
    display: flex;
    align-items: center;
    gap: 8px;
}

.kpi-label {
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 1px;
}

.kpi-value {
    margin-top: 8px;
    font-size: 28px;
    font-weight: 900;
    color: #0e1730;
}

.kpi-sub {
    margin-top: 2px;
    font-size: 12px;
    color: #93a1b4;
    font-weight: 700;
}

.t-ok {
    color: #2563eb;
}

.t-risk {
    color: #f97316;
}

.t-critical {
    color: #ef4444;
}

.v-ok {
    color: #0e1730;
}

.v-risk {
    color: #ef4444;
}

.v-critical {
    color: #ef4444;
}

.i-ok {
    color: #2563eb;
}

.i-risk {
    color: #f97316;
}

.i-critical {
    color: #ef4444;
}
</style>
