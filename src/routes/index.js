import { createRouter, createWebHistory } from "vue-router";
import ProjectsView from "../views/ProjectsComponent/ProjectsView.vue";
import HomeView from "../views/HomeView.vue";
import TimelineView from "../views/TimelineComponent/TimelineView.vue";
import OsObjectView from "../components/ProjectTimeline/OsObjectView.vue";


const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/projetos", name: "projetos", component: ProjectsView },

  // Acompanhamento por projeto
  { path: "/acompanhamento/:projectId", name: "acompanhamento", component: TimelineView },

  // Tela Objeto da OS
  { path: "/acompanhamento/:projectId/os", name: "objeto-os", component: OsObjectView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
