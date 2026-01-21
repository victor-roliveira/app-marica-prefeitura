<template>
    <div class="pr-wrap">
        <v-progress-circular :model-value="clamped" :size="44" :width="5" color="success" class="pr-ring">
            <span class="pr-text">{{ clamped }}%</span>
        </v-progress-circular>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ value: number }>();

const clamped = computed(() => {
    const v = Number.isFinite(props.value) ? props.value : 0;
    return Math.max(0, Math.min(100, Math.round(v)));
});
</script>

<style scoped>
.pr-wrap {
    display: grid;
    place-items: center;
    width: 56px;
}

.pr-text {
    font-size: 12px;
    font-weight: 700;
}
</style>
