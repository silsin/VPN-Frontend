import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api'

export const useUsersStore = defineStore('users', () => {
  const deviceLogins = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchDeviceLogins = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/device-logins')
      deviceLogins.value = response.data
    } catch (err) {
      console.error('Error fetching device logins:', err)
      error.value = err.response?.data?.message || 'Failed to fetch device logins'
    } finally {
      loading.value = false
    }
  }

  return {
    deviceLogins,
    loading,
    error,
    fetchDeviceLogins
  }
})
