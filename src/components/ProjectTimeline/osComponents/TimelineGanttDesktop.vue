<template>
    <div class="gd-root">
        <!-- Header -->
        <div class="gd-head">
            <div>

                <div class="gd-subtitle">Cronograma de Marcos e Entregas</div>
            </div>
        </div>

        <!-- Chart -->
        <div class="gd-card">
            <div class="gd-chart">
                <!-- Left labels -->
                <div class="gd-left">
                    <div class="gd-left-spacer" />
                    <div v-for="row in rows" :key="row.step.step_id" class="gd-left-row"
                        :style="{ height: rowHeightPx + 'px' }">
                        <div class="gd-step-name">
                            <span class="gd-step-name-text">
                                {{ row.step.step_name.toUpperCase() }}
                            </span>
                            <span v-if="row.progress?.show_percent" class="gd-step-pct">
                                ({{ row.progress?.advance_percent ?? 0 }}%)
                            </span>
                        </div>
                    </div>

                    <!-- Inaug row label -->
                    <div class="gd-left-row" :style="{ height: rowHeightPx + 'px' }">
                        <div class="gd-step-name">
                            <span class="gd-step-name-text">INAUGURAÇÃO</span>
                        </div>
                    </div>
                </div>

                <!-- Right timeline -->
                <div class="gd-right">
                    <!-- top axis -->
                    <div class="gd-axis" :style="{ height: axisHeightPx + 'px' }">
                        <div v-for="m in months" :key="m.key" class="gd-axis-tick" :style="{ left: m.xPct + '%' }">
                            <div class="gd-axis-label">{{ m.label }}</div>
                        </div>
                    </div>

                    <!-- grid lines -->
                    <div class="gd-grid">
                        <div v-for="m in months" :key="m.key" class="gd-grid-line" :style="{ left: m.xPct + '%' }" />
                    </div>

                    <!-- rows -->
                    <div class="gd-rows">
                        <div v-for="row in rows" :key="row.step.step_id" class="gd-row"
                            :style="{ height: rowHeightPx + 'px' }">
                            <div class="gd-track">
                                <!-- baseline bar -->
                                <div class="gd-bar" :style="barStyle(row.baselineStart, row.baselineEnd, row.color)">
                                    <!-- progress overlay -->
                                    <div class="gd-bar-progress"
                                        :style="{ width: (row.progress?.advance_percent ?? 0) + '%' }" />

                                    <!-- milestones chips that fall inside this stage window -->
                                    <button v-for="ms in row.milestonesInRange" :key="ms.milestone_id" class="gd-chip"
                                        type="button" :style="{ left: dateToXPct(ms.milestone_date) + '%' }"
                                        @click="onMilestone(ms)">
                                        {{ ms.description }}
                                    </button>

                                    <!-- status icon on end -->
                                    <div class="gd-end-icon" :title="row.statusTitle">
                                        <span class="gd-end-icon-inner">
                                            {{ row.statusIcon }}
                                        </span>
                                    </div>
                                </div>

                                <!-- extension (delay/alteration) ALWAYS after baseline end -->
                                <div v-if="row.extensionEnd && isAfter(row.extensionEnd, row.baselineEnd)"
                                    class="gd-extension"
                                    :style="barStyle(row.baselineEnd, row.extensionEnd, row.alterColor)"
                                    :title="row.alterTitle" />

                                <!-- alteration bubble at extension end -->
                                <button v-if="row.bubbleDate" class="gd-bubble" type="button"
                                    :style="{ left: dateToXPct(row.bubbleDate) + '%' }"
                                    @click="onAlteration(row.bubbleAlteration)">
                                    <span class="gd-bubble-date">{{ formatBR(row.bubbleDate) }}</span>
                                    <span class="gd-bubble-icon">{{ row.bubbleAlteration?.icon ?? "⏸️" }}</span>
                                </button>
                            </div>
                        </div>

                        <!-- Inaug row -->
                        <div class="gd-row" :style="{ height: rowHeightPx + 'px' }">
                            <div class="gd-track">
                                <div class="gd-bar" :style="barStyle(inaugStart, inaugEnd, inaugColor)">
                                    <div class="gd-end-icon" :title="'Inauguração'">
                                        <span class="gd-end-icon-inner">🏁</span>
                                    </div>
                                </div>

                                <button class="gd-bubble" type="button"
                                    :style="{ left: dateToXPct(project.inauguration_date) + '%' }" @click.prevent>
                                    <span class="gd-bubble-date">{{ formatBR(project.inauguration_date) }}</span>
                                    <span class="gd-bubble-icon">⏱️</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- dialogs (placeholder) -->
            <!-- Você pode plugar seu v-dialog aqui depois -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Alteration, ISODate, Milestone, Project, Stage, StageProgress, TimelineConfig } from "../helpers/types";

