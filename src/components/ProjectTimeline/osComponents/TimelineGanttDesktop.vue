<template>
    <div class="gd-root">
        <!-- Header -->
        <div class="gd-head">
            <div>
                <div class="gd-subtitle">Cronograma de Marcos e Entregas</div>
            </div>
        </div>

        <!-- Card -->
        <div class="gd-card">
            <div class="gd-scroll">
                <div class="gd-canvas" :style="{ minWidth: canvasMinWidthPx + 'px' }">
                    <div class="gd-chart">
                        <!-- Axis (MESES) -->
                        <div class="gd-axis">
                            <div v-for="m in months" :key="m.key" class="gd-axis-tick" :style="{ left: m.xPct + '%' }">
                                <div class="gd-axis-label">{{ m.label }}</div>
                            </div>
                        </div>

                        <!-- Grid -->
                        <div class="gd-grid">
                            <div v-for="m in months" :key="m.key" class="gd-grid-line"
                                :style="{ left: m.xPct + '%' }" />
                        </div>

                        <!-- Rows -->
                        <div class="gd-rows">
                            <div v-for="row in rows" :key="row.step.step_id" class="gd-row"
                                :style="{ height: rowHeightPx + 'px' }">
                                <div class="gd-track">
                                    <!-- label acima da barra -->
                                    <div class="gd-row-label" :style="{ left: dateToXPct(row.baselineStart) + '%' }">
                                        <span class="gd-row-label-name">
                                            {{ row.step.step_name.toUpperCase() }}
                                        </span>
                                        <span v-if="row.progress?.show_percent" class="gd-row-label-pct">
                                            ({{ row.progress?.advance_percent ?? 0 }}%)
                                        </span>
                                    </div>

                                    <!-- baseline bar -->
                                    <div class="gd-bar" :style="barStyle(row.baselineStart, row.baselineEnd, row.color)"
                                        @mouseenter="showTip(row, $event)" @mousemove="moveTip($event)"
                                        @mouseleave="hideTip">
                                        <div class="gd-bar-progress"
                                            :style="{ width: (row.progress?.advance_percent ?? 0) + '%' }" />

                                        <!-- status icon no fim (AGORA SÓ QUANDO RELEVANTE) -->
                                        <div v-if="row.statusIcon" class="gd-end-icon" :title="row.statusTitle">
                                            <span class="gd-end-icon-inner">{{ row.statusIcon }}</span>
                                        </div>
                                    </div>

                                    <!-- extension (atraso) -->
                                    <div v-if="row.extensionEnd && isAfter(row.extensionEnd, row.baselineEnd)"
                                        class="gd-extension"
                                        :style="barStyle(row.baselineEnd, row.extensionEnd, row.alterColor)"
                                        @mouseenter="showTip(row, $event)" @mousemove="moveTip($event)"
                                        @mouseleave="hideTip" />

                                    <!-- milestones: marcadores discretos -->
                                    <button v-for="ms in row.milestonesInRange" :key="ms.milestone_id" class="gd-ms"
                                        type="button" :style="{ left: dateToXPct(ms.milestone_date) + '%' }"
                                        @mouseenter="showMilestoneTip(ms, $event)" @mousemove="moveTip($event)"
                                        @mouseleave="hideTip" @click="onMilestone(ms)" aria-label="Milestone" />

                                    <!-- bubble no fim do atraso -->
                                    <button v-if="row.bubbleDate" class="gd-bubble" type="button"
                                        :style="{ left: dateToXPct(row.bubbleDate) + '%' }"
                                        @click="onAlteration(row.bubbleAlteration)">
                                        <span class="gd-bubble-date">{{ formatBR(row.bubbleDate) }}</span>
                                        <span class="gd-bubble-icon">{{ row.bubbleAlteration?.icon ?? "🔄️" }}</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Inauguração -->
                            <div class="gd-row" :style="{ height: rowHeightPx + 'px' }">
                                <div class="gd-track">
                                    <div class="gd-row-label" :style="{ left: dateToXPct(inaugStart) + '%' }">
                                        <span class="gd-row-label-name">INAUGURAÇÃO</span>
                                    </div>

                                    <div class="gd-bar" :style="barStyle(inaugStart, inaugEnd, inaugColor)"
                                        @mouseenter="showInaugTip($event)" @mousemove="moveTip($event)"
                                        @mouseleave="hideTip">
                                        <div class="gd-end-icon" title="Inauguração">
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

                        <!-- Tooltip -->
                        <div v-if="tip.open" class="gd-tooltip" :style="{ left: tip.x + 'px', top: tip.y + 'px' }">
                            <div class="gd-tooltip-title">{{ tip.title }}</div>
                            <div class="gd-tooltip-sub">{{ tip.subtitle }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import type {
    Alteration,
    ISODate,
    Milestone,
    Project,
    Stage,
    StageProgress,
    TimelineConfig,
} from "../helpers/types";

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

const rowHeightPx = computed(() => 56);
const inaugColor = computed(
    () => props.inaugurColor ?? props.config?.color_inauguration ?? "#0A2A66"
);

function parseISO(d: ISODate): Date {
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

const domainStart = computed(() => {
    const dates: ISODate[] = [
        props.project.start_date,
        ...props.progress.map((p) => p.step_start_date),
        ...props.milestones.map((m) => m.milestone_date),
        ...props.alterations.map((a) => a.impact_start_date ?? a.change_date),
    ].filter(Boolean) as ISODate[];

    let min = dates[0] ?? props.project.start_date;
    for (const d of dates) if (parseISO(d) < parseISO(min)) min = d;
    return toISO(startOfMonth(parseISO(min)));
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

    const dt = startOfMonth(parseISO(max));
    return toISO(addMonths(dt, 1));
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
    const width = Math.max(0.8, right - left);
    return { left: left + "%", width: width + "%", backgroundColor: color };
}

const domainDays = computed(() => {
    const a = parseISO(domainStart.value);
    const b = parseISO(domainEnd.value);
    return Math.max(1, daysBetween(a, b));
});
const pxPerDay = computed(() => 3.2);
const canvasMinWidthPx = computed(() => {
    const base = Math.round(domainDays.value * pxPerDay.value);
    return Math.max(1400, base);
});

const months = computed(() => {
    const start = parseISO(domainStart.value);
    const end = parseISO(domainEnd.value);

    const items: Array<{ key: string; label: string; xPct: number }> = [];
    let cur = startOfMonth(start);

    for (let i = 0; i < 200; i++) {
        if (cur.getTime() > end.getTime()) break;
        const key = `${cur.getFullYear()}-${cur.getMonth() + 1}`;
        const label = cur.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase();
        items.push({ key, label, xPct: dateToXPct(toISO(cur)) });
        cur = addMonths(cur, 1);
    }

    return items;
});

const stagesSorted = computed(() =>
    [...props.stages].sort((a, b) => {
        const d = a.view_order - b.view_order;
        if (d !== 0) return d;
        return a.step_name.localeCompare(b.step_name);
    })
);

function findProgress(step_id: string): StageProgress | undefined {
    return props.progress.find(
        (p) => p.step_id === step_id && p.project_id === props.project.project_id
    );
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
        const baselineStart = prog?.step_start_date ?? props.project.start_date;
        const baselineEnd = prog?.step_end_date ?? props.project.end_date;

        const alts = alterationsForStep(step.step_id);

        let extensionEnd: ISODate | null = null;
        let bubbleAlteration: Alteration | null = null;

        for (const a of alts) {
            const candidate = a.new_end_date ?? a.impact_end_date ?? null;
            if (!candidate) continue;
            if (!isAfter(candidate, baselineEnd)) continue;

            if (!extensionEnd || isAfter(candidate, extensionEnd)) {
                extensionEnd = candidate;
                bubbleAlteration = a;
            }
        }

        const milestonesInRange = props.milestones
            .filter((m) => m.project_id === props.project.project_id)
            .filter((m) => milestoneInRange(m, baselineStart, extensionEnd ?? baselineEnd));

        const showChecked = props.config?.show_icons_checked ?? true;

        let statusIcon: string | null = null;
        let statusTitle = "";

        if (prog?.completed) {
            statusIcon = showChecked ? (step.checked_icon ?? "✅") : "✓";
            statusTitle = "Concluído";
        } else if (bubbleAlteration) {
            statusIcon = bubbleAlteration.icon ?? "🔄️";
            statusTitle = `Alteração #${bubbleAlteration.change_number}`;
        }

        return {
            step,
            progress: prog,
            color: "#B1D48C",
            alterColor: bubbleAlteration?.change_color ?? "#FF9800",
            baselineStart,
            baselineEnd,
            extensionEnd,
            bubbleDate: extensionEnd,
            bubbleAlteration,
            milestonesInRange,
            statusIcon,
            statusTitle,
        };
    });
});

