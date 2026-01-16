<template>
    <v-container fluid>
        <div class="os-wrap">
            <!-- Top bar -->
            <div class="os-top">
                <v-btn class="os-back" variant="text" size="small" @click="goBack">
                    <v-icon start>mdi-arrow-left</v-icon>
                    VOLTAR
                </v-btn>

                <div class="os-title">OBJETO DA OS</div>
                <div class="os-spacer" />
            </div>

            <!-- Se não existir projeto/OS -->
            <v-alert v-if="!os" type="warning" variant="tonal">
                Não há dados de “Objeto da OS” para este projeto.
            </v-alert>

            <template v-else>
                <!-- ORDEM DE SERVIÇO -->
                <div class="os-card">
                    <div class="os-card-title">ORDEM DE SERVIÇO</div>

                    <div class="os-osname">{{ os.summary.title }}</div>

                    <div class="os-osmeta">
                        <span class="os-pill">{{ os.summary.osCode }}</span>
                        <span class="os-pill os-pill-status">{{ os.summary.status }}</span>
                    </div>

                    <div class="os-osinfo">
                        <div class="os-info-row">
                            <div class="os-info-k">Demandante</div>
                            <div class="os-info-v">{{ os.summary.requester }}</div>
                        </div>
                        <div class="os-info-row">
                            <div class="os-info-k">Vigência</div>
                            <div class="os-info-v">{{ os.summary.durationText }}</div>
                        </div>
                        <div class="os-info-row">
                            <div class="os-info-k">Início contratual</div>
                            <div class="os-info-v">{{ fmtDate(os.summary.contractStart) }}</div>
                        </div>
                        <div class="os-info-row">
                            <div class="os-info-k">Conclusão prevista</div>
                            <div class="os-info-v">{{ fmtDate(os.summary.expectedEnd) }}</div>
                        </div>
                    </div>
                </div>

                <!-- OBJETO -->
                <div class="os-card">
                    <div class="os-card-title">OBJETO DA OS</div>
                    <div class="os-body-text">{{ os.objectText }}</div>
                </div>

                <!-- ESCOPO -->
                <div class="os-card">
                    <div class="os-card-title">ESCOPO DA OS</div>

                    <div class="os-scope">
                        <div>
                            <div class="os-scope-sub">Inclui</div>
                            <div class="os-scope-item" v-for="(t, i) in os.scope.includes" :key="'inc' + i">
                                <v-icon size="18" class="os-ic-ok">mdi-check-circle</v-icon>
                                <span>{{ t }}</span>
                            </div>
                        </div>

                        <div>
                            <div class="os-scope-sub">Não inclui</div>
                            <div class="os-scope-item" v-for="(t, i) in os.scope.excludes" :key="'exc' + i">
                                <v-icon size="18" class="os-ic-no">mdi-close-circle</v-icon>
                                <span>{{ t }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MARCOS -->
                <div class="os-card">
                    <div class="os-card-title">MARCOS CONTRATUAIS</div>

                    <div class="os-list-item" v-for="m in os.contractMilestones" :key="m.id">
                        <div>
                            <div class="os-list-title">{{ m.title }}</div>
                            <div v-if="m.linkText" class="os-list-sub">{{ m.linkText }}</div>
                        </div>

                        <div class="os-badge" :class="badgeClass(m.status)">{{ m.status }}</div>
                    </div>
                </div>

                <!-- PRODUTOS -->
                <div class="os-card">
                    <div class="os-card-title">PRODUTOS ESPERADOS</div>

                    <div class="os-product" v-for="p in os.expectedProducts" :key="p.id">
                        <div class="os-product-ic">
                            <v-icon size="22">{{ p.icon ?? "mdi-package-variant-closed" }}</v-icon>
                        </div>
                        <div>
                            <div class="os-product-title">{{ p.title }}</div>
                            <div v-if="p.subtitle" class="os-product-sub">{{ p.subtitle }}</div>
                        </div>
                    </div>
                </div>

                <!-- OBSERVAÇÕES -->
                <div class="os-card">
                    <div class="os-card-title">OBSERVAÇÕES RELEVANTES</div>

                    <div class="os-note" v-for="(t, i) in os.notes" :key="'n' + i">
                        <v-icon size="18" class="os-ic-warn">mdi-alert</v-icon>
                        <span>{{ t }}</span>
                    </div>
                </div>
            </template>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useActiveProject } from "../../../composables/useActiveProject";

const route = useRoute();
const router = useRouter();
const { screenData, setActiveProjectId } = useActiveProject();

const projectId = computed(() => String(route.params.projectId || ""));

setActiveProjectId(projectId.value);

const os = computed(() => screenData.value?.os ?? null);

function goBack() {
    router.push(`/acompanhamento/${projectId.value}`);
}

function fmtDate(iso: string) {
    const [y, m, d] = (iso ?? "").split("-");
    if (!y || !m || !d) return iso;
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const mm = Number(m);
    return `${d} ${months[mm - 1] ?? m} ${y}`;
}

