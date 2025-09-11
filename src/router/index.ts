import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
 
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  
  {
    path: '/checkask',
    name: 'CheckAsk',
    component: () => import('../views/checkAsk/checkAsk.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((_to: any, _from: any, next: any) => {
    next()
})

export default router
