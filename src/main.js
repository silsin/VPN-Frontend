import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

// استفاده از Pinia
app.use(pinia)

// بررسی احراز هویت در ابتدا
const authStore = useAuthStore()
authStore.checkAuth()

app.use(router)
app.mount('#app')
