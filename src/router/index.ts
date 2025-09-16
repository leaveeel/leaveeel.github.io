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

router.beforeEach((to: any, _from: any, next: any) => {
  let access = localStorage.getItem('access')
  if (!access && to.name === 'CheckAsk') {
    return next({ path: '/' })
  }
  next()
})

export default router
