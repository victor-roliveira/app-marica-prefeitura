<template>
    <div class="sb-wrap">
        <v-chip v-if="status.kind === 'ok'" size="small" variant="flat" class="sb-ok">
            OK
        </v-chip>

        <v-chip v-else-if="status.kind === 'delay'" size="small" variant="flat" class="sb-delay">
            <v-icon start size="14">mdi-alert</v-icon>
            {{ status.days }}d
        </v-chip>

        <v-chip v-else size="small" variant="flat" class="sb-none">
            -
        </v-chip>
    </div>
</template>

<script setup lang="ts">
import { MacroStageStatus } from '../helpers/macroTypes';

defineProps<{ status: MacroStageStatus }>();
</script>

<style scoped>
.sb-wrap {
    display: flex;
    justify-content: flex-end;
}

.sb-ok {
    background: #e9fbf1;
    color: #159a4b;
    border: 1px solid #c9f0d9;
    font-weight: 800;
    min-width: 54px;
    justify-content: center;
}

.sb-delay {
    background: #ffecec;
    color: #d11a1a;
    border: 1px solid #ffd0d0;
    font-weight: 800;
    min-width: 64px;
    justify-content: center;
}

.sb-none {
    background: #f3f5f7;
    color: #8a95a3;
    border: 1px solid #e6ebf0;
    font-weight: 800;
    min-width: 54px;
    justify-content: center;
}
</style>
