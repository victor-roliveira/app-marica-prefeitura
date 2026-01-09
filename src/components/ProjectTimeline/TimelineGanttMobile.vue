<template>
    <div class="gm-root">
        <!-- LINHAS: término da etapa (dot → barra da etapa) -->
        <div class="gm-endlines" :style="{ height: heightPx + 'px' }">
            <div v-for="ln in stepEndLines" :key="ln.key" class="gm-endline" :style="{
                top: ln.top + 'px',
                left: ln.left + 'px',
                width: ln.width + 'px'
            }" />
        </div>

        <!-- EIXO (marcos) -->
        <TimelineAxis class="gm-axis" mode="dots" :milestones="milestones" :stages="stages" :progress="progress"
            :rangeStart="rangeStart" :rangeEnd="rangeEnd" :heightPx="heightPx" @select="onAxisSelect" />

        <!-- TRILHA: inauguração + colunas das etapas -->
        <div class="gm-track" :style="{ height: heightPx + 'px' }">
            <div class="gm-inaug">
                <span class="gm-inaug-label">Inauguração</span>
            </div>

            <div class="gm-stages" ref="stagesEl">
                <div v-for="s in stages" :key="s.step_id" class="gm-stage-col" :title="s.step_name">
                    <!-- barra principal da etapa -->
                    <div v-if="rangeByStage[s.step_id]" class="gm-block"
                        :style="blockStyle(s.step_id, s.default_color)" />

                    <!-- overlays de impacto (laranja) - intervalo real -->
                    <div v-for="ext in extensionsByStage[s.step_id] ?? []" :key="ext.key" class="gm-delay"
                        :style="impactStyle(ext.start, ext.end)" :title="ext.title">
                        <span class="gm-delay-label">{{ ext.label }}</span>
                    </div>
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
                        <div class="gm-modal-label">Data:</div>
                        <div class="gm-modal-value">
                            {{ selectedMilestone ? fmt(selectedMilestone.milestone_date) : "-" }}
                        </div>
                    </div>

                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Descrição:</div>
                        <div class="gm-modal-value">{{ selectedMilestone?.description ?? "-" }}</div>
                    </div>

                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Momento:</div>
                        <div class="gm-modal-value">{{ selectedMilestone?.milestone_type ?? "-" }}</div>
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
                        <div class="gm-modal-label">Registro:</div>
                        <div class="gm-modal-value">{{ selectedChange ? fmt(selectedChange.change_date) : "-" }}</div>
                    </div>

                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Descrição:</div>
                        <div class="gm-modal-value">{{ selectedChange?.description ?? "-" }}</div>
                    </div>

                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Etapa:</div>
                        <div class="gm-modal-value">{{ selectedChange?.step_impact_id ?? "-" }}</div>
                    </div>

                    <div v-if="selectedChangeImpactRange" class="gm-modal-row">
                        <div class="gm-modal-label">Impacto:</div>
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

        <!-- MODAL (step end) -->
        <v-dialog v-model="stepEndDialog" max-width="420">
            <v-card>
                <v-card-title class="text-subtitle-1 font-weight-bold">
                    Término da Etapa
                </v-card-title>

                <v-card-text>
                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Etapa:</div>
                        <div class="gm-modal-value">{{ selectedStepEnd?.step_name ?? "-" }}</div>
                    </div>

                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Data:</div>
                        <div class="gm-modal-value">
                            {{ selectedStepEnd ? fmt(selectedStepEnd.step_end_date) : "-" }}
                        </div>
                    </div>

                    <div class="gm-modal-row">
                        <div class="gm-modal-label">Tipo:</div>
                        <div class="gm-modal-value">Término (baseline)</div>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="tonal" @click="stepEndDialog = false">Fechar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { Alteration, ISODate, Milestone, Project, Stage, StageProgress } from "./types";
import TimelineAxis from "../../components/ProjectTimeline/TimelineAxis.vue";

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
const stepEndDialog = ref(false);
const selectedStepEnd = ref<{ step_id: string; step_name: string; step_end_date: ISODate } | null>(null);

type ExtensionInterval = {
    key: string;
    start: ISODate;
    end: ISODate;
    label: string;
    title: string;
};

function openMilestone(m: Milestone) {
    selectedMilestone.value = m;
    milestoneDialog.value = true;
}