const props = defineProps<{
    project: Project;
    stages: Stage[];
    progress: StageProgress[];
    milestones: Milestone[];
    alterations: Alteration[];
    config?: TimelineConfig;
    heightPx?: number;
    inaugurColor?: string;
}>();

/* ---------- config ---------- */
const rowHeightPx = computed(() => props.config?.height_bar_step ?? 32);
const axisHeightPx = 34;

const inaugColor = computed(() => props.inaugurColor ?? props.config?.color_inauguration ?? "#0A2A66");

/* ---------- date helpers ---------- */
function parseISO(d: ISODate): Date {
    // ISODate = "YYYY-MM-DD"
    const [y, m, day] = d.split("-").map((x) => Number(x));
    return new Date(y, (m ?? 1) - 1, day ?? 1);
}

function toISO(d: Date): ISODate {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function startOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number): Date {
    return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function daysBetween(a: Date, b: Date): number {
    const ms = b.getTime() - a.getTime();
    return Math.round(ms / (1000 * 60 * 60 * 24));
}

function clamp(n: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, n));
}

function isAfter(a: ISODate, b: ISODate): boolean {
    return parseISO(a).getTime() > parseISO(b).getTime();
}

function formatBR(d: ISODate): string {
    const dt = parseISO(d);
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}`;
}

/* ---------- domain range (timeline start/end) ---------- */
const domainStart = computed(() => {
    const dates: ISODate[] = [
        props.project.start_date,
        ...props.progress.map((p) => p.step_start_date),
        ...props.milestones.map((m) => m.milestone_date),
        ...props.alterations.map((a) => a.impact_start_date ?? a.change_date),
    ].filter(Boolean) as ISODate[];

    let min = dates[0] ?? props.project.start_date;
    for (const d of dates) if (parseISO(d) < parseISO(min)) min = d;

    // “respiro” para ficar parecido com a imagem
    const dt = startOfMonth(parseISO(min));
    return toISO(dt);
});

const domainEnd = computed(() => {
    const dates: ISODate[] = [
        props.project.end_date,
        props.project.inauguration_date,
        ...props.progress.map((p) => p.step_end_date),
        ...props.milestones.map((m) => m.milestone_date),
        ...props.alterations.map((a) => a.new_end_date ?? a.impact_end_date ?? a.change_date),
    ].filter(Boolean) as ISODate[];

    let max = dates[0] ?? props.project.end_date;
    for (const d of dates) if (parseISO(d) > parseISO(max)) max = d;

    // fecha no mês para o grid ficar limpo
    const dt = startOfMonth(parseISO(max));
    return toISO(addMonths(dt, 1)); // fim no início do mês seguinte
});

const domainDays = computed(() => {
    const a = parseISO(domainStart.value);
    const b = parseISO(domainEnd.value);
    return Math.max(1, daysBetween(a, b));
});

function dateToXPct(date: ISODate): number {
    const d0 = parseISO(domainStart.value);
    const d1 = parseISO(domainEnd.value);
    const x = daysBetween(d0, parseISO(date));
    const pct = (x / Math.max(1, daysBetween(d0, d1))) * 100;
    return clamp(pct, 0, 100);
}

function barStyle(start: ISODate, end: ISODate, color: string) {
    const left = dateToXPct(start);
    const right = dateToXPct(end);
    const width = Math.max(0.5, right - left); // evita sumir quando muito curto
    return {
        left: left + "%",
        width: width + "%",
        backgroundColor: color,
    };
}

/* ---------- months grid ---------- */
const months = computed(() => {
    const start = parseISO(domainStart.value);
    const end = parseISO(domainEnd.value);

    const items: Array<{ key: string; label: string; xPct: number }> = [];
    let cur = startOfMonth(start);

    // inclui ticks até passar do end
    for (let i = 0; i < 200; i++) {
        if (cur.getTime() > end.getTime()) break;

        const key = `${cur.getFullYear()}-${cur.getMonth() + 1}`;
        const label = cur.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase();
        const iso = toISO(cur);
        items.push({ key, label, xPct: dateToXPct(iso) });

        cur = addMonths(cur, 1);
    }

    return items;
});

/* ---------- rows assembly ---------- */
const stagesSorted = computed(() => [...props.stages].sort((a, b) => a.view_order - b.view_order));

function findProgress(step_id: string): StageProgress | undefined {
    return props.progress.find((p) => p.step_id === step_id && p.project_id === props.project.project_id);
}

function alterationsForStep(step_id: string): Alteration[] {
    return props.alterations.filter((a) => {
        if (a.project_id !== props.project.project_id) return false;
        if (a.step_impact_id === step_id) return true;
        if (a.step_impact_ids?.includes(step_id)) return true;
        return false;
    });
}

function milestoneInRange(ms: Milestone, start: ISODate, end: ISODate) {
    const t = parseISO(ms.milestone_date).getTime();
    return t >= parseISO(start).getTime() && t <= parseISO(end).getTime();
}

const rows = computed(() => {
    return stagesSorted.value.map((step) => {
        const prog = findProgress(step.step_id);

        // baseline window comes from progress; fallback: project range
        const baselineStart = prog?.step_start_date ?? props.project.start_date;
        const baselineEnd = prog?.step_end_date ?? props.project.end_date;

        const alts = alterationsForStep(step.step_id);

        // extension end: max of new_end_date/impact_end_date, but ALWAYS compared to baselineEnd
        let extensionEnd: ISODate | null = null;
        let bubbleAlteration: Alteration | null = null;

        for (const a of alts) {
            const candidate =
                a.new_end_date ??
                a.impact_end_date ??
                null;

            if (!candidate) continue;
            if (!isAfter(candidate, baselineEnd)) continue;

            if (!extensionEnd || isAfter(candidate, extensionEnd)) {
                extensionEnd = candidate;
                bubbleAlteration = a;
            }
        }

        const milestonesInRange = props.milestones
            .filter((m) => m.project_id === props.project.project_id)
            .filter((m) => milestoneInRange(m, baselineStart, extensionEnd ?? baselineEnd))
            .filter((m) => m.description.toLowerCase().includes("check") || m.milestone_type !== "intermediário" ? true : true); // você pode refinar depois

        const showChecked = props.config?.show_icons_checked ?? true;

        let statusIcon = "⏸️";
        let statusTitle = "Em andamento";
        if (prog?.completed) {
            statusIcon = showChecked ? (step.checked_icon ?? "✅") : "✓";
            statusTitle = "Concluído";
        } else if (bubbleAlteration) {
            statusIcon = bubbleAlteration.icon ?? "⏸️";
            statusTitle = `Alteração #${bubbleAlteration.change_number}`;
        }

        return {
            step,
            progress: prog,
            color: step.default_color ?? "#2196F3",
            alterColor: bubbleAlteration?.change_color ?? "#FF9800",
            baselineStart,
            baselineEnd,
            extensionEnd,
            bubbleDate: extensionEnd, // bolha no fim da extensão
            bubbleAlteration,
            milestonesInRange,
            statusIcon,
            statusTitle,
            alterTitle: bubbleAlteration ? bubbleAlteration.description : "",
        };
    });
});

