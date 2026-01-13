<template>
    <v-card class="sum-card" rounded="xl" elevation="2">
        <v-card-text class="sum-body">
            <div class="sum-label">{{ vm.label }}</div>

            <div class="sum-row">
                <div class="sum-big">
                    <span class="sum-pct">{{ clamp(vm.percent) }}%</span>
                    <span class="sum-suf">{{ vm.suffix }}</span>
                </div>

                <v-chip size="small" variant="tonal" class="sum-chip" :class="toneClass(vm.tone)">
                    <v-icon start size="16">mdi-alert</v-icon>
                    {{ vm.statusLabel.toUpperCase() }}
                </v-chip>
            </div>

            <div class="sum-msg">{{ vm.message }}</div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type { PhysicalProgressSummaryVm, Tone } from "../types";

defineProps<{ vm: PhysicalProgressSummaryVm }>();

function clamp(v: number) {
    return Math.max(0, Math.min(100, Math.round(v)));
}

function toneClass(t: Tone) {
    return t === "critical" ? "t-critical" : t === "risk" ? "t-risk" : "t-ok";
}
</script>

<style scoped>
.sum-card {
    border-radius: 18px;
}

.sum-body {
    padding: 16px;
}

.sum-label {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 1.1px;
    color: #9aa6b6;
}

.sum-row {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.sum-big {
    display: flex;
    align-items: baseline;
    gap: 10px;
}

.sum-pct {
    font-size: 40px;
    font-weight: 900;
    color: #0e1730;
    line-height: 1;
}

.sum-suf {
    font-size: 12px;
    font-weight: 800;
    color: #93a1b4;
}

.sum-chip {
    font-weight: 900;
    border-radius: 999px;
}

.t-critical {
    color: #ef4444;
}

.t-risk {
    color: #f97316;
}

.t-ok {
    color: #16a34a;
}

.sum-msg {
    margin-top: 12px;
    font-size: 12.5px;
    color: #5b6b84;
    line-height: 1.5;
}
</style>
