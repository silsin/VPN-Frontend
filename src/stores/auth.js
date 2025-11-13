import { ref, computed } from 'vue'

const isAuthenticated = ref(false)
const user = ref(null)

// بررسی اولیه localStorage
const checkAuth = () => {
  const stored = localStorage.getItem('isAuthenticated')
  if (stored === 'true') {
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
  const login = (username, password) => {
    // در اینجا می‌توانید با API واقعی ارتباط برقرار کنید
    // برای حالا، یک احراز هویت ساده داریم
    if (username && password) {
      isAuthenticated.value = true
      user.value = {
        username: username,
        loginTime: new Date().toISOString()
      }
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
  }

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    user: computed(() => user.value),
    login,
    logout,
    checkAuth
  }
}