/* ---------- inauguration bar ---------- */
const inaugStart = computed(() => {
    // barra curta antes da data de inauguração, para ficar parecida com a imagem
    // (não é “verdade” do cronograma; é apenas visual)
    const end = parseISO(props.project.inauguration_date);
    const start = new Date(end);
    start.setDate(start.getDate() - 45);
    const iso = toISO(start);
    // não deixa sair do domínio
    return parseISO(iso) < parseISO(domainStart.value) ? domainStart.value : iso;
});

const inaugEnd = computed(() => props.project.inauguration_date);

/* ---------- events (plugar v-dialog depois) ---------- */
function onMilestone(m: Milestone) {
    // aqui você abre seu dialog e mostra m.description, etc.
    // por enquanto, noop
    console.log("milestone:", m);
}

function onAlteration(a: Alteration | null) {
    if (!a) return;
    console.log("alteration:", a);
}
</script>

<style scoped>
.gd-root {
    display: grid;
    gap: 12px;
    font-family: 'Montserrat';
}

.gd-head {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 12px;
}

.gd-title {
    font-weight: 800;
    letter-spacing: 0.5px;
    color: #0b1b34;
    font-size: 18px;
    line-height: 1.2;
}

.gd-subtitle {
    margin-top: 2px;
    font-size: 12px;
    color: #6b7a90;
}

