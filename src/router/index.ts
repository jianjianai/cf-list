import { createRouter, createWebHistory } from 'vue-router'
import FilesBrowesView from '@/views/FilesBrowesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:path*',
      name: 'files-browse',
      component: FilesBrowesView,
    }
  ],
})

export default router
