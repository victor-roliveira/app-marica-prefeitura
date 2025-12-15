<template>
    <v-container fluid>
        <div class="container-main">
            <h1 class="mb-2">
                Projetos Concluídos e em Contratação - Maricá
            </h1>

            <MapLeaflet />
        </div>
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

@media (max-width: 768px) {
    
}
</style>