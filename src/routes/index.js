import { createRouter, createWebHistory } from "vue-router";
import ProjectsView from "../views/ProjectsComponent/ProjectsView.vue";
import TimelineView from "../views/TimelineComponent/TimelineView.vue";
import OsObjectView from "../components/ProjectTimeline/osComponents/OsObjectView.vue";
import DeliveryAnalysisView from "../components/ProjectTimeline/deliverayAnalisys/components/DeliveryAnalysisView.vue";
import PhysicalProgressView from "../components/ProjectTimeline/physicalProgress/components/PhysicalProgressView.vue";
import InterferencesView from "../components/ProjectTimeline/interferences/components/InterferencesView.vue";
import SupportTableView from "../components/ProjectTimeline/supportTable/components/SupportTableView.vue";
import LoginView from "../views/LoginView.vue";
import { useAuth } from "../composables/useAuth";

const routes = [
  // 1. ADICIONADO: Redirecionamento da raiz para Login
  {
    path: "/",
    redirect: "/login"
  },

  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { public: true },
  },

  {
    path: "/projetos-mapa",
    name: "projetos-mapa",
    component: ProjectsView,
    meta: { requiresAuth: true },
  },

  {
    path: "/acompanhamento/:projectId",
    name: "acompanhamento",
    component: TimelineView,
    meta: { requiresAuth: true },
  },

  {
    path: "/acompanhamento/:projectId/os",
    name: "objeto-os",
    component: OsObjectView,
    meta: { requiresAuth: true },
  },

  // Rotas de Detalhes (KPIs)
  {
    path: "/projetos/:projectId/analise-entrega",
    name: "project-delivery-analysis",
    component: DeliveryAnalysisView,
    meta: { requiresAuth: true },
  },
  {
    path: "/projetos/:projectId/avanco-fisico",
    name: "project-physical-progress",
    component: PhysicalProgressView,
    meta: { requiresAuth: true },
  },
  {
    path: "/projetos/:projectId/interferencias",
    name: "project-interferences",
    component: InterferencesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/projetos/:projectId/tabela-apoio",
    name: "project-support-table",
    component: SupportTableView,
    meta: { requiresAuth: true },
  },
  
  // 2. ADICIONADO: Captura rotas inexistentes (404) e manda pro início
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/projetos-mapa' 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { isAuthenticated, loadSession } = useAuth();
  
  // Garante que a sessão está carregada antes de verificar
  loadSession();

  const isPublic = Boolean(to.meta.public);
  const isUserLogged = isAuthenticated.value;

  // Cenário 1: Usuário não logado tenta acessar rota privada -> Login
  if (!isUserLogged && !isPublic) {
    return next({ name: "login" });
  }

  // Cenário 2: Usuário logado tenta acessar Login -> Home
  if (isUserLogged && to.name === "login") {
    return next({ name: "projetos-mapa" });
  }

  // Segue o fluxo normal
  next();
});

export default router;