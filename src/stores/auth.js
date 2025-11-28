import { ref, computed } from 'vue'
import api from '../services/api'

const isAuthenticated = ref(false)
const user = ref(null)
const token = ref(null)

// بررسی اولیه localStorage
const checkAuth = () => {
  const storedToken = localStorage.getItem('token')
  if (storedToken) {
    token.value = storedToken
    isAuthenticated.value = true
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }
}

// بررسی اولیه در زمان بارگذاری ماژول
checkAuth()

export function useAuthStore() {
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { access_token } = response.data
      
      if (access_token) {
        token.value = access_token
        isAuthenticated.value = true
        user.value = { email, loginTime: new Date().toISOString() }
        console.log(access_token); 
        localStorage.setItem('token', access_token)
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(user.value))
        return { success: true }
      }
      return { success: false, error: 'No access token received' }
    } catch (error) {
      console.error('Login failed:', error)
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.'
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
  }

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    user: computed(() => user.value),
    token: computed(() => token.value),
    login,
    logout,
    checkAuth
  }
}

