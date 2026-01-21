<template>
    <div class="row">
        <div class="c1">
            <div class="stage" :class="stageClass">{{ vm.stageName }}</div>
        </div>

        <div class="c2">
            <v-chip size="x-small" class="chip" variant="tonal" :class="chipClass">
                {{ vm.situation.toUpperCase() }}
            </v-chip>
        </div>

        <div class="c3">
            <div class="end">{{ vm.endDateLabel }}</div>
        </div>

        <div class="c4">
            <div class="prog">
                <div class="miniBarBase">
                    <div class="miniBarFill" :class="barClass" :style="{ width: pct + '%' }" />
                </div>
                <div class="pct" :class="pctClass">{{ pct }}%</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SupportRowVm } from "../types";

const props = defineProps<{ vm: SupportRowVm }>();

const pct = computed(() => Math.max(0, Math.min(100, Math.round(props.vm.progressPct))));

const chipClass = computed(() => {
    if (props.vm.situation === "Concluída") return "c-done";
    if (props.vm.situation === "Atrasado") return "c-late";
    return "c-prog";
});

const barClass = computed(() => {
    if (props.vm.situation === "Concluída") return "b-done";
    if (props.vm.situation === "Atrasado") return "b-late";
    return "b-prog";
});

const pctClass = computed(() => {
    if (props.vm.situation === "Concluída") return "p-done";
    if (props.vm.situation === "Atrasado") return "p-late";
    return "p-prog";
});

const stageClass = computed(() => (props.vm.situation === "Atrasado" ? "s-late" : ""));
</script>

<style scoped>
.row {
    display: grid;
    grid-template-columns: 1.6fr 1.1fr 0.9fr 0.9fr;
    gap: 10px;
    padding: 14px 14px;
    background: #ffffff;
    border-bottom: 1px solid #f3f6fb;
    align-items: center;
}

.stage {
    font-weight: 900;
    color: #0e1730;
    font-size: 13px;
}

.s-late {
    color: #ef4444;
}

.chip {
    border-radius: 999px;
    font-weight: 900;
}

.c-done {
    color: #16a34a;
    background: rgba(22, 163, 74, 0.12);
}

.c-late {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.12);
}

.c-prog {
    color: #f97316;
    background: rgba(249, 115, 22, 0.12);
}

.end {
    color: #6b7892;
    font-weight: 900;
    font-size: 12px;
}

.prog {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
}

.miniBarBase {
    width: 34px;
    height: 4px;
    background: #eef2f8;
    border-radius: 999px;
    overflow: hidden;
}

.miniBarFill {
    height: 100%;
    border-radius: 999px;
}

.b-done {
    background: #16a34a;
}

.b-late {
    background: #ef4444;
}

.b-prog {
    background: #f97316;
}

.pct {
    width: 42px;
    text-align: right;
    font-weight: 900;
    font-size: 12px;
    color: #0e1730;
}

.p-done {
    color: #16a34a;
}

.p-late {
    color: #9aa6b6;
}

.p-prog {
    color: #0e1730;
}
</style>
