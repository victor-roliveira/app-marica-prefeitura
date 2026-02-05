<template>
    <div class="map-container">
        <div class="map-wrapper">
            <LMap :zoom="zoom" :center="center" class="map-responsive">
                <LTileLayer :url="tileLayer" />

                <LMarker v-for="p in projetos" :key="p.id" :lat-lng="[p.lat, p.lng]" :icon="getIcon(p.numero)"
                    @click="openProjeto(p)">
                    <LTooltip :options="{ direction: 'top', offset: [0, -10], sticky: true }">
                        <div class="tooltip">
                            <strong>{{ p.titulo }}</strong><br />
                            Executor: {{ p.executor }}<br />
                            Conclusão: {{ p.conclusao }}
                        </div>
                    </LTooltip>
                </LMarker>
            </LMap>
        </div>

        <v-dialog v-model="dialog" max-width="500px">
            <v-card rounded="xl">
                <v-card-title class="text-h6 pt-4 px-4">
                    {{ projetoSelecionado?.titulo }}
                </v-card-title>

                <v-card-text class="px-4 py-2">
                    <div class="mb-1"><strong>Executor:</strong> {{ projetoSelecionado?.executor }}</div>
                    <div class="mb-1"><strong>Conclusão:</strong> {{ projetoSelecionado?.conclusao }}</div>
                    <div class="mb-1"><strong>Valor da Obra:</strong> {{ projetoSelecionado?.valor }}</div>
                    <div class="mb-1"><strong>Prazo:</strong> {{ projetoSelecionado?.prazo }}</div>
                    <div class="mb-1"><strong>Início Estimado:</strong> {{ projetoSelecionado?.inicio }}</div>
                </v-card-text>

                <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn variant="text" color="grey" @click="dialog = false">Fechar</v-btn>

                    <v-btn v-if="projetoSelecionado?.osId" class="text-white font-weight-bold" color="orange"
                        variant="flat" rounded="lg" @click="goToDetails">
                        Detalhes
                        <v-icon end icon="mdi-arrow-right" />
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

const router = useRouter();

const center = ref([-22.9194, -42.8182]);
const zoom = ref(10);

const tileLayer = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const dialog = ref(false);
const projetoSelecionado = ref(null);

const projetos = ref([
    { id: 1, numero: 1, titulo: "Curva Di Branco", executor: "SOMAR", conclusao: "Agosto/2025", valor: "R$ 10.000.000,00", prazo: "12 meses", inicio: "Junho/2026", lat: -22.9390, lng: -42.8296, osId: "OS021" },
    { id: 2, numero: 2, titulo: "Câmara", executor: "SOMAR", conclusao: "...", valor: "...", prazo: "...", inicio: "...", lat: -22.9180, lng: -42.8136, osId: "OS034" },
    { id: 3, numero: 3, titulo: "Arquibancada", executor: "SOMAR", conclusao: "...", valor: "...", prazo: "...", inicio: "...", lat: -22.9164, lng: -42.8121 },
    { id: 4, numero: 4, titulo: "Rodoviária", executor: "...", conclusao: "...", valor: "R$ 750.000.000,00", prazo: "...", inicio: "...", lat: -22.8976, lng: -42.7826, osId: "OS028" },

    {
        id: 5,
        numero: 5,
        titulo: "Mergulhão e Parque Linear de INOÃ",
        executor: "SOMAR",
        conclusao: "Maio/2025",
        valor: "R$ 750.000.000,00",
        prazo: "36 meses",
        inicio: "Maio/2026",
        lat: -22.9110,
        lng: -42.9330,
        osId: "OS011"
    },
    {
        id: 6,
        numero: 6,
        titulo: "Pórticos",
        executor: "SOMAR",
        conclusao: "Junho/2025",
        valor: "R$ 70.000.000,00",
        prazo: "18 meses",
        inicio: "Abril/2026",
        lat: -22.8992,
        lng: -42.9460,
        osId: "OS013"
    },
    { id: 7, numero: 7, titulo: "Parque Inundável", executor: "...", conclusao: "...", valor: "R$ ...", prazo: "18 meses", inicio: "...", lat: -22.9950, lng: -42.8059 },
    {
        id: 8,
        numero: 8,
        titulo: "13° Batalhão de Polícia Militar",
        executor: "SOMAR",
        conclusao: "Julho/2025",
        valor: "R$ 10.000.000,00",
        prazo: "12 meses",
        inicio: "Julho/2026",
        lat: -22.9051,
        lng: -42.8094,
        osId: "OS032"
    },
]);

function getIcon(numero) {
    return L.divIcon({
        html: `<div class="marker-badge">${numero}</div>`,
        iconSize: [32, 32],
        className: "custom-marker",
    });
}

function openProjeto(p) {
    projetoSelecionado.value = p;
    dialog.value = true;
}

// 4. FUNÇÃO DE NAVEGAÇÃO
function goToDetails() {
    const p = projetoSelecionado.value;
    if (!p || !p.osId) return;

    // Navega para a rota de acompanhamento passando o ID da planilha
    router.push({
        name: 'acompanhamento',
        params: { projectId: p.osId }
    });

    dialog.value = false;
}
</script>

<style scoped>
.map-container {
    width: 100%;
    display: flex;
    justify-content: center;
}

.map-wrapper {
    width: 100%;
    max-width: 1600px;
    height: 70vh;
    padding: 16px;
}

.map-responsive {
    width: 100%;
    height: 100%;
    border-radius: 12px;
}

:deep(.leaflet-container) {
    width: 100%;
    height: 100%;
    z-index: 1;
    /* Garante que fique abaixo do modal */
}

:deep(.marker-badge) {
    width: 18px;
    height: 18px;
    background: #ff5825;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {

    h1,
    h2 {
        margin-bottom: 8px;
    }

    .map-wrapper {
        height: calc(100vh - 96px);
        padding: 0 0;
    }

    .map-responsive {
        border-radius: 10px;
    }
}

.tooltip,
.custom-marker,
.v-card,
.v-card-title {
    font-family: "Montserrat";
}

.v-card-title {
    font-weight: 900;
}
</style>