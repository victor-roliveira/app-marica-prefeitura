<template>
    <div class="gd-root">
        <!-- HEADER -->
        <div class="gd-h-axis"></div>

        <div class="gd-h-track">
            <div class="gd-h-stages">
                <TimelineStages :stages="stages" :progress-by-stage="progressByStage" :show-emojis="true"
                    :show-bars="false" />
            </div>
        </div>

        <div class="gd-h-changes"></div>

        <!-- CHART -->
        <div class="gd-axis">
            <div class="gd-axis-line" />

            <button v-for="m in sortedMilestones" :key="m.milestone_id" class="gd-milestone" type="button"
                :style="{ top: y(m.milestone_date) + 'px' }" @click="openMilestone(m)">
                <span class="gd-dot" />
                <span class="gd-mtext">
                    <span class="gd-mdate">{{ fmt(m.milestone_date) }}</span>
                    <span class="gd-mlabel">{{ m.description }}</span>
                </span>
            </button>
        </div>

        <div ref="chartEl" class="gd-track">
            <!-- Inauguração com altura alinhada ao eixo (não ultrapassa a última data) -->
            <div class="gd-inaug-wrap" :style="inaugWrapStyle">
                <TimelineInauguration :color="inaugColor" />
            </div>

            <!-- Colunas das etapas -->
            <div class="gd-stages">
                <div v-for="s in stages" :key="s.step_id" class="gd-stage-col" :title="s.step_name">
                    <div class="gd-block" :style="blockStyle(s.step_id, s.default_color)" />

                    <div v-for="impact in impactsByStage[s.step_id] ?? []" :key="impact.key" class="gd-impact"
                        :style="impactStyle(impact.start, impact.end)" :title="impact.title" />
                </div>
            </div>

            <!-- linhas de alterações (data de registro) -->
            <div v-for="a in alterations" :key="a.change_number + '-' + a.step_impact_id" class="gd-change-line"
                :style="{ top: y(a.change_date) + 'px' }" />
        </div>

        <div class="gd-changes">
            <button v-for="a in alterations" :key="'b-' + a.change_number + '-' + a.step_impact_id" type="button"
                class="gd-change-btn" :style="{ top: y(a.change_date) + 'px' }" @click="openChange(a)"
                :aria-label="`Alteração ${a.change_number} em ${fmt(a.change_date)}`">
                <div class="gd-badge" :style="{ backgroundColor: a.change_color ?? '#ff9800' }">
                    {{ a.change_number }}
                </div>
                <div class="gd-change-date">{{ fmt(a.change_date) }}</div>
            </button>
        </div>

        <!-- MODAL (milestone) -->
        <v-dialog v-model="milestoneDialog" max-width="520">
            <v-card>
                <v-card-title class="text-subtitle-1 font-weight-bold">
                    Marco do Projeto
                </v-card-title>

                <v-card-text>
                    <div class="gd-modal-row">
                        <div class="gd-modal-label">Data:</div>
                        <div class="gd-modal-value">
                            {{ selectedMilestone ? fmt(selectedMilestone.milestone_date) : "-" }}
                        </div>
                    </div>

                    <div class="gd-modal-row">
                        <div class="gd-modal-label">Descrição:</div>
                        <div class="gd-modal-value">{{ selectedMilestone?.description ?? "-" }}</div>
                    </div>

                    <div class="gd-modal-row">
                        <div class="gd-modal-label">Momento:</div>
                        <div class="gd-modal-value">{{ (selectedMilestone as any)?.milestone_type ?? "-" }}</div>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="tonal" @click="milestoneDialog = false">Fechar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- MODAL (change) -->
        <v-dialog v-model="changeDialog" max-width="560">
            <v-card>
                <v-card-title class="text-subtitle-1 font-weight-bold">
                    Alteração {{ selectedChange?.change_number ?? "" }}
                </v-card-title>

                <v-card-text>
                    <div class="gd-modal-row">
                        <div class="gd-modal-label">Registro:</div>
                        <div class="gd-modal-value">{{ selectedChange ? fmt(selectedChange.change_date) : "-" }}</div>
                    </div>

                    <div class="gd-modal-row">
                        <div class="gd-modal-label">Descrição:</div>
                        <div class="gd-modal-value">{{ selectedChange?.description ?? "-" }}</div>
                    </div>

                    <div class="gd-modal-row">
                        <div class="gd-modal-label">Etapa:</div>
                        <div class="gd-modal-value">{{ selectedChange?.step_impact_id ?? "-" }}</div>
                    </div>

                    <div v-if="selectedChangeImpactRange" class="gd-modal-row">
                        <div class="gd-modal-label">Impacto:</div>
                        <div class="gd-modal-value">
                            {{ fmt(selectedChangeImpactRange.start) }} → {{ fmt(selectedChangeImpactRange.end) }}
                        </div>
                    </div>

                    <div v-if="(selectedChange as any)?.reason" class="gd-modal-row">
                        <div class="gd-modal-label">Motivo:</div>
                        <div class="gd-modal-value">{{ (selectedChange as any)?.reason }}</div>
                    </div>

                    <div v-if="(selectedChange as any)?.notes" class="gd-modal-row">
                        <div class="gd-modal-label">Obs:</div>
                        <div class="gd-modal-value">{{ (selectedChange as any)?.notes }}</div>
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
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import TimelineInauguration from "./TimelineInauguration.vue";
import TimelineStages from "./TimelineStages.vue";
import type { Alteration, ISODate, Milestone, Project, Stage, StageProgress } from "./types";