function badgeClass(status: string) {
    if (status === "OK") return "os-badge-ok";
    if (status === "Em atraso") return "os-badge-late";
    return "os-badge-att";
}
</script>

<style scoped>
.os-wrap {
    /* MUDANÇA: De flex para grid para facilitar o layout 2D */
    display: grid;
    grid-template-columns: 1fr; /* Padrão mobile: 1 coluna */
    gap: 14px;
    padding: 6px 0 10px;
    font-family: "Montserrat";
}

/* --- REGRAS PARA DESKTOP --- */
@media (min-width: 960px) {
    .os-wrap {
        /* Define 2 colunas iguais */
        grid-template-columns: 1fr 1fr;
        /* Alinha os itens no topo (para cards de alturas diferentes não esticarem) */
        align-items: start;
    }

    /* O Cabeçalho e o Alerta devem sempre ocupar a largura total (as 2 colunas) */
    .os-top,
    .v-alert {
        grid-column: 1 / -1;
    }
    
    /* Opcional: Se quiser que o primeiro card (Resumo da OS) seja full width também, descomente abaixo: */
    /* .os-card:first-of-type { grid-column: 1 / -1; } */
}

.os-top {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 10px;
    padding: 4px 2px;
    /* Nota: Removi a largura fixa, o grid cuida disso */
}

.os-back {
    justify-self: start;
    text-transform: none;
    font-weight: 800;
    color: #64748b;
}

.os-title {
    justify-self: center;
    font-weight: 900;
    letter-spacing: 0.6px;
    font-size: 12px;
    color: #0b1220;
    text-transform: uppercase;
}

.os-spacer {
    justify-self: end;
}

.os-card {
    border-radius: 18px;
    background: #fff;
    border: 1px solid #eef2f6;
    box-shadow: 0 1px 0 rgba(12, 16, 24, .06), 0 8px 18px rgba(12, 16, 24, .05);
    padding: 14px;
    /* Garante que o card preencha a célula do grid */
    width: 100%; 
    height: 100%; /* Opcional: faz cards na mesma linha terem mesma altura visual se remover o align-items: start */
}

.os-card-title {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: .8px;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 10px;
}

.os-osname {
    font-size: 16px;
    font-weight: 900;
    color: #0b1220;
}

.os-osmeta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin: 8px 0 12px;
}

.os-pill {
    background: #eef2f6;
    color: #2c3a4b;
    font-weight: 900;
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 11px;
}

.os-pill-status {
    background: #e9f8ee;
    color: #1f7a3b;
}

.os-osinfo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 14px;
}

.os-info-k {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: .6px;
    text-transform: uppercase;
    color: #64748b;
}

.os-info-v {
    font-size: 12px;
    font-weight: 800;
    color: #0b1220;
}

.os-body-text {
    font-size: 12px;
    font-weight: 600;
    color: #0b1220;
    line-height: 1.5;
}

.os-scope {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}

.os-scope-sub {
    font-size: 12px;
    font-weight: 900;
    color: #0b1220;
    margin-bottom: 8px;
}

.os-scope-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 12px;
    font-weight: 700;
    color: #0b1220;
    line-height: 1.35;
    margin-bottom: 10px;
}

.os-ic-ok {
    color: #16a34a;
    margin-top: 1px;
}

.os-ic-no {
    color: #ef4444;
    margin-top: 1px;
}

.os-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 10px;
    border-radius: 14px;
    background: #f8fafc;
    border: 1px solid #eef2f6;
    margin-bottom: 10px;
}

.os-list-title {
    font-size: 12px;
    font-weight: 900;
    color: #0b1220;
}

.os-list-sub {
    font-size: 11px;
    font-weight: 800;
    color: #64748b;
    margin-top: 2px;
}

.os-badge {
    font-size: 10px;
    font-weight: 900;
    border-radius: 999px;
    padding: 6px 10px;
    white-space: nowrap;
}

.os-badge-ok {
    background: #e9f8ee;
    color: #1f7a3b;
}

.os-badge-att {
    background: #fff3e9;
    color: #b45309;
}

.os-badge-late {
    background: #fff1f2;
    color: #b91c1c;
}

.os-product {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    border-radius: 14px;
    background: #f8fafc;
    border: 1px solid #eef2f6;
    margin-bottom: 10px;
}

.os-product-ic {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #eef2f6;
    display: grid;
    place-items: center;
}

.os-product-title {
    font-size: 12px;
    font-weight: 900;
    color: #0b1220;
}

.os-product-sub {
    font-size: 11px;
    font-weight: 800;
    color: #64748b;
    margin-top: 2px;
}

.os-note {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px;
    border-radius: 14px;
    background: #fff7ed;
    border: 1px solid rgba(245, 158, 11, .25);
    font-size: 12px;
    font-weight: 800;
    color: #0b1220;
    margin-bottom: 10px;
}

.os-ic-warn {
    color: #f97316;
    margin-top: 1px;
}
</style>
