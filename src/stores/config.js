import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// نمونه داده‌های اولیه برای تست
const initialConfigs = [
  {
    id: '1',
    name: 'کانفیگ ایران ۱',
    type: 'link', // 'link' or 'json'
    content: 'vless://example@server.com:443?type=tcp&security=tls#Iran-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'کانفیگ آمریکا',
    type: 'json',
    content: JSON.stringify({
      "v": "2",
      "ps": "USA Config",
      "add": "server.example.com",
      "port": "443",
      "id": "uuid-here",
      "aid": "0",
      "net": "tcp",
      "type": "none",
      "host": "",
      "path": "",
      "tls": "tls"
    }, null, 2),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export const useConfigStore = defineStore('config', () => {
  const configs = ref([])
  const searchQuery = ref('')
  const filterType = ref('all') // 'all', 'link', 'json'

  // بارگذاری داده‌ها از localStorage
  const loadConfigs = () => {
    const stored = localStorage.getItem('v2rayConfigs')
    if (stored) {
      try {
        configs.value = JSON.parse(stored)
      } catch (e) {
        console.error('Error loading configs:', e)
        configs.value = initialConfigs
      }
    } else {
      configs.value = initialConfigs
      saveConfigs()
    }
  }

  // ذخیره داده‌ها در localStorage
  const saveConfigs = () => {
    localStorage.setItem('v2rayConfigs', JSON.stringify(configs.value))
  }

  // افزودن کانفیگ جدید
  const addConfig = (config) => {
    const newConfig = {
      id: Date.now().toString(),
      ...config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    configs.value.push(newConfig)
    saveConfigs()
    return newConfig
  }

  // بروزرسانی کانفیگ
  const updateConfig = (id, updatedConfig) => {
    const index = configs.value.findIndex(config => config.id === id)
    if (index !== -1) {
      configs.value[index] = {
        ...configs.value[index],
        ...updatedConfig,
        updatedAt: new Date().toISOString()
      }
      saveConfigs()
      return configs.value[index]
    }
    return null
  }

  // حذف کانفیگ
  const deleteConfig = (id) => {
    const index = configs.value.findIndex(config => config.id === id)
    if (index !== -1) {
      configs.value.splice(index, 1)
      saveConfigs()
      return true
    }
    return false
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

  // کانفیگ‌های فیلتر شده
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

  // آمار کانفیگ‌ها
  const stats = computed(() => {
    return {
      total: configs.value.length,
      links: configs.value.filter(config => config.type === 'link').length,
      jsons: configs.value.filter(config => config.type === 'json').length
    }
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

  // مقداردهی اولیه
  loadConfigs()

  return {
    configs,
    searchQuery,
    filterType,
    filteredConfigs,
    stats,
    addConfig,
    updateConfig,
    deleteConfig,
    getConfigById,
    setSearchQuery,
    setFilterType,
    validateV2RayConfig,
    loadConfigs,
    saveConfigs
  }
})
