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
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { public: true },
  },

  {
    path: "/",
    name: "projetos",
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const { isAuthenticated, loadSession } = useAuth();
  loadSession();

  const isPublic = Boolean(to.meta.public);

  if (!isAuthenticated.value && !isPublic) {
    return { name: "login" };
  }

  if (isAuthenticated.value && to.name === "login") {
    return { name: "projetos" }; 
  }

  return true;
});

export default router;
