<template>
    <div class="gm-root">
        <!-- EIXO (marcos) -->
        <div class="gm-axis" :style="{ height: heightPx + 'px' }">
            <div class="gm-axis-line" />

            <button v-for="m in sortedMilestones" :key="m.milestone_id" class="gm-dot" type="button"
                :style="{ top: y(m.milestone_date) + 'px' }" @click="openMilestone(m)"
                :aria-label="`Marco: ${fmt(m.milestone_date)} - ${m.description}`" />
        </div>

        <!-- TRILHA: inauguração + colunas das etapas -->
        <div class="gm-track" :style="{ height: heightPx + 'px' }">
            <div class="gm-inaug">
                <span class="gm-inaug-label">Inauguração</span>
            </div>

            <div class="gm-stages">
                <div v-for="s in stages" :key="s.step_id" class="gm-stage-col" :title="s.step_name">
                    <div v-if="rangeByStage[s.step_id]" class="gm-block"
                        :style="blockStyle(s.step_id, s.default_color)" />
                </div>
            </div>

            <!-- linhas de alterações -->
            <div v-for="a in alterations" :key="a.change_number + '-' + a.step_impact_id" class="gm-change-line"
                :style="{ top: y(a.change_date) + 'px' }" />
        </div>

        <!-- ALTERAÇÕES (badges) -->
        <div class="gm-changes" :style="{ height: heightPx + 'px' }">
            <button v-for="a in alterations" :key="'b-' + a.change_number + '-' + a.step_impact_id" type="button"
                class="gm-change gm-change-btn" :style="{ top: y(a.change_date) + 'px' }" @click="openChange(a)"
                :aria-label="`Alteração ${a.change_number} em ${fmt(a.change_date)}`">
                <div class="gm-badge">{{ a.change_number }}</div>

            </button>

        </div>

        <!-- MODAL (milestone) -->
        <v-dialog v-model="milestoneDialog" max-width="420">
            <v-card>
                <v-card-title class="text-subtitle-1 font-weight-bold">
                    Marco do Projeto
                </v-card-title>

                <v-card-text>
                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Data</div>
                        <div class="gm-modal-value">{{ selectedMilestone ? fmt(selectedMilestone.milestone_date) : "-"
                        }}</div>
                    </div>

                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Descrição</div>
                        <div class="gm-modal-value">{{ selectedMilestone?.description ?? "-" }}</div>
                    </div>

                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Tipo</div>
                        <div class="gm-modal-value">{{ selectedMilestone?.milestone_type ?? "-" }}</div>
                    </div>

                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Fixo</div>
                        <div class="gm-modal-value">{{ selectedMilestone?.fixed ? "Sim" : "Não" }}</div>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="tonal" @click="milestoneDialog = false">Fechar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- MODAL (change) -->
        <v-dialog v-model="changeDialog" max-width="420">
            <v-card>
                <v-card-title class="text-subtitle-1 font-weight-bold">
                    Alteração {{ selectedChange?.change_number ?? "" }}
                </v-card-title>

                <v-card-text>
                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Data</div>
                        <div class="gm-modal-value">{{ selectedChange ? fmt(selectedChange.change_date) : "-" }}</div>
                    </div>

                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Etapa</div>
                        <div class="gm-modal-value">{{ selectedChange?.step_impact_id ?? "-" }}</div>
                    </div>

                    <!-- Se existir no seu types.ts, já aparece; se não existir, remove -->
                    <div v-if="(selectedChange as any)?.reason" class="gm-modal-row">
                        <div class="gm-modal-label">Motivo</div>
                        <div class="gm-modal-value">{{ (selectedChange as any)?.reason }}</div>
                    </div>

                    <div v-if="(selectedChange as any)?.notes" class="gm-modal-row">
                        <div class="gm-modal-label">Obs</div>
                        <div class="gm-modal-value">{{ (selectedChange as any)?.notes }}</div>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="tonal" @click="changeDialog = false">Fechar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Alteration, ISODate, Milestone, Project, Stage, StageProgress } from "./types";

const props = defineProps<{
    project: Project;
    stages: Stage[];
    progress: StageProgress[];
    milestones: Milestone[];
    alterations: Alteration[];
    heightPx?: number;
}>();

const heightPx = computed(() => props.heightPx ?? 440);

/* modal state */
const milestoneDialog = ref(false);
const selectedMilestone = ref<Milestone | null>(null);
const changeDialog = ref(false);
const selectedChange = ref<Alteration | null>(null);

function openMilestone(m: Milestone) {
    selectedMilestone.value = m;
    milestoneDialog.value = true;
}

function openChange(a: Alteration) {
    selectedChange.value = a;
    changeDialog.value = true;
}