const inaugStart = computed(() => {
    const end = parseISO(props.project.inauguration_date);
    const start = new Date(end);
    start.setDate(start.getDate() - 45);
    const iso = toISO(start);
    return parseISO(iso) < parseISO(domainStart.value) ? domainStart.value : iso;
});
const inaugEnd = computed(() => props.project.inauguration_date);

const tip = reactive({
    open: false,
    x: 0,
    y: 0,
    title: "",
    subtitle: "",
});

function showTip(row: any, ev: MouseEvent) {
    tip.open = true;
    tip.title = `${row.step.step_name} (${row.progress?.advance_percent ?? 0}%)`;
    tip.subtitle = `Início: ${formatBR(row.baselineStart)} • Fim: ${formatBR(row.baselineEnd)}`;
    moveTip(ev);
}

function showMilestoneTip(m: Milestone, ev: MouseEvent) {
    tip.open = true;
    tip.title = m.description;
    tip.subtitle = `Data: ${formatBR(m.milestone_date)}`;
    moveTip(ev);
}

function showInaugTip(ev: MouseEvent) {
    tip.open = true;
    tip.title = "Inauguração";
    tip.subtitle = `Data: ${formatBR(props.project.inauguration_date)}`;
    moveTip(ev);
}

function moveTip(ev: MouseEvent) {
    tip.x = ev.clientX + 12;
    tip.y = ev.clientY + 12;
}

