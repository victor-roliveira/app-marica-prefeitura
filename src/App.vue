<template>
  <v-app>
    <!-- Barra de navegação -->
    <v-app-bar class="text-white" color="blue" elevation="4">
      <v-container class="d-flex align-center justify-space-between">
        <!-- SELECT DE OBRAS -->
        <div v-if="!isHome" class="d-flex align-start" style="min-width: 0;">
          <v-select class="project-select" v-model="activeProjectId" :items="options" item-title="label" item-value="id"
            hide-details density="compact" variant="solo" rounded="xl" @update:model-value="onSelectProject">
            <template #selection="{ item }">
              <span class="project-select-text">
                {{ item.raw.label }}
              </span>
            </template>

            <template #item="{ props, item }">
              <v-list-item v-bind="props" :title="item.raw.label" :subtitle="item.raw.subtitle" />
            </template>
          </v-select>
        </div>

        <!-- TABS (DESKTOP) -->
        <v-tabs v-if="!isMobile" v-model="currentTab" density="comfortable" align-tabs="end" class="flex-grow-1 ml-4">
          <v-tab value="projetos" @click="goTo('/projetos-mapa')">
            <v-icon start>mdi-map-search</v-icon>
            <span>Projetos (Mapa)</span>
          </v-tab>

          <v-tab value="acompanhamento" @click="goToAcompanhamento()">
            <v-icon start>mdi-view-dashboard</v-icon>
            <span>Acompanhamento</span>
          </v-tab>

          <v-tab value="logout" @click="handleLogout">
            <v-icon start>mdi-logout</v-icon>
            <span>Sair</span>
          </v-tab>
        </v-tabs>

        <v-app-bar-nav-icon v-if="isMobile" @click="drawer = !drawer">
          <v-icon>
            {{ drawer ? "mdi-close" : "mdi-menu" }}
          </v-icon>
        </v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>

    <!-- MENU MOBILE -->
    <v-navigation-drawer v-model="drawer" temporary location="right" width="280">
      <v-list nav density="comfortable">
        <v-list-item title="Projetos (Mapa)" prepend-icon="mdi-map-search" @click="navigateMobile('/projetos-mapa')" />
        <v-list-item title="Acompanhamento" prepend-icon="mdi-view-dashboard"
          @click="navigateMobileAcompanhamento()" />
        <v-list-item class="my-16" title="Sair" prepend-icon="mdi-logout"
          @click="() => { drawer = false, handleLogout() }" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { useActiveProject } from "./composables/useActiveProject";
import { useAuth } from "./composables/useAuth";

const { activeProjectId, options, setActiveProject } = useActiveProject();

const route = useRoute();
const router = useRouter();
const { mobile } = useDisplay();

const drawer = ref(false);
const isMobile = computed(() => mobile.value);
const isHome = computed(() => route.path === "/login" || route.path === "/projetos-mapa")

const { logout } = useAuth()

function handleLogout() {
  logout()
  router.replace({ name: "login" })
}

const currentTab = computed({
  get() {
    if (route.path.startsWith("/projetos-mapa")) return "projetos";
    if (route.path.startsWith("/acompanhamento")) return "acompanhamento";
    return "home";
  },
  set() { },
});

function acompanhamentoPathFor(projectId: string) {
  return `/acompanhamento/${projectId}`;
}

function osPathFor(projectId: string) {
  return `/acompanhamento/${projectId}/os`;
}

function onSelectProject(id: string) {
  setActiveProject(id);

  if (route.path.startsWith("/acompanhamento")) {
    const goingToOs = route.path.endsWith("/os");
    router.push(goingToOs ? osPathFor(id) : acompanhamentoPathFor(id));
  }
}

function goTo(path: string) {
  if (route.path !== path) router.push(path);
}

function goToAcompanhamento() {
  const id = String(activeProjectId.value || options[0]?.id || "BAT01");
  const target = acompanhamentoPathFor(id);
  if (route.path !== target) router.push(target);
}

function navigateMobile(path: string) {
  drawer.value = false;
  if (route.path !== path) router.push(path);
}

function navigateMobileAcompanhamento() {
  drawer.value = false;
  goToAcompanhamento();
}
</script>

<style scoped>
.v-select {
  font-family: "Montserrat";
}

.v-tabs,
.v-list-item {
  font-family: "Montserrat";
  font-weight: 800;
}

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
  color: black;
}

.v-icon,
span {
  color: white;
}

.mdi-menu {
  color: white;
}

.mdi-close {
  color: white;
}

:deep(.project-select .v-field) {
  background: rgba(255, 255, 255, 0.95);
}
</style>
