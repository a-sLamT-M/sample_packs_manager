import { createRouter, createWebHistory } from 'vue-router'
import Search from '../views/Search.vue'

const routes = [
  {
    path: '/',
    name: 'Search',
    component: Search
  },
  {
    path: '/favorite',
    name: 'Favorite',
    component: () => import('../views/Favorite.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
