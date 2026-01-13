import { createRouter, createWebHistory } from "vue-router";
import ProjectsView from "../views/ProjectsComponent/ProjectsView.vue";
import HomeView from "../views/HomeView.vue";
import TimelineView from "../views/TimelineComponent/TimelineView.vue";
import OsObjectView from "../components/ProjectTimeline/OsObjectView.vue";
import DeliveryAnalysisView from "../components/ProjectTimeline/deliverayAnalisys/components/DeliveryAnalysisView.vue";
import PhysicalProgressView from "../components/ProjectTimeline/physicalProgress/components/PhysicalProgressView.vue";
import InterferencesView from "../components/ProjectTimeline/interferences/components/InterferencesView.vue";


const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/projetos", name: "projetos", component: ProjectsView },

  // Acompanhamento por projeto
  { path: "/acompanhamento/:projectId", name: "acompanhamento", component: TimelineView },

  // Tela Objeto da OS
  { path: "/acompanhamento/:projectId/os", name: "objeto-os", component: OsObjectView },

  {
    path: "/projetos/:projectId/analise-entrega",
    name: "project-delivery-analysis",
    component: DeliveryAnalysisView,
  },
  {
    path: "/projetos/:projectId/avanco-fisico",
    name: "project-physical-progress",
    component: PhysicalProgressView
  },
  {
    path: "/projetos/:projectId/interferencias",
    name: "project-interferences",
    component: InterferencesView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
