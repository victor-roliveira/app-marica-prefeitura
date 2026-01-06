<template>
    <div class="ti-wrap">
        <div class="ti-bar" :style="{ backgroundColor: color }">
            <span class="ti-label">Inauguração</span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ color: string }>();
</script>

<style scoped>
/* wrapper garante que o topo/fundo batam com o eixo */
.ti-wrap {
    height: 100%;
    display: flex;
    align-items: stretch;
}

.ti-bar {
    width: 22px;
    /* mais estreito (achatado) */
    height: 100%;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ti-label {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-size: 11px;
    font-weight: 800;
    color: #fff;
    letter-spacing: 0.4px;
}
</style>