const props = defineProps<{
    project: Project;
    stages: Stage[];
    progress: StageProgress[];
    milestones: Milestone[];
    alterations: Alteration[];
    heightPx?: number;       // mantido por compat, mas não usado para layout
    inaugurColor?: string;
}>();

const inaugColor = computed(() => props.inaugurColor ?? "#0A2A66");

/* ====== medir altura real do chart (para y()) ====== */
const chartEl = ref<HTMLElement | null>(null);
const chartHeight = ref(520);

let ro: ResizeObserver | null = null;

onMounted(() => {
    if (!chartEl.value) return;
    ro = new ResizeObserver(() => {
        const h = chartEl.value?.clientHeight ?? 520;
        chartHeight.value = Math.max(420, h);
    });
    ro.observe(chartEl.value);
});

onBeforeUnmount(() => {
    ro?.disconnect();
    ro = null;
});

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
 * Timezone-safe para "YYYY-MM-DD"
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
    const earliest = [...props.milestones].sort(
        (a, b) => toLocalMiddayTime(a.milestone_date) - toLocalMiddayTime(b.milestone_date)
    )[0];
    return earliest?.milestone_date ?? (props.project.start_date ?? props.project.inauguration_date);
});

const rangeEnd = computed<ISODate>(() => props.project.inauguration_date);

function ratio(dateIso: ISODate): number {
    const start = toLocalMiddayTime(rangeStart.value);
    const end = toLocalMiddayTime(rangeEnd.value);
    const d = toLocalMiddayTime(dateIso);
    const denom = Math.max(1, end - start);
    return clamp((d - start) / denom, 0, 1);
}

/* padding que define o "range visual" do eixo (precisa bater com inaugWrapStyle) */
const PAD_TOP = 12;
const PAD_BOTTOM = 12;

function y(dateIso: ISODate): number {
    const usable = Math.max(1, chartHeight.value - PAD_TOP - PAD_BOTTOM);
    return PAD_TOP + ratio(dateIso) * usable;
}

const inaugWrapStyle = computed(() => {
    const usable = Math.max(1, chartHeight.value - PAD_TOP - PAD_BOTTOM);
    return {
        top: `${PAD_TOP}px`,
        height: `${usable}px`,
    };
});

const sortedMilestones = computed(() =>
    [...props.milestones].sort(
        (a, b) => toLocalMiddayTime(a.milestone_date) - toLocalMiddayTime(b.milestone_date)
    )
);

/* ranges por etapa */
const rangeByStage = computed<Record<string, { start: ISODate; end: ISODate } | undefined>>(() => {
    const map: Record<string, { start: ISODate; end: ISODate } | undefined> = {};

    // 1) progress
    for (const p of props.progress) {
        if ((p as any).step_start_date && (p as any).step_end_date) {
            map[p.step_id] = { start: (p as any).step_start_date, end: (p as any).step_end_date };
        }
    }

    // 2) fallback stage
    for (const s of props.stages) {
        const anyStage = s as any;
        if (!map[s.step_id] && anyStage.step_start_date && anyStage.step_end_date) {
            map[s.step_id] = { start: anyStage.step_start_date, end: anyStage.step_end_date };
        }
    }

    // 3) fallback final DEV
    for (const s of props.stages) {
        if (!map[s.step_id]) map[s.step_id] = { start: rangeStart.value, end: rangeStart.value };
    }

    return map;
});

function blockStyle(stepId: string, color: string) {
    const r = rangeByStage.value[stepId];
    if (!r) return { display: "none" };

    const nr = normalizeRange(r.start, r.end);
    if (!nr) return { display: "none" };

    const top = y(nr.start);
    const bottom = y(nr.end);
    const h = Math.max(26, bottom - top);

    return {
        top: `${top}px`,
        height: `${h}px`,
        backgroundColor: color,
    };
}

/**
 * Impactos laranja (espelho do mobile)
 */
type ImpactInterval = {
    key: string;
    stepId: string;
    start: ISODate;
    end: ISODate;
    title: string;
};

const progressByStage = computed<Record<string, StageProgress | undefined>>(() => {
    const map: Record<string, StageProgress | undefined> = {};
    for (const p of props.progress) map[p.step_id] = p;
    return map;
});

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

        const p = progressByStep.value[stepId] as any;
        if (!p) continue;

        let start: ISODate | null = null;
        let end: ISODate | null = null;

        if (a.start_impact && a.new_start_date && p.step_start_date) {
            const r = normalizeRange(p.step_start_date, a.new_start_date);
            if (r) {
                start = r.start;
                end = r.end;
            }
        }

        if (a.end_impact && a.new_end_date && p.step_end_date) {
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
        height: `${Math.max(12, bottom - top)}px`,
    };
}