/* range principal */
const rangeStart = computed<ISODate>(() => {
    const times = props.milestones.map((m) => new Date(m.milestone_date).getTime());
    const min = Math.min(...times);
    return new Date(min).toISOString().slice(0, 10);
});
const rangeEnd = computed<ISODate>(() => props.project.inauguration_date);

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
}
function ratio(dateIso: ISODate): number {
    const start = new Date(rangeStart.value).getTime();
    const end = new Date(rangeEnd.value).getTime();
    const d = new Date(dateIso).getTime();
    const denom = Math.max(1, end - start);
    return clamp((d - start) / denom, 0, 1);
}
function y(dateIso: ISODate): number {
    const padTop = 10;
    const padBottom = 10;
    const usable = Math.max(1, heightPx.value - padTop - padBottom);
    return padTop + ratio(dateIso) * usable;
}
function fmt(dateIso: ISODate) {
    return new Date(dateIso).toLocaleDateString("pt-BR");
}

const sortedMilestones = computed(() =>
    [...props.milestones].sort(
        (a, b) => new Date(a.milestone_date).getTime() - new Date(b.milestone_date).getTime()
    )
);

const rangeByStage = computed<Record<string, { start: ISODate; end: ISODate } | undefined>>(() => {
    const map: Record<string, { start: ISODate; end: ISODate } | undefined> = {};

    // 1) tenta vir do progress (preferencial)
    for (const p of props.progress) {
        if (p.step_start_date && p.step_end_date) {
            map[p.step_id] = { start: p.step_start_date, end: p.step_end_date };
        }
    }

    // 2) fallback: tenta vir do próprio stage (se você tiver no mock)
    for (const s of props.stages) {
        const anyStage = s as any;
        if (!map[s.step_id] && anyStage.step_start_date && anyStage.step_end_date) {
            map[s.step_id] = { start: anyStage.step_start_date, end: anyStage.step_end_date };
        }

    }

    // 3) fallback final: não deixa sumir (bloco curto no começo do range)
    // Isso é só para DEV. No Passo 5 você já terá datas reais sempre.
    for (const s of props.stages) {
        if (!map[s.step_id]) {
            map[s.step_id] = {
                start: rangeStart.value,
                end: rangeStart.value, // vira bloco mínimo
            };
        }
    }

    return map;
});

function blockStyle(etapaId: string, color: string) {
    const r = rangeByStage.value[etapaId];
    if (!r) return {};

    const top = y(r.start);
    const bottom = y(r.end);

    // garante altura mínima visível
    const h = Math.max(18, bottom - top);

    return {
        top: `${top}px`,
        height: `${h}px`,
        backgroundColor: color,
    };
}

</script>

<style scoped>
/* IMPORTANTE: vars compartilhadas para alinhar com TimelineStages */
.gm-root {
    --stage-col-width: 18px;
    /* estreito */
    --stage-gap: 10px;

    display: grid;
    grid-template-columns: 26px 1fr 44px;

    /* eixo compacto */
    gap: 10px;
    align-items: start;
    min-width: 0;
}

/* eixo */
.gm-axis {
    position: relative;
    min-width: 0;
}

.gm-axis-line {
    position: absolute;
    left: 12px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgba(0, 0, 0, 0.12);
    border-radius: 2px;
}

/* bolinha clicável */
.gm-dot {
    position: absolute;
    left: 7px;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 999px;
    border: 2px solid rgba(0, 0, 0, 0.35);
    background: #fff;
    padding: 0;
    cursor: pointer;
}

/* trilha */
.gm-track {
    position: relative;
    min-width: 0;
    display: grid;
    grid-template-columns: 22px 1fr;
    gap: 10px;
}

.gm-inaug {
    width: 22px;
    height: 100%;
    border-radius: 2px;
    background: #0A2A66;

    display: flex;
    align-items: center;
    justify-content: center;
}

.gm-inaug-label {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.4px;
    color: #ffffff;
    opacity: 0.9;
    user-select: none;
    white-space: nowrap;
}


.gm-stages {
    position: relative;
    height: 100%;
    display: flex;
    gap: var(--stage-gap);
    align-items: flex-start;
    overflow-x: auto;
    padding-right: 4px;
}

.gm-stage-col {
    position: relative;
    width: var(--stage-col-width);
    min-width: var(--stage-col-width);
    height: 100%;
}

.gm-block {
    position: absolute;
    left: 0;
    right: 0;
    border-radius: 2px;
    opacity: 0.95;
}

/* linhas de alteração */
.gm-change-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: #ff9800;
    transform: translateY(-50%);
    border-radius: 2px;
    opacity: 0.9;
}

/* coluna direita (alterações) */
.gm-changes {
    position: relative;
    min-width: 0;
}

.gm-change {
    position: absolute;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: grid;
    grid-template-columns: 26px 1fr;
    align-items: center;
    gap: 6px;
}

.gm-badge {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: #ff9800;
    color: #fff;
    font-weight: 900;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.gm-cdate {
    font-size: 11px;
    white-space: nowrap;
}

/* modal */
.gm-modal-row {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 8px;
    margin-bottom: 8px;
}

.gm-modal-label {
    font-weight: 800;
    opacity: 0.75;
}

.gm-modal-value {
    word-break: break-word;
}

.v-dialog {
    font-family: 'Montserrat';
}

.v-card-title {
    font-family: 'Montserrat';
}
</style>
