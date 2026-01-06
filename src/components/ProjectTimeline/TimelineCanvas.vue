<template>
    <div class="tc-root">
        <!-- Coluna esquerda: eixo de datas (placeholder por enquanto) -->
        <div class="tc-axis">
            <div class="tc-placeholder-title">Eixo (Datas)</div>
            <div class="tc-placeholder-text">
                Aqui entra o componente TimelineAxis.vue (Passo 4).
            </div>
        </div>

        <!-- Miolo: barras e inauguração (placeholder por enquanto) -->
        <div class="tc-body">
            <div class="tc-placeholder-title">Timeline (Barras)</div>
            <div class="tc-placeholder-text">
                Aqui entram: TimelineInauguration.vue + TimelineBars.vue (Passo 4).
            </div>
        </div>

        <!-- Coluna direita: alterações (placeholder por enquanto) -->
        <div class="tc-alterations">
            <div class="tc-placeholder-title">Alterações</div>
            <div class="tc-placeholder-text">
                Aqui entra TimelineAlterations.vue (Passo 4).
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Project, Stage, StageProgress, Milestone, Alteration, TimelineConfig } from "./types";

defineProps<{
    project: Project;
    stages: Stage[];
    progress: StageProgress[];
    milestones: Milestone[];
    alterations: Alteration[];
    config?: TimelineConfig;
}>();
</script>

<style scoped>
.tc-root {
    display: grid;
    grid-template-columns: 140px 1fr 140px;
    gap: 12px;
    align-items: stretch;
}

/* caixas */
.tc-axis,
.tc-body,
.tc-alterations {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    min-height: 360px;
    padding: 10px;
}

/* placeholders */
.tc-placeholder-title {
    font-weight: 800;
    font-size: 13px;
    margin-bottom: 6px;
}

.tc-placeholder-text {
    font-size: 12px;
    opacity: 0.7;
}

/* Responsivo: empilha em telas pequenas */
@media (max-width: 900px) {
    .tc-root {
        grid-template-columns: 1fr;
    }

    .tc-axis,
    .tc-body,
    .tc-alterations {
        min-height: 200px;
    }
}
</style>
