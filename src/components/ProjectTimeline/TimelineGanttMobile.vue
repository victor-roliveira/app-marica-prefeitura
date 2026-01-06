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
                    <!-- barra principal da etapa -->
                    <div v-if="rangeByStage[s.step_id]" class="gm-block"
                        :style="blockStyle(s.step_id, s.default_color)" />

                    <!-- overlays de impacto (laranja) - intervalo real -->
                    <div v-for="impact in impactsByStage[s.step_id] ?? []" :key="impact.key" class="gm-impact"
                        :style="impactStyle(impact.start, impact.end)" :title="impact.title" />
                </div>
            </div>

            <!-- linhas de alterações (data de registro) -->
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
                <v-card-title class="text-subtitle-1 font-weight-bold"> Marco do Projeto </v-card-title>

                <v-card-text>
                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Data</div>
                        <div class="gm-modal-value">
                            {{ selectedMilestone ? fmt(selectedMilestone.milestone_date) : "-" }}
                        </div>
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
                        <div class="gm-modal-label">Registrada em</div>
                        <div class="gm-modal-value">{{ selectedChange ? fmt(selectedChange.change_date) : "-" }}</div>
                    </div>

                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Descrição</div>
                        <div class="gm-modal-value">{{ selectedChange?.description ?? "-" }}</div>
                    </div>

                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Etapa</div>
                        <div class="gm-modal-value">{{ selectedChange?.step_impact_id ?? "-" }}</div>
                    </div>

                    <div v-if="selectedChangeImpactRange" class="gm-modal-row">
                        <div class="gm-modal-label">Impacto</div>
                        <div class="gm-modal-value">
                            {{ fmt(selectedChangeImpactRange.start) }} → {{ fmt(selectedChangeImpactRange.end) }}
                        </div>
                    </div>

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

/**
 * IMPORTANTÍSSIMO (timezone):
 * - Para "YYYY-MM-DD", não use new Date("YYYY-MM-DD") pois isso vira UTC e pode cair 1 dia no Brasil.
 * - Usamos "meio-dia local" para cálculos e um formatter manual para exibição.
 */
function fmt(dateIso: ISODate) {
    const [y, m, d] = String(dateIso).split("-");
    if (!y || !m || !d) return String(dateIso);
    return `${d}/${m}/${y}`;
}

function toLocalMiddayTime(dateIso: ISODate): number {
    const parts = String(dateIso).split("-").map((x) => Number(x));
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];
    if (!y || !m || !d) return NaN;
    return new Date(y, m - 1, d, 12, 0, 0, 0).getTime();
}

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
}

function normalizeRange(start: ISODate, end: ISODate): { start: ISODate; end: ISODate } | null {
    const s = toLocalMiddayTime(start);
    const e = toLocalMiddayTime(end);
    if (!Number.isFinite(s) || !Number.isFinite(e)) return null;
    if (e < s) return { start: end, end: start };
    return { start, end };
}

/* range principal */
const rangeStart = computed<ISODate>(() => {
    // menor milestone_date (sem efeito timezone)
    const times = props.milestones.map((m) => toLocalMiddayTime(m.milestone_date));
    const min = Math.min(...times.filter((t) => Number.isFinite(t)));
    // reconstrói YYYY-MM-DD via milestone mais cedo
    const earliest = [...props.milestones].sort(
        (a, b) => toLocalMiddayTime(a.milestone_date) - toLocalMiddayTime(b.milestone_date)
    )[0];
    return earliest?.milestone_date ?? props.project.start_date ?? props.project.inauguration_date;
});

const rangeEnd = computed<ISODate>(() => props.project.inauguration_date);

function ratio(dateIso: ISODate): number {
    const start = toLocalMiddayTime(rangeStart.value);
    const end = toLocalMiddayTime(rangeEnd.value);
    const d = toLocalMiddayTime(dateIso);
    const denom = Math.max(1, end - start);
    return clamp((d - start) / denom, 0, 1);
}

function y(dateIso: ISODate): number {
    const padTop = 10;
    const padBottom = 10;
    const usable = Math.max(1, heightPx.value - padTop - padBottom);
    return padTop + ratio(dateIso) * usable;
}

const sortedMilestones = computed(() =>
    [...props.milestones].sort(
        (a, b) => toLocalMiddayTime(a.milestone_date) - toLocalMiddayTime(b.milestone_date)
    )
);

/* ranges por etapa */
const rangeByStage = computed<Record<string, { start: ISODate; end: ISODate } | undefined>>(() => {
    const map: Record<string, { start: ISODate; end: ISODate } | undefined> = {};

    // 1) preferencial: progress
    for (const p of props.progress) {
        if (p.step_start_date && p.step_end_date) {
            map[p.step_id] = { start: p.step_start_date, end: p.step_end_date };
        }
    }

    // 2) fallback: stage (se existir)
    for (const s of props.stages) {
        const anyStage = s as any;
        if (!map[s.step_id] && anyStage.step_start_date && anyStage.step_end_date) {
            map[s.step_id] = { start: anyStage.step_start_date, end: anyStage.step_end_date };
        }
    }

    // 3) fallback final: bloco mínimo (DEV)
    for (const s of props.stages) {
        if (!map[s.step_id]) {
            map[s.step_id] = { start: rangeStart.value, end: rangeStart.value };
        }
    }

    return map;
});

