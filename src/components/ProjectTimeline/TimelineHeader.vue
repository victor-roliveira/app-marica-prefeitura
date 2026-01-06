<template>
    <div class="th-root">
        <div class="th-title">
            {{ title }}
        </div>

        <div class="th-meta">
            <v-chip size="small" variant="tonal">
                {{ status }}
            </v-chip>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ProjectStatus } from "./types";

defineProps<{
    title: string;
    status: ProjectStatus;
}>();
</script>

<style scoped>
.th-root {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.th-title {
    font-weight: 800;
    letter-spacing: 0.5px;
    font-size: 16px;
    line-height: 1.2;
}
</style>