function hideTip() {
    tip.open = false;
}

function onMilestone(m: Milestone) {
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

.gd-scroll {
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 8px;
}

.gd-canvas {
    position: relative;
    min-width: 1400px;
}

.gd-scroll::-webkit-scrollbar {
    height: 10px;
}

.gd-scroll::-webkit-scrollbar-thumb {
    background: rgba(150, 165, 195, 0.35);
    border-radius: 999px;
}

.gd-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.gd-chart {
    position: relative;
}

.gd-axis {
    position: relative;
    height: 26px;
    margin-bottom: 10px;
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
    user-select: none;
}

.gd-grid {
    position: absolute;
    inset: 26px 0 0 0;
    pointer-events: none;
    z-index: 0;
}

.gd-grid-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0;
    border-left: 1px dashed rgba(160, 175, 205, 0.18);
}

.gd-rows {
    position: relative;
    z-index: 1;
}

.gd-row {
    position: relative;
    display: flex;
    align-items: center;
}

.gd-track {
    position: relative;
    width: 100%;
    height: 65%;
}

.gd-row-label {
    position: absolute;
    top: 8px;
    transform: translateY(-100%);
    display: inline-flex;
    gap: 6px;
    align-items: baseline;
    pointer-events: none;
    z-index: 3;
}

.gd-row-label-name,
.gd-row-label-pct {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 8px 24px rgba(20, 32, 56, 0.06);
}

.gd-row-label-name {
    font-size: 11px;
    font-weight: 900;
    color: #6f7fa0;
    letter-spacing: 1px;
    max-width: 260px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.gd-row-label-pct {
    font-size: 11px;
    font-weight: 900;
    color: #8f9db5;
    white-space: nowrap;
}

/* bars */
.gd-bar,
.gd-extension {
    position: absolute;
    top: 62%;
    transform: translateY(-50%);
    height: 18px;
    border-radius: 999px;
    overflow: visible;
    z-index: 2;
}

.gd-bar-progress {
    height: 100%;
    background: #1CA656;
    border-radius: 999px;
}

.gd-extension {
    opacity: 0.6;
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

.gd-ms {
    position: absolute;
    top: 62%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 999px;
    border: 2px solid rgba(255, 255, 255, 0.9);
    background: rgba(15, 65, 190, 0.35);
    cursor: pointer;
    z-index: 4;
}

.gd-bubble {
    position: absolute;
    top: 62%;
    transform: translate(10px, -50%);
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
    z-index: 5;
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

.gd-tooltip {
    position: fixed;
    z-index: 50;
    min-width: 180px;
    max-width: 320px;
    background: #0b1b34;
    color: #fff;
    border-radius: 10px;
    padding: 10px 12px;
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.25);
    pointer-events: none;
}

.gd-tooltip-title {
    font-weight: 900;
    font-size: 12px;
    line-height: 1.2;
}

.gd-tooltip-sub {
    margin-top: 4px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.75);
}
</style>
