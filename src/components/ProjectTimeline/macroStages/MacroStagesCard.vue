<template>
    <v-card class="msc" rounded="xl" variant="flat">
        <div class="msc-inner">
            <div class="msc-title">{{ vm.title }}</div>

            <div class="msc-list">
                <MacroStageRow v-for="it in vm.items" :key="it.id" :item="it" />
            </div>

            <div class="msc-divider" />

            <CardFooter :total="totalWeight" :updated-label="vm.updatedLabel" />
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MacroStageRow from "./MacroStageRow.vue";
import CardFooter from "./CardFooter.vue";
import { MacroStagesVm } from "../helpers/macroTypes";

const props = defineProps<{ vm: MacroStagesVm }>();

const totalWeight = computed(() => {
    const sum = props.vm.items.reduce((acc: any, it: any) => acc + (Number.isFinite(it.weightPct) ? it.weightPct : 0), 0);
    return Math.round(sum);
});
</script>

<style scoped>
.msc {
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: #ffffff;
}

.msc-inner {
    padding: 18px 18px 12px;
}

.msc-title {
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 0.6px;
    color: #0f172a;
    margin-bottom: 10px;
    text-transform: uppercase;
}

.msc-list {
    display: flex;
    flex-direction: column;
}

.msc-divider {
    margin-top: 6px;
    height: 1px;
    background: rgba(15, 23, 42, 0.08);
}
</style>
