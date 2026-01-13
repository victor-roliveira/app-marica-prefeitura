<template>
    <div class="tabs">
        <v-btn v-for="t in tabItems" :key="t.key" class="tab" rounded="xl" size="small"
            :variant="modelValue === t.key ? 'flat' : 'outlined'" :color="modelValue === t.key ? 'blue' : undefined"
            @click="$emit('update:modelValue', t.key)">
            {{ t.label }}
        </v-btn>
    </div>
</template>

<script setup lang="ts">
import type { SupportTabKey, SupportTabsVm } from "../types";

defineProps<{
    modelValue: SupportTabKey;
    vm: SupportTabsVm;
}>();

defineEmits<{
    (e: "update:modelValue", v: SupportTabKey): void;
}>();

const tabItems: { key: SupportTabKey; label: string }[] = [
    { key: "all", label: "Todas" },
    { key: "late", label: "Atrasadas" },
    { key: "progress", label: "Em Andamento" },
    { key: "done", label: "Concluídas" },
];
</script>

<style scoped>
.tabs {
    display: flex;
    gap: 10px;
    align-items: center;
    overflow-x: auto;
    padding-bottom: 2px;
}

.tab {
    text-transform: none;
    font-weight: 600;
    letter-spacing: 0.2px;
    border-radius: 999px;
    white-space: nowrap;
}
</style>
