<template>
    <div class="row">
        <ChartCard title="Evolução Física" subtitle="Comparativo Planejado vs Real">
            <PhysicalEvolutionChart :data="physicalData" />
        </ChartCard>

        <ChartCard title="Origem de Impactos" subtitle="Distribuição por Categoria">
            <ImpactOriginDonut :data="impactData" centerLabel="Fatores" />
        </ChartCard>
    </div>
</template>

<script setup lang="ts">
import ChartCard from "../Charts/ChartCard.vue";
import PhysicalEvolutionChart, {
    type PhysicalEvolutionPoint,
} from "../Charts/PhysicalEvolutionChart.vue";
import ImpactOriginDonut, {
    type ImpactCategory,
} from "../Charts/ImpactOriginDonut.vue";

const physicalData: PhysicalEvolutionPoint[] = [
    { label: "Jan", projected: 12, executed: 10 },
    { label: "Fev", projected: 24, executed: 24 },
    { label: "Mar", projected: 42, executed: 38 },
    { label: "Abr", projected: 64, executed: 52 },
    { label: "Mai", projected: 85, executed: 68 },
];

const impactData: ImpactCategory[] = [
    { name: "Revisão", value: 35, color: "#4f46e5" },
    { name: "Ambiental", value: 25, color: "#10b981" },
    { name: "Logística", value: 25, color: "#f59e0b" },
    { name: "Outros", value: 15, color: "#94a3b8" },
];
</script>

<style scoped>
.row {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
  font-family: 'Montserrat';
}


@media (min-width: 900px) {
  .row {
    grid-template-columns: 2fr 1fr;
    align-items: stretch;
  }
}

@media (min-width: 1280px) {
  .row {
    gap: 18px;
  }
}
</style>