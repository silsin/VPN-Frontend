import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api'

export const useConfigStore = defineStore('config', () => {
  const configs = ref([])
  const searchQuery = ref('')
  const filterType = ref('all') // 'all', 'link', 'json'
  const loading = ref(false)
  const error = ref(null)
  const stats = ref({
    total: 0,
    links: 0,
    jsons: 0
  })

  // Helper to normalize config from API
  const normalizeConfig = (config) => {
    return {
      ...config,
      type: config.type === 'v2ray_link' ? 'link' : (config.type === 'json_config' ? 'json' : config.type)
    }
  }

  // Helper to denormalize config for API
  const denormalizeConfig = (config) => {
    return {
      ...config,
      type: config.type === 'link' ? 'v2ray_link' : 'json_config'
    }
  }

  // بارگذاری داده‌ها از API
  const loadConfigs = async (category = null) => {
    loading.value = true
    error.value = null
    configs.value = [] // Clear existing configs
    try {
      const params = {}
      if (category) {
        params.category = category
      }
      
      console.log('Loading configs with category:', category)
      const response = await api.get('/v2ray-configs', { params })
      console.log('Received configs:', response.data)
      configs.value = response.data.map(normalizeConfig)
      
      // Also fetch stats
      fetchStats()
    } catch (e) {
      console.error('Error loading configs:', e)
      error.value = 'خطا در بارگذاری اطلاعات'
    } finally {
      loading.value = false
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/v2ray-configs/stats')
      // Map API stats to frontend stats
      stats.value = {
        total: response.data.total,
        links: response.data.linkCount,
        jsons: response.data.jsonCount
      }
    } catch (e) {
      console.error('Error loading stats:', e)
    }
  }

  // افزودن کانفیگ جدید
  const addConfig = async (config) => {
    loading.value = true
    try {
      const payload = denormalizeConfig(config)
      
      const response = await api.post('/v2ray-configs', payload)
      const newConfig = normalizeConfig(response.data)
      configs.value.push(newConfig)
      fetchStats()
      return newConfig
    } catch (e) {
      console.error('Error adding config:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // بروزرسانی کانفیگ
  const updateConfig = async (id, updatedConfig) => {
    loading.value = true
    try {
      const payload = denormalizeConfig(updatedConfig)
      
      const response = await api.patch(`/v2ray-configs/${id}`, payload)
      const updated = normalizeConfig(response.data)
      
      const index = configs.value.findIndex(c => c.id === id)
      if (index !== -1) {
        configs.value[index] = updated
      }
      return updated
    } catch (e) {
      console.error('Error updating config:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // حذف کانفیگ
  const deleteConfig = async (id) => {
    loading.value = true
    try {
      await api.delete(`/v2ray-configs/${id}`)
      const index = configs.value.findIndex(c => c.id === id)
      if (index !== -1) {
        configs.value.splice(index, 1)
      }
      fetchStats()
      return true
    } catch (e) {
      console.error('Error deleting config:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // گرفتن کانفیگ بر اساس ID
  const getConfigById = (id) => {
    return configs.value.find(config => config.id === id)
  }

  // تنظیم فیلتر جستجو
  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  // تنظیم فیلتر نوع
  const setFilterType = (type) => {
    filterType.value = type
  }

  // کانفیگ‌های فیلتر شده (Client-side filtering)
  const filteredConfigs = computed(() => {
    let filtered = configs.value

    // فیلتر بر اساس نوع
    if (filterType.value !== 'all') {
      filtered = filtered.filter(config => config.type === filterType.value)
    }

    // فیلتر بر اساس جستجو
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(config =>
        config.name.toLowerCase().includes(query) ||
        config.content.toLowerCase().includes(query)
      )
    }

    // مرتب‌سازی بر اساس تاریخ بروزرسانی (جدیدترین اول)
    return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  })

  // اعتبارسنجی کانفیگ V2Ray
  const validateV2RayConfig = (content, type) => {
    if (!content || !content.trim()) {
      return { isValid: false, error: 'محتوا نمی‌تواند خالی باشد' }
    }

    if (type === 'link') {
      // بررسی فرمت لینک V2Ray
      const v2rayProtocols = ['vmess://', 'vless://', 'trojan://', 'ss://']
      const isValidProtocol = v2rayProtocols.some(protocol =>
        content.toLowerCase().startsWith(protocol)
      )

      if (!isValidProtocol) {
        return { isValid: false, error: 'فرمت لینک V2Ray نامعتبر است' }
      }
    } else if (type === 'json') {
      // بررسی فرمت JSON
      try {
        JSON.parse(content)
      } catch (e) {
        return { isValid: false, error: 'فرمت JSON نامعتبر است' }
      }
    }

    return { isValid: true, error: null }
  }

  return {
    configs,
    searchQuery,
    filterType,
    filteredConfigs,
    stats,
    loading,
    error,
    addConfig,
    updateConfig,
    deleteConfig,
    getConfigById,
    setSearchQuery,
    setFilterType,
    validateV2RayConfig,
    loadConfigs,
    fetchStats
  }
})
