<template>
    <div class="ta-root">
        <div v-for="a in alterations" :key="a.change_number + a.project_id" class="ta-item"
            :style="{ borderColor: a.change_color }">
            <div class="ta-badge" :style="{ backgroundColor: a.change_color }">
                {{ a.change_number }}
            </div>
            <div class="ta-date">
                {{ formatDate(a.change_date) }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Alteration } from "./types";

defineProps<{
    alterations: Alteration[];
}>();

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("pt-BR");
}
</script>

<style scoped>
.ta-root {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.ta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    border-left: 3px solid;
    padding-left: 6px;
}

.ta-badge {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    color: white;
    font-size: 12px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ta-date {
    font-size: 11px;
}
</style>
