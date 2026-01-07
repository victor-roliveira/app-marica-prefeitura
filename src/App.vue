<template>
  <v-app>
    <!-- Barra de navegação -->
    <v-app-bar class="text-white" color="orange" elevation="4">
      <v-container class="d-flex align-center justify-space-between">

        <!-- SELECT DE OBRAS (no lugar da logo) -->
        <div class="d-flex align-center" style="min-width: 0;">
          <v-select
            v-model="selectedProjectId"
            :items="projectOptions"
            item-title="label"
            item-value="id"
            density="compact"
            variant="solo"
            rounded="xl"
            hide-details
            class="project-select"
            placeholder="Selecione a obra"
            @update:model-value="onProjectChange"
          >
            <!-- Valor selecionado -->
            <template #selection="{ item }">
              <span class="project-select-text">
                {{ item.raw.label }}
              </span>
            </template>

            <!-- Itens do dropdown -->
            <template #item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="item.raw.label"
                :subtitle="item.raw.subtitle"
              />
            </template>
          </v-select>
        </div>

        <!-- TABS (DESKTOP) -->
        <v-tabs
          v-if="!isMobile"
          v-model="currentTab"
          density="comfortable"
          align-tabs="end"
          class="flex-grow-1 ml-4"
        >
          <v-tab value="home" @click="goTo('/')">
            <v-icon start>mdi-home</v-icon>
            Página Principal
          </v-tab>

          <v-tab value="projetos" @click="goTo('/projetos')">
            <v-icon start>mdi-map-search</v-icon>
            Projetos (Mapa)
          </v-tab>

          <v-tab value="acompanhamento" @click="goTo('/acompanhamento')">
            <v-icon start>mdi-chart-bell-curve-cumulative</v-icon>
            Acompanhamento
          </v-tab>
        </v-tabs>

        <!-- BOTÃO HAMBURGER (MOBILE) -->
        <v-app-bar-nav-icon v-if="isMobile" @click="drawer = !drawer">
          <v-icon>
            {{ drawer ? 'mdi-close' : 'mdi-menu' }}
          </v-icon>
        </v-app-bar-nav-icon>

      </v-container>
    </v-app-bar>

    <!-- MENU MOBILE -->
    <v-navigation-drawer v-model="drawer" temporary location="right" width="280">
      <v-list nav density="comfortable">
        <v-list-item title="Página Principal" prepend-icon="mdi-home" @click="navigateMobile('/')" />
        <v-list-item title="Projetos (Mapa)" prepend-icon="mdi-map-search" @click="navigateMobile('/projetos')" />
        <v-list-item
          title="Acompanhamento"
          prepend-icon="mdi-chart-bell-curve-cumulative"
          @click="navigateMobile('/acompanhamento')"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Conteúdo principal -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const route = useRoute()
const router = useRouter()
const { mobile } = useDisplay()

const drawer = ref(false)

// ===== SELECT DE OBRAS =====
const projectOptions = [
  { id: 'BAT01', label: 'Batalhão', subtitle: 'Sec. de Educação • #2023-8841' },
  // { id: 'OUT01', label: 'Outra Obra', subtitle: '...' },
]

const selectedProjectId = ref(projectOptions[0].id)

function onProjectChange(id) {
  // aqui no futuro você pode:
  // - atualizar um store (Pinia)
  // - mudar rota (?project=BAT01)
  // - disparar reload de dados
  console.log('Projeto selecionado:', id)
}

// ===== MOBILE =====
const isMobile = computed(() => mobile.value)

// ===== TABS =====
const currentTab = computed({
  get() {
    if (route.name === 'projetos') return 'projetos'
    if (route.name === 'acompanhamento') return 'acompanhamento'
    return 'home'
  },
  set() { },
})

// ===== NAVEGAÇÃO =====
function goTo(path) {
  if (route.path !== path) router.push(path)
}

function navigateMobile(path) {
  drawer.value = false
  if (route.path !== path) router.push(path)
}
</script>

<style scoped>
.v-tabs,
.v-list-item {
  font-family: 'Montserrat';
  font-weight: 800;
}

/* SELECT */
.project-select {
  width: min(70vw, 360px);
}

.project-select-text {
  font-weight: 900;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* harmoniza o select com a app-bar */
:deep(.project-select .v-field) {
  background: rgba(255, 255, 255, 0.95);
}
</style>
