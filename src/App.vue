<template>
  <v-app>
    <!-- Barra de navegação -->
    <v-app-bar class="text-white" color="orange" elevation="4">
      <v-container class="d-flex align-center justify-space-between">

        <!-- Logo / Título -->
        <div class="d-flex align-center">
          <!-- logo -->
          <img src="./assets/logo-quanta.png" alt="Quanta" height="32" class="mr-4" />
          <!-- Título -->
          <span class="text-h6 font-weight-bold">Quanta Consultoria</span>
        </div>

        <!-- Abas de navegação -->
        <v-tabs
          v-model="currentTab"
          density="comfortable"
          align-tabs="end"
          style="max-width: 500px;"
        >
          <v-tab :value="'home'" @click="goTo('/')">
            Página Principal
          </v-tab>
          <v-tab :value="'projetos'" @click="goTo('/projetos')">
            Projetos (Mapa)
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
  set() { /* Vuetify exige setter, mas vamos navegar manualmente em goTo */ },
})

function goTo(path) {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>

<style scoped>
 span {
  font-family: 'Albert Sans';
  font-weight: 800 !important;
 }
</style>