import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

// بررسی احراز هویت در ابتدا
const authStore = useAuthStore()
authStore.checkAuth()

app.use(router)
app.mount('#app')
