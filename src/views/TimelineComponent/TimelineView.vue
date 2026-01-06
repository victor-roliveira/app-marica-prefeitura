<template>
    <v-container fluid>
        <div class="container-main">
            <h1 class="mb-2">
                Acompanhamento - Maricá
            </h1>

            <ProjectTimeline :data="batalhaoMock" />
        </div>
    </v-container>
</template>

<script setup>
import { batalhaoMock } from "../../components/ProjectTimeline/mock";
import ProjectTimeline from "../../components/ProjectTimeline/ProjectTimeline.vue";
</script>

<style scoped>
h1 {
    font-family: 'Montserrat';
    font-weight: 400 !important;
    font-size: 15px;
}

@media (max-width: 768px) {}
</style>