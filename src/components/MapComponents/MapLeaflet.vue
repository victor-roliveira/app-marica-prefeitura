<template>
    <div class="map-container">
        <LMap :zoom="zoom" :center="center" style="height: 85vh; width: 100%; border-radius: 12px;">
            <LTileLayer :url="tileLayer" />
            <!-- Marcadores com tooltip -->
            <LMarker v-for="p in projetos" :key="p.id" :lat-lng="[p.lat, p.lng]" :icon="getIcon(p.numero)"
                @click="openProjeto(p)">
                <LTooltip :options="{ direction: 'top', offset: [0, -10], sticky: true }">
                    <div style="font-size: 0.85rem;">
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

// IMPORTAÇÃO CORRETA DA BIBLIOTECA BOA
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";

// IMPORTANTE
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
        titulo: "Mergulhão e Parque Linear de Inoã",
        executor: "SOMAR",
        conclusao: "Maio/2025",
        valor: "R$ 750.000.000,00",
        prazo: "36 meses",
        inicio: "Maio/2026",
        lat: -22.9330,
        lng: -42.9647,
    },
    {
        id: 2,
        numero: 2,
        titulo: "13º Batalhão de Polícia Militar",
        executor: "SOMAR",
        conclusao: "Julho/2025",
        valor: "R$ 10.000.000,00",
        prazo: "12 meses",
        inicio: "Junho/2026",
        lat: -22.9118,
        lng: -42.8153
    },
    {
        id: 3,
        numero: 3,
        titulo: "Pórticos",
        executor: "SOMAR",
        conclusao: "Junho/2025",
        valor: "R$ 70.000.000,00",
        prazo: "18 meses",
        inicio: "Abril/2026",
        lat: -22.9258,
        lng: -42.7211
    },
    {
        id: 4,
        numero: 4,
        titulo: "Reservatórios e Parques Inundáveis",
        executor: "SANEMAR",
        conclusao: "Julho/2025",
        valor: "R$ 750.000.000,00",
        prazo: "18 meses",
        inicio: "Junho/2026",
        lat: -22.8891,
        lng: -42.8156
    }
])

function getIcon(numero) {
    return L.divIcon({
        html: `
      <div style="
        width:32px;
        height:32px;
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
</style>
