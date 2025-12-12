<template>
    <v-container fluid>
        <h1 class="mb-2">
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
    font-family: 'Montserrat';
    font-weight: 400 !important;
    font-size: 15px;
}
</style>