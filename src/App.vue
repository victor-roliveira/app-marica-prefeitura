<template>
  <v-app>
    <!-- Barra de navegação -->
    <v-app-bar class="text-white" color="orange" elevation="4">
      <v-container class="d-flex align-center justify-space-between">
        <!-- Logo -->
        <div class="d-flex align-center">
          <!-- logo -->
          <img src="./assets/logo-quanta-oficial.png" alt="Quanta" height="32" class="mr-4" />
        </div>
        <!-- Abas de navegação -->
        <v-tabs v-model="currentTab" density="comfortable" align-tabs="end" class="flex-grow-1">
          <v-tab :value="'home'" @click="goTo('/')">
            <v-icon start>mdi-home</v-icon>
            Página Principal
          </v-tab>
          <v-tab :value="'projetos'" @click="goTo('/projetos')">
            <v-icon start>mdi-map-search</v-icon>
            Projetos (Mapa)
          </v-tab>
          <v-tab :value="'projetos'" @click="goTo('/acompanhamento')">
            <v-icon start>mdi-chart-bell-curve-cumulative</v-icon>
            Acompanhamento
          </v-tab>
        </v-tabs>
      </v-container>
    </v-app-bar>
    <!-- Conteúdo principal -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// sincroniza tab com rota
const currentTab = computed({
  get() {
    if (route.name === 'projetos') return 'projetos'
    return 'home'
  },
  set() { },
})

function goTo(path) {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>

<style scoped>
.v-tabs {
  font-family: 'Montserrat';
  font-weight: 800 !important;
}
</style>