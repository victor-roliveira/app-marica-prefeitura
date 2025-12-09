import { createRouter, createWebHistory } from 'vue-router'
import ProjectsView from '../views/ProjectsComponent/ProjectsView.vue'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/projetos',
    name: 'projetos',
    component: ProjectsView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
