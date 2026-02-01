import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('../views/Users.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/main-config',
      name: 'MainConfig',
      component: () => import('../views/MainConfig.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/splash-config',
      name: 'SplashConfig',
      component: () => import('../views/SplashConfig.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ads',
      name: 'Ads',
      component: () => import('../views/Ads.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dialog',
      name: 'Dialog',
      component: () => import('../views/Dialog.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/update',
      name: 'Update',
      component: () => import('../views/Update.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/app-settings',
      name: 'AppSettings',
      component: () => import('../views/AppSettings.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/help-link',
      name: 'HelpLink',
      component: () => import('../views/HelpLink.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/free-configs',
      name: 'FreeConfigs',
      component: () => import('../views/FreeConfigs.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
})

// Navigation guard برای محافظت از مسیرها
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuth = authStore.isAuthenticated.value
  
  // اگر کاربر authenticated نیست و می‌خواهد به صفحه‌ای که نیاز به auth دارد برود
  if (to.meta.requiresAuth && !isAuth) {
    next('/login')
  } 
  // اگر کاربر authenticated است و می‌خواهد به صفحه login برود، به dashboard redirect شود
  else if (to.path === '/login' && isAuth) {
    next('/dashboard')
  } 
  // اگر به root می‌رود و authenticated نیست، به login برود
  else if (to.path === '/' && !isAuth) {
    next('/login')
  }
  else {
    next()
  }
})

export default router