function blockStyle(stepId: string, color: string) {
    const r = rangeByStage.value[stepId];
    if (!r) return {};

    const nr = normalizeRange(r.start, r.end);
    if (!nr) return {};

    const top = y(nr.start);
    const bottom = y(nr.end);
    const h = Math.max(22, bottom - top);

    return {
        top: `${top}px`,
        height: `${h}px`,
        backgroundColor: color,
    };
}

/**
 * Impactos (overlays laranja):
 * - Preferencial: impact_start_date + impact_end_date (intervalo explícito)
 * - Derivado: progress + flags start_impact/end_impact + new_start_date/new_end_date
 * - 1 overlay por alteração (intervalo combinado)
 */
type ImpactInterval = {
    key: string;
    stepId: string;
    start: ISODate;
    end: ISODate;
    title: string;
};

const progressByStep = computed(() => {
    const map: Record<string, StageProgress> = {};
    for (const p of props.progress) map[p.step_id] = p;
    return map;
});

const impactsByStage = computed<Record<string, ImpactInterval[]>>(() => {
    const map: Record<string, ImpactInterval[]> = {};

    for (const a of props.alterations as any[]) {
        const stepId = String(a.step_impact_id);
        if (!map[stepId]) map[stepId] = [];

        // 1) explícito no dado
        if (a.impact_start_date && a.impact_end_date) {
            map[stepId].push({
                key: `ch${a.change_number}-explicit-${stepId}`,
                stepId,
                start: a.impact_start_date,
                end: a.impact_end_date,
                title: `Alteração ${a.change_number}: ${a.description ?? ""}`.trim(),
            });
            continue;
        }

        // 2) derivar do progress + new_start/new_end
        const p = progressByStep.value[stepId];
        if (!p) continue;

        let start: ISODate | null = null;
        let end: ISODate | null = null;

        // impacto no início
        if (a.start_impact && a.new_start_date) {
            const r = normalizeRange(p.step_start_date, a.new_start_date);
            if (r) {
                start = r.start;
                end = r.end;
            }
        }

        // impacto no fim
        if (a.end_impact && a.new_end_date) {
            const r = normalizeRange(p.step_end_date, a.new_end_date);
            if (r) {
                if (!start || !end) {
                    start = r.start;
                    end = r.end;
                } else {
                    // intervalo combinado cobrindo tudo
                    const r2 = normalizeRange(start, end);
                    const r3 = normalizeRange(r.start, r.end);
                    if (r2 && r3) {
                        const combined = normalizeRange(
                            toLocalMiddayTime(r2.start) <= toLocalMiddayTime(r3.start) ? r2.start : r3.start,
                            toLocalMiddayTime(r2.end) >= toLocalMiddayTime(r3.end) ? r2.end : r3.end
                        );
                        if (combined) {
                            start = combined.start;
                            end = combined.end;
                        }
                    }
                }
            }
        }

        if (start && end) {
            map[stepId].push({
                key: `ch${a.change_number}-derived-${stepId}`,
                stepId,
                start,
                end,
                title: `Alteração ${a.change_number}: ${a.description ?? ""}`.trim(),
            });
        }
    }

    // ordenar por data inicial do impacto
    for (const k of Object.keys(map)) {
        map[k].sort((x, y) => toLocalMiddayTime(x.start) - toLocalMiddayTime(y.start));
    }

    return map;
});

function impactStyle(start: ISODate, end: ISODate) {
    const nr = normalizeRange(start, end);
    if (!nr) return { display: "none" };

    const top = y(nr.start);
    const bottom = y(nr.end);

    return {
        top: `${top}px`,
        height: `${Math.max(10, bottom - top)}px`,
    };
}

/* modal: mostrar impacto da alteração selecionada (se houver) */
const selectedChangeImpactRange = computed<{ start: ISODate; end: ISODate } | null>(() => {
    if (!selectedChange.value) return null;
    const stepId = selectedChange.value.step_impact_id;
    const list = impactsByStage.value[String(stepId)] ?? [];
    const found = list.find((x) => x.key.startsWith(`ch${(selectedChange.value as any).change_number}-`));
    return found ? { start: found.start, end: found.end } : null;
});
</script>

<style scoped>
/* IMPORTANTE: vars compartilhadas para alinhar com TimelineStages */
.gm-root {
    --stage-col-width: 18px;
    --stage-gap: 10px;

    display: grid;
    grid-template-columns: 26px 1fr 44px;
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
    background: #0a2a66;

    position: relative;
}

.gm-inaug-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(180deg);
    writing-mode: vertical-rl;

    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.4px;
    color: #ffffff;
    opacity: 0.9;
    user-select: none;
    white-space: nowrap;
    line-height: 1;
    pointer-events: none;
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
    overflow: visible;
}

.gm-block {
    position: absolute;
    left: 0;
    right: 0;
    border-radius: 2px;
    z-index: 1;
    opacity: 0.95;
}

.gm-impact {
    position: absolute;
    left: 0;
    right: 0;
    border-radius: 2px;
    background: #ee790c;
    opacity: 0.85;
    z-index: 2;
    pointer-events: none;
    box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.18);
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
    display: flex;
    justify-content: center;
}

.gm-change-btn {
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
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
    font-family: "Montserrat";
}

.v-card-title {
    font-family: "Montserrat";
}
</style>