/* modal: impacto da alteração selecionada */
const selectedChangeImpactRange = computed<{ start: ISODate; end: ISODate } | null>(() => {
    if (!selectedChange.value) return null;
    const stepId = String(selectedChange.value.step_impact_id);
    const list = impactsByStage.value[stepId] ?? [];
    const found = list.find((x) => x.key.startsWith(`ch${(selectedChange.value as any).change_number}-`));
    return found ? { start: found.start, end: found.end } : null;
});
</script>

<style scoped>
/* densidade desktop via vars herdáveis */
.gd-root {
    --stage-col-width: 34px;
    --stage-gap: 16px;

    display: grid;
    grid-template-columns: 260px 1fr 220px;
    /* axis | track | changes */
    grid-template-rows: auto 1fr;
    /* header | chart */
    column-gap: 18px;
    row-gap: 10px;

    min-width: 0;
    height: auto;
    /* NÃO fixa altura */
    min-height: 620px;
    /* garante respiro e evita sumir com a última data */
    overflow: visible;
    /* evita scrollbar indesejado */
}

/* ============= HEADER (linha 1) ============= */
.gd-h-axis {
    grid-column: 1;
    grid-row: 1;
}

/* Header do track: agora alinhado após a inauguração via padding-left */
.gd-h-track {
    grid-column: 2;
    grid-row: 1;
    min-width: 0;

    /* reserva o espaço da inauguração + gap (mesmo do chart) */
    padding-left: calc(34px + 16px);
}

.gd-h-stages {
    min-width: 0;
}

.gd-h-changes {
    grid-column: 3;
    grid-row: 1;
}

/* ============= CHART (linha 2) ============= */
.gd-axis {
    grid-column: 1;
    grid-row: 2;
    position: relative;
    height: 100%;
    overflow: visible;
}

.gd-track {
    grid-column: 2;
    grid-row: 2;

    position: relative;
    height: 100%;
    min-width: 0;
    overflow: visible;

    /* reserva o espaço da inauguração + gap */
    padding-left: calc(34px + 16px);
}

.gd-changes {
    grid-column: 3;
    grid-row: 2;
    position: relative;
    height: 100%;
    overflow: visible;
}

/* inauguração: altura alinhada ao range visual (padTop/padBottom) */
.gd-inaug-wrap {
    position: absolute;
    left: 0;
    width: 34px;
    /* top/height vêm do computed inaugWrapStyle */
}

/* ===== axis ===== */
.gd-axis-line {
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgba(0, 0, 0, 0.12);
    border-radius: 2px;
}

.gd-milestone {
    position: absolute;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: grid;
    grid-template-columns: 22px 1fr;
    gap: 10px;
    align-items: start;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    text-align: left;
}

.gd-dot {
    width: 12px;
    height: 12px;
    border-radius: 999px;
    border: 2px solid rgba(0, 0, 0, 0.35);
    background: #fff;
    margin-left: 4px;
    margin-top: 2px;
}

.gd-mtext {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.gd-mdate {
    font-size: 12px;
    font-weight: 900;
    line-height: 1.1;
}

.gd-mlabel {
    font-size: 12px;
    line-height: 1.15;
    opacity: 0.85;
    word-break: break-word;
}

/* ===== stages ===== */
.gd-stages {
    position: relative;
    height: 100%;
    display: flex;
    gap: var(--stage-gap);
    align-items: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
    padding-right: 6px;
}

.gd-stage-col {
    position: relative;
    width: var(--stage-col-width);
    min-width: var(--stage-col-width);
    height: 100%;
    overflow: visible;
}

.gd-block {
    position: absolute;
    left: 0;
    right: 0;
    border-radius: 6px;
    z-index: 1;
    opacity: 0.95;
}

.gd-impact {
    position: absolute;
    left: 0;
    right: 0;
    border-radius: 6px;
    background: #ee790c;
    opacity: 0.84;
    z-index: 2;
    pointer-events: none;
}

/* linhas de alteração */
.gd-change-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: #ff9800;
    transform: translateY(-50%);
    border-radius: 2px;
    opacity: 0.9;
}

/* ===== changes ===== */
.gd-change-btn {
    position: absolute;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: grid;
    grid-template-columns: 34px 1fr;
    gap: 10px;
    align-items: center;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    text-align: left;
}

.gd-badge {
    width: 26px;
    height: 26px;
    border-radius: 999px;
    color: #fff;
    font-weight: 900;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.gd-change-date {
    font-size: 12px;
    font-weight: 800;
    opacity: 0.85;
}

/* modal */
.gd-modal-row {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 10px;
    margin-bottom: 10px;
}

.gd-modal-label {
    font-weight: 900;
    font-size: 15px;
    opacity: 0.75;
}

.gd-modal-value {
    word-break: break-word;
}
</style>