function openChange(a: Alteration) {
    selectedChange.value = a;
    changeDialog.value = true;
}

function onAxisSelect(payload: any) {
    if (payload?.kind === "milestone") {
        openMilestone(payload.milestone);
        return;
    }

    if (payload?.kind === "step-end") {
        selectedStepEnd.value = {
            step_id: payload.step_id,
            step_name: payload.step_name,
            step_end_date: payload.step_end_date,
        };
        stepEndDialog.value = true;
        return;
    }
}

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

/* ranges por etapa */
const rangeByStage = computed<Record<string, { start: ISODate; end: ISODate } | undefined>>(() => {
    const map: Record<string, { start: ISODate; end: ISODate } | undefined> = {};

    for (const p of props.progress) {
        if (p.step_start_date && p.step_end_date) {
            map[p.step_id] = { start: p.step_start_date, end: p.step_end_date };
        }
    }

    for (const s of props.stages) {
        const anyStage = s as any;
        if (!map[s.step_id] && anyStage.step_start_date && anyStage.step_end_date) {
            map[s.step_id] = { start: anyStage.step_start_date, end: anyStage.step_end_date };
        }
    }

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

/* progressByStep + extensionsByStage (mantido) */
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

function diffDays(start: ISODate, end: ISODate): number {
    const s = toLocalMiddayTime(start);
    const e = toLocalMiddayTime(end);
    if (!Number.isFinite(s) || !Number.isFinite(e)) return 0;
    return Math.max(0, Math.round((e - s) / (1000 * 60 * 60 * 24)));
}

function addDays(dateIso: ISODate, days: number): ISODate {
    const t = toLocalMiddayTime(dateIso);
    const dt = new Date(t + days * 24 * 60 * 60 * 1000);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}` as ISODate;
}


const extensionsByStage = computed<Record<string, ExtensionInterval[]>>(() => {
    const map: Record<string, ExtensionInterval[]> = {};

    // agrupar alterações por etapa
    const byStage: Record<string, any[]> = {};
    for (const a of props.alterations as any[]) {
        const stepId = String(a.step_impact_id);
        (byStage[stepId] ??= []).push(a);
    }

    for (const stepId of Object.keys(byStage)) {
        const p = progressByStep.value[stepId];
        if (!p?.step_end_date) continue;

        // "cursor" começa no término baseline da etapa
        let cursorEnd: ISODate = p.step_end_date;

        const changes = byStage[stepId]
            // precisa ter intervalo de impacto OU uma forma alternativa de calcular duração
            .filter((a) => (a.impact_start_date && a.impact_end_date) || a.duration_days)
            .sort((a, b) => toLocalMiddayTime(a.change_date) - toLocalMiddayTime(b.change_date));

        for (const a of changes) {
            const duration =
                a.duration_days ??
                diffDays(a.impact_start_date as ISODate, a.impact_end_date as ISODate);

            if (!duration || duration <= 0) continue;

            const start = cursorEnd;
            const end = addDays(cursorEnd, duration);

            (map[stepId] ??= []).push({
                key: `ext-${stepId}-${a.change_number}`,
                start,
                end,
                label: String(a.change_number),
                title: `Alteração ${a.change_number}: +${duration} dias — ${a.description ?? ""}`.trim(),
            });

            // próximo atraso começa após este atraso
            cursorEnd = end;
        }
    }

    return map;
});


const impactsByStage = computed<Record<string, ImpactInterval[]>>(() => {
    const map: Record<string, ImpactInterval[]> = {};

    for (const a of props.alterations as any[]) {
        const stepId = String(a.step_impact_id);
        if (!map[stepId]) map[stepId] = [];

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

        const p = progressByStep.value[stepId];
        if (!p) continue;

        let start: ISODate | null = null;
        let end: ISODate | null = null;

        if (a.start_impact && a.new_start_date) {
            const r = normalizeRange(p.step_start_date, a.new_start_date);
            if (r) {
                start = r.start;
                end = r.end;
            }
        }

        if (a.end_impact && a.new_end_date) {
            const r = normalizeRange(p.step_end_date, a.new_end_date);
            if (r) {
                if (!start || !end) {
                    start = r.start;
                    end = r.end;
                } else {
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

const selectedChangeImpactRange = computed<{ start: ISODate; end: ISODate } | null>(() => {
    if (!selectedChange.value) return null;
    const stepId = selectedChange.value.step_impact_id;
    const list = impactsByStage.value[String(stepId)] ?? [];
    const found = list.find((x) => x.key.startsWith(`ch${(selectedChange.value as any).change_number}-`));
    return found ? { start: found.start, end: found.end } : null;
});

/* ======= NOVO: linhas dot término → barra (com suporte a scroll horizontal) ======= */
const stagesEl = ref<HTMLElement | null>(null);
const stagesScrollLeft = ref(0);

function onStagesScroll() {
    stagesScrollLeft.value = stagesEl.value?.scrollLeft ?? 0;
}

onMounted(() => {
    if (!stagesEl.value) return;
    stagesScrollLeft.value = stagesEl.value.scrollLeft;
    stagesEl.value.addEventListener("scroll", onStagesScroll, { passive: true });
});

onBeforeUnmount(() => {
    stagesEl.value?.removeEventListener("scroll", onStagesScroll);
});

const stepIndexById = computed<Record<string, number>>(() => {
    const sorted = [...props.stages].sort((a, b) => a.view_order - b.view_order);
    const map: Record<string, number> = {};
    sorted.forEach((s, idx) => (map[s.step_id] = idx));
    return map;
});

type StepEndLine = { key: string; top: number; left: number; width: number };

const stepEndLines = computed<StepEndLine[]>(() => {
    // Medidas precisam espelhar seu CSS:
    const axisColW = 26;     // gm-root grid col 1
    const rootGap = 10;      // gm-root gap

    const trackInaugW = 22;  // gm-track col 1
    const trackGap = 10;     // gm-track gap

    const colW = 18;         // --stage-col-width
    const gap = 10;          // --stage-gap

    // centro do dot no TimelineAxis (guide left 12px, dot left 7px ~ 13px)
    const axisCenterX = 13;

    // início do "miolo" das etapas (dentro do grid total)
    const stagesStartX = axisColW + rootGap + trackInaugW + trackGap;

    const lines: StepEndLine[] = [];

    for (const p of props.progress) {
        if (!p.step_end_date) continue;

        const idx = stepIndexById.value[p.step_id];
        if (idx === undefined) continue;

        // centro da coluna da etapa, compensando scroll horizontal
        const stageCenterX =
            stagesStartX +
            idx * (colW + gap) +
            colW / 2 -
            stagesScrollLeft.value;

        const top = y(p.step_end_date);

        const left = axisCenterX;
        const width = Math.max(0, stageCenterX - axisCenterX);

        lines.push({
            key: `endline-${p.step_id}`,
            top,
            left,
            width,
        });
    }

    return lines;
});
</script>

<style scoped>
.gm-root {
    --stage-col-width: 18px;
    --stage-gap: 10px;

    display: grid;
    grid-template-columns: 26px 1fr 44px;
    gap: 10px;
    align-items: start;
    min-width: 0;

    position: relative;
    /* necessário para gm-endlines absolute */
}

.gm-endlines {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
}

.gm-endline {
    position: absolute;
    height: 2px;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.18);
    border-radius: 2px;
}

.gm-axis {
    min-width: 0;
    z-index: 10;
}

.gm-track {
    position: relative;
    min-width: 0;
    display: grid;
    grid-template-columns: 22px 1fr;
    gap: 10px;
    z-index: 5;
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
    z-index: 3;
    /* acima das linhas */
    opacity: 0.95;
}

.gm-impact {
    position: absolute;
    left: 0;
    right: 0;
    border-radius: 2px;
    background: #ee790c;
    opacity: 0.84;
    z-index: 4;
    pointer-events: none;
}

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

.gm-changes {
    position: relative;
    min-width: 0;
    z-index: 8;
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

.gm-modal-row {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 8px;
    margin-bottom: 8px;
}

.gm-modal-label {
    font-weight: 800;
    font-size: 15px;
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

.gm-delay {
    position: absolute;
    left: 0;
    right: 0;
    border-radius: 2px;
    background: #ff9800;
    opacity: 0.8;
    z-index: 5;
    pointer-events: none;
}

.gm-delay-label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: 600;
    color: #fff;
    line-height: 1;
    opacity: 0.95;
    user-select: none;
    pointer-events: none;
}
</style>
