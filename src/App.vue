<template>
  <v-app>
    <!-- Barra de navegação -->
    <v-app-bar class="text-white" color="orange" elevation="4">
      <v-container class="d-flex align-center justify-space-between">

        <!-- Logo -->
        <div class="d-flex align-center">
          <img src="./assets/logo-quanta-oficial.png" alt="Quanta" height="32" />
        </div>

        <!-- TABS (DESKTOP) -->
        <v-tabs v-if="!isMobile" v-model="currentTab" density="comfortable" align-tabs="end" class="flex-grow-1">
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

        <v-list-item title="Acompanhamento" prepend-icon="mdi-chart-bell-curve-cumulative"
          @click="navigateMobile('/acompanhamento')" />
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

// Detecta mobile
const isMobile = computed(() => mobile.value)

// Sincroniza tab com rota
const currentTab = computed({
  get() {
    if (route.name === 'projetos') return 'projetos'
    if (route.name === 'acompanhamento') return 'acompanhamento'
    return 'home'
  },
  set() { },
})

// Navegação desktop
function goTo(path) {
  if (route.path !== path) {
    router.push(path)
  }
}

// Navegação mobile (fecha drawer)
function navigateMobile(path) {
  drawer.value = false
  if (route.path !== path) {
    router.push(path)
  }
}
</script>

<style scoped>
.v-tabs,
.v-list-item {
  font-family: 'Montserrat';
  font-weight: 800;
}
</style>
