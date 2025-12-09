<template>
    <v-container fluid class="py-6">
        <h1 class="text-h4 font-weight-bold mb-6">
            Projetos Concluídos e em Contratação - Maricá
        </h1>

        <MapLeaflet />
    </v-container>
</template>

<script setup>
import MapLeaflet from '../../components/MapComponents/MapLeaflet.vue';
</script>

<style scoped>
h1 {
    font-family: 'Albert Sans';
    font-weight: 300 !important;
}
</style>