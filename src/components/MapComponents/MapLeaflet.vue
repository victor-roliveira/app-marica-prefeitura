<template>
    <div class="map-container">
        <LMap :zoom="zoom" :center="center" style="height: 85vh; width: 100%; border-radius: 12px;">
            <LTileLayer :url="tileLayer" />
            <!-- Marcadores com tooltip -->
            <LMarker v-for="p in projetos" :key="p.id" :lat-lng="[p.lat, p.lng]" :icon="getIcon(p.numero)"
                @click="openProjeto(p)">
                <LTooltip :options="{ direction: 'top', offset: [0, -10], sticky: true }">
                    <div class="tooltip" style="font-size: 0.85rem;">
                        <strong>{{ p.titulo }}</strong><br />
                        Executor: {{ p.executor }}<br />
                        Conclusão: {{ p.conclusao }}
                    </div>
                </LTooltip>
            </LMarker>
        </LMap>
        <!-- Modal -->
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title class="text-h6">
                    {{ projetoSelecionado?.titulo }}
                </v-card-title>

                <v-card-text>
                    <div><strong>Executor:</strong> {{ projetoSelecionado?.executor }}</div>
                    <div><strong>Conclusão:</strong> {{ projetoSelecionado?.conclusao }}</div>
                    <div><strong>Valor da Obra:</strong> {{ projetoSelecionado?.valor }}</div>
                    <div><strong>Prazo:</strong> {{ projetoSelecionado?.prazo }}</div>
                    <div><strong>Início Estimado:</strong> {{ projetoSelecionado?.inicio }}</div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn class="text-white" color="orange" variant="flat" @click="dialog = false">
                        Fechar
                    </v-btn>
                </v-card-actions>

            </v-card>
        </v-dialog>
    </div>
</template>


<script setup>
import { ref } from "vue";
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";

import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

// REGISTRAR OS COMPONENTES MANUALMENTE
defineExpose({
    LMap,
    LTileLayer,
    LMarker,
});

const center = ref([-22.9194, -42.8182]);
const zoom = ref(12);

const tileLayer = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const dialog = ref(false);
const projetoSelecionado = ref(null);

const projetos = ref([
    {
        id: 1,
        numero: 1,
        titulo: "Curva Di Branco",
        executor: "SOMAR",
        conclusao: "Agosto/2025",
        valor: "R$ 10.000.000,00",
        prazo: "12 meses",
        inicio: "Junho/2026",
        lat: -22.9390,
        lng: -42.8296,
    },
    {
        id: 2,
        numero: 2,
        titulo: "Câmara",
        executor: "...",
        conclusao: "...",
        valor: "...",
        prazo: "...",
        inicio: "...",
        lat: -22.9180,
        lng: -42.8136
    },
    {
        id: 3,
        numero: 3,
        titulo: "Rodoviária Antiga",
        executor: "...",
        conclusao: "...",
        valor: "...",
        prazo: "...",
        inicio: "...",
        lat: -22.9164,
        lng: -42.8121
    },
    {
        id: 4,
        numero: 4,
        titulo: "Rodoviária Nova",
        executor: "...",
        conclusao: "...",
        valor: "R$ 750.000.000,00",
        prazo: "...",
        inicio: "...",
        lat: -22.8976,
        lng: -42.7826
    }, 
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
        lng: -42.9330
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
        lng: -42.9460
    },
    {
        id: 7,
        numero: 7,
        titulo: "Parque Inundável",
        executor: "...",
        conclusao: "...",
        valor: "R$ ...",
        prazo: "18 meses",
        inicio: "...",
        lat: -22.9950,
        lng: -42.8059
    }, 
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
        lng: -42.8094
    }
])

function getIcon(numero) {
    return L.divIcon({
        html: `
      <div style="
        width:18px;
        height:18px;
        background:#ff5825;
        border-radius:50%;
        color:white;
        display:flex;
        align-items:center;
        justify-content:center;
        font-weight:bold;
        border:2px solid white;
        box-shadow:0 2px 6px rgba(0,0,0,0.5);
      ">${numero}</div>
    `,
        iconSize: [32, 32],
        className: "custom-marker",
    });
}

function openProjeto(p) {
    projetoSelecionado.value = p;
    dialog.value = true;
}
</script>

<style>
.map-container {
    width: 100%;
    height: 100%;
}

.v-card {
    font-family: 'Montserrat';
}

.v-card-title {
    font-family: 'Montserrat' !important;
    font-weight: 900 !important;
}

.custom-marker {
    font-family: 'Montserrat';
}

.tooltip {
    font-family: 'Montserrat';
}

.leaflet-container  {
    height: 600px !important;
}
</style>