.gd-link {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #1f59ff;
    text-decoration: none;
    white-space: nowrap;
}

.gd-card {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(20, 32, 56, 0.06);
    padding: 18px;
    overflow: hidden;
}

.gd-chart {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 12px;
    align-items: start;
    min-width: 0;
}

.gd-left {
    display: grid;
    grid-template-rows: 34px auto;
    gap: 0;
}

.gd-left-spacer {
    height: 34px;
}

.gd-left-row {
    display: flex;
    align-items: center;
    padding-right: 10px;
}

.gd-step-name {
    font-size: 11px;
    font-weight: 800;
    color: #7483a0;
    letter-spacing: 1px;
    line-height: 1;
    display: flex;
    align-items: baseline;
    gap: 6px;
}

.gd-step-name-text {
    white-space: nowrap;
}

.gd-step-pct {
    color: #8f9db5;
    font-weight: 800;
}

.gd-right {
    position: relative;
    min-width: 0;
    overflow: hidden;
}

.gd-axis {
    position: relative;
}

.gd-axis-tick {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
}

.gd-axis-label {
    font-size: 10px;
    font-weight: 800;
    color: #b0bdd2;
    letter-spacing: 0.8px;
}

.gd-grid {
    position: absolute;
    inset: 34px 0 0 0;
    /* abaixo do eixo */
    pointer-events: none;
}

.gd-grid-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0;
    border-left: 1px dashed rgba(160, 175, 205, 0.25);
}

.gd-rows {
    position: relative;
    margin-top: 0;
    padding-top: 0;
}

.gd-row {
    position: relative;
    display: flex;
    align-items: center;
}

.gd-track {
    position: relative;
    width: 100%;
    height: 100%;
}

.gd-bar {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 18px;
    border-radius: 999px;
    overflow: visible;
}

.gd-bar-progress {
    height: 100%;
    background: rgba(0, 0, 0, 0.14);
    border-radius: 999px;
}

.gd-extension {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 18px;
    border-radius: 999px;
    opacity: 0.95;
}

.gd-end-icon {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.25);
    display: grid;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.25);
}

.gd-end-icon-inner {
    font-size: 11px;
    line-height: 1;
}

.gd-chip {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 9px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 999px;
    border: 0;
    background: rgba(255, 255, 255, 0.38);
    color: rgba(255, 255, 255, 0.92);
    cursor: pointer;
    white-space: nowrap;
}

.gd-bubble {
    position: absolute;
    top: 50%;
    transform: translate(10px, -50%);
    /* “na ponta” do fim */
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 0;
    padding: 5px 10px;
    border-radius: 999px;
    background: rgba(255, 152, 0, 0.15);
    color: #ff9800;
    font-weight: 900;
    cursor: pointer;
    white-space: nowrap;
}

.gd-bubble-date {
    font-size: 10px;
}

.gd-bubble-icon {
    width: 18px;
    height: 18px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(255, 152, 0, 0.2);
    font-size: 11px;
}
</style>
