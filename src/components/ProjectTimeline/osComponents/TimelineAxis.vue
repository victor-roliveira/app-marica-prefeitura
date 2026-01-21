<template>
  <div class="ta-root" :style="{ height: heightPx + 'px' }">
    <div class="ta-guide" />

    <!-- MODE: DOTS (MOBILE) -->
    <template v-if="mode === 'dots'">
      <!-- milestones -->
      <button
        v-for="m in sortedMilestones"
        :key="'ms-' + m.milestone_id"
        type="button"
        class="ta-dot ta-dot--milestone"
        :class="{ fixed: m.fixed }"
        :style="{ top: getTopPx(m.milestone_date) + 'px' }"
        @click="emitSelectMilestone(m)"
        :aria-label="`Marco: ${formatDate(m.milestone_date)} - ${m.description}`"
      />

      <!-- step ends (baseline) -->
      <button
        v-for="e in sortedStepEnds"
        :key="'end-' + e.step_id"
        type="button"
        class="ta-dot ta-dot--stepend"
        :style="{ top: getTopPx(e.step_end_date) + 'px' }"
        @click="emitSelectStepEnd(e)"
        :aria-label="`Término da etapa: ${e.step_name} em ${formatDate(e.step_end_date)}`"
        :title="`Término - ${e.step_name}`"
      />
    </template>

    <!-- MODE: LIST (DESKTOP / DEBUG) -->
    <template v-else>
      <!-- Milestones -->
      <button
        v-for="m in sortedMilestones"
        :key="'ms-' + m.milestone_id"
        type="button"
        class="ta-item ta-btn"
        :class="{ fixed: m.fixed }"
        :style="{ top: getTopPx(m.milestone_date) + 'px' }"
        @click="emitSelectMilestone(m)"
        :aria-label="`Marco: ${formatDate(m.milestone_date)} - ${m.description}`"
      >
        <div class="ta-tick" />
        <div class="ta-text">
          <div class="ta-date">{{ formatDate(m.milestone_date) }}</div>
          <div class="ta-label">{{ m.description }}</div>
        </div>
      </button>

      <!-- Step ends (baseline) -->
      <button
        v-for="e in sortedStepEnds"
        :key="'end-' + e.step_id"
        type="button"
        class="ta-item ta-btn ta-stepend"
        :style="{ top: getTopPx(e.step_end_date) + 'px' }"
        @click="emitSelectStepEnd(e)"
        :aria-label="`Término da etapa: ${e.step_name} em ${formatDate(e.step_end_date)}`"
      >
        <div class="ta-tick ta-tick-stepend" />
        <div class="ta-text">
          <div class="ta-date">{{ formatDate(e.step_end_date) }}</div>
          <div class="ta-label">Término - {{ e.step_name }}</div>
        </div>
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ISODate, Milestone, Stage, StageProgress } from "../helpers/types";

type StepEnd = { step_id: string; step_name: string; step_end_date: ISODate };

type AxisSelect =
  | { kind: "milestone"; milestone: Milestone }
  | { kind: "step-end"; step_id: string; step_name: string; step_end_date: ISODate };

const props = defineProps<{
  milestones: Milestone[];
  stages: Stage[];
  progress: StageProgress[];
  rangeStart: ISODate;
  rangeEnd: ISODate;
  heightPx: number;
  mode?: "list" | "dots";
}>();

const mode = computed(() => props.mode ?? "list");

const emit = defineEmits<{
  (e: "select", payload: AxisSelect): void;
}>();

function formatDate(dateIso: ISODate): string {
  const [y, m, d] = String(dateIso).split("-");
  if (!y || !m || !d) return String(dateIso);
  return `${d}/${m}/${y}`;
}

function toLocalMiddayTime(dateIso: ISODate): number {
  const [y, m, d] = String(dateIso).split("-").map(Number);
  if (!y || !m || !d) return NaN;
  return new Date(y, m - 1, d, 12, 0, 0, 0).getTime();
}

const sortedMilestones = computed(() =>
  [...props.milestones].sort(
    (a, b) => toLocalMiddayTime(a.milestone_date) - toLocalMiddayTime(b.milestone_date)
  )
);

const stageNameById = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {};
  for (const s of props.stages) map[s.step_id] = s.step_name;
  return map;
});

const stepEnds = computed<StepEnd[]>(() => {
  const out: StepEnd[] = [];
  for (const p of props.progress) {
    if (!p.step_end_date) continue;
    out.push({
      step_id: p.step_id,
      step_name: stageNameById.value[p.step_id] ?? p.step_id,
      step_end_date: p.step_end_date,
    });
  }
  return out;
});

const sortedStepEnds = computed(() =>
  [...stepEnds.value].sort(
    (a, b) => toLocalMiddayTime(a.step_end_date) - toLocalMiddayTime(b.step_end_date)
  )
);

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function getTopPx(dateIso: ISODate): number {
  const start = toLocalMiddayTime(props.rangeStart);
  const end = toLocalMiddayTime(props.rangeEnd);
  const d = toLocalMiddayTime(dateIso);

  const denom = Math.max(1, end - start);
  const ratio = clamp((d - start) / denom, 0, 1);

  const padTop = 8;
  const padBottom = 8;
  const usable = Math.max(1, props.heightPx - padTop - padBottom);

  return padTop + ratio * usable;
}

function emitSelectMilestone(m: Milestone) {
  emit("select", { kind: "milestone", milestone: m });
}

function emitSelectStepEnd(e: StepEnd) {
  emit("select", {
    kind: "step-end",
    step_id: e.step_id,
    step_name: e.step_name,
    step_end_date: e.step_end_date,
  });
}
</script>

<style scoped>
.ta-root {
  position: relative;
  min-width: 0;
}

.ta-guide {
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 2px;
}

.ta-dot {
  position: absolute;
  left: 7px;
  transform: translateY(-50%);
  padding: 0;
  cursor: pointer;
  background: #fff;
  border-radius: 999px;
  border: 6px solid rgba(0, 0, 0, 0.35);
  pointer-events: auto;
  touch-action: manipulation;
  z-index: 5;
  -webkit-tap-highlight-color: transparent;
}

.ta-dot::after {
  content: "";
  position: absolute;
  inset: -10px;     
  border-radius: 999px;
  background: transparent;
}

.ta-dot--milestone {
  width: 12px;
  height: 12px;
}

.ta-dot--stepend {
  width: 10px;
  height: 10px;
  border-style: dashed;
  opacity: 0.9;
}

.ta-dot.fixed {
  border-color: rgba(0, 0, 0, 0.55);
}

.ta-btn {
  background: transparent;
  border: 0;
  padding: 0;
  text-align: left;
  cursor: pointer;
}

.ta-item {
  position: absolute;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: grid;
  grid-template-columns: 18px 1fr;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.ta-tick {
  width: 10px;
  height: 2px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  margin-left: 6px;
}

.ta-text {
  min-width: 0;
}

.ta-date {
  font-size: 11px;
  font-weight: 800;
  line-height: 1.05;
}

.ta-label {
  font-size: 10px;
  line-height: 1.05;
  opacity: 0.85;
  white-space: normal;
  word-break: break-word;
}

.ta-item.fixed .ta-date {
  font-weight: 900;
}

.ta-tick-stepend {
  background: rgba(0, 0, 0, 0.18);
  outline: 1px dashed rgba(0, 0, 0, 0.25);
}
</style>
