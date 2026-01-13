<template>
    <div class="hdr">
        <div class="left">{{ title }}</div>
        <div class="right">
            <div class="r-label">{{ rightLabel }}</div>
            <div class="r-value" :class="toneClass(rightTone)">{{ rightValue }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Tone } from "../types";
defineProps<{ title: string; rightLabel: string; rightValue: string; rightTone: Tone }>();

function toneClass(t: Tone) {
    return t === "critical" ? "t-critical" : t === "risk" ? "t-risk" : "t-ok";
}
</script>

<style scoped>
.hdr {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
}

.left {
    font-size: 14px;
    font-weight: 900;
    color: #0e1730;
}

.right {
    text-align: right;
}

.r-label {
    font-size: 11px;
    font-weight: 900;
    color: #9aa6b6;
    letter-spacing: 0.8px;
}

.r-value {
    margin-top: 4px;
    font-size: 12px;
    font-weight: 900;
}

.t-critical {
    color: #ef4444;
}

.t-risk {
    color: #f97316;
}

.t-ok {
    color: #16a34a;
}
</style>
