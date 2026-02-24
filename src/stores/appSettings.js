import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api'

// تنظیمات پیش‌فرض برنامه
const defaultSettings = {
  // اطلاعات عمومی اپلیکیشن
  general: {
    appName: 'FlyVPN',
    appDescription: 'اپلیکیشن امن VPN برای دسترسی آزاد به اینترنت',
    appVersion: '1.2.0',
    packageName: 'com.flyvpn.app',
    developerName: 'FlyVPN Team',
    supportEmail: 'support@flyvpn.com',
    privacyPolicyUrl: 'https://flyvpn.com/privacy',
    termsOfServiceUrl: 'https://flyvpn.com/terms'
  },

  // تنظیمات اعلان‌ها
  notifications: {
    enablePushNotifications: true,
    enableSound: true,
    enableVibration: true,
    enableBadge: true,
    notificationSound: 'default',
    maxNotificationsPerDay: 10,
    enableMarketingNotifications: false,
    enableSystemNotifications: true,
    enableUpdateNotifications: true
  },

  // تنظیمات سرور
  server: {
    forceServerSelection: false,
    enableServerDialog: true
  },

  // تنظیمات تایمرها
  timers: {
    // تایمرهای اتصال
    autoDisconnectTimer: 30,
    connectionTimeout: 15,
    statusPollingInterval: 3,
    
    // تایمرهای آمار
    enableVpnStatistics: true,
    statisticsUpdateInterval: 5,
    enableProtocolStatistics: true,
    enableIkev2Statistics: false,
    
    // تایمرهای عملکرد
    debounceDelay: 300,
    backgroundPingInterval: 60,
    serverSelectionDelay: 3,
    
    // تایمرهای کاربر
    enableSessionTimer: true,
    enableConnectionTracking: true
  }
}

export const useAppSettingsStore = defineStore('appSettings', () => {
  const settings = ref({ ...defaultSettings })
  const settingsChanged = ref(false)
  const loading = ref(false)
  const error = ref(null)

  // بارگذاری تنظیمات از API
  const loadSettings = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/settings')
      // Merge received settings with defaults to ensure structure
      // Note: Assuming response.data follows the structure { general: {}, server: {}, ... }
      if (response.data) {
        // Deep merge or simple spread? Spread for categories seems safer for now
        // If response excludes a category (e.g. notifications), keep default.
        settings.value = {
          ...defaultSettings,
          ...response.data,
          // Ensure sub-objects are also merged if partial data is returned,
          // but simplest verification first:
          general: { ...defaultSettings.general, ...(response.data.general || {}) },
          notifications: { ...defaultSettings.notifications, ...(response.data.notifications || {}) },
          server: { ...defaultSettings.server, ...(response.data.server || {}) },
          timers: { ...defaultSettings.timers, ...(response.data.timers || {}) }
        }
      }
    } catch (e) {
      console.error('Error loading app settings:', e)
      error.value = 'خطا در بارگذاری تنظیمات'
      // Fallback to local defaults is already set by initial ref
    } finally {
      loading.value = false
    }
  }

  // ذخیره تنظیمات در API
  const saveSettings = async () => {
    loading.value = true
    try {
      await api.put('/settings', settings.value)
      settingsChanged.value = false
    } catch (e) {
      console.error('Error saving app settings:', e)
      error.value = 'خطا در ذخیره تنظیمات'
      throw e // Let UI handle or display specific error
    } finally {
      loading.value = false
    }
  }

  // بروزرسانی تنظیمات
  const updateSettings = (category, newSettings) => {
    if (settings.value[category]) {
      settings.value[category] = { ...settings.value[category], ...newSettings }
      settingsChanged.value = true
      // Auto-save logic? Or wait for explicit save?
      // For specific updates (like toggles), we might want auto-save.
      // But preserving 'save' button functionality in general settings page implies explicit save.
      // However, typical settings pages often save on blur or store change.
      // Let's call saveSettings() to persist immediately as per previous logic
      saveSettings()
    }
  }

  // تنظیم مقدار خاص
  const setSetting = (category, key, value) => {
    if (settings.value[category] && settings.value[category][key] !== undefined) {
      settings.value[category][key] = value
      settingsChanged.value = true
      saveSettings()
    }
  }

  // گرفتن مقدار تنظیمات
  const getSetting = (category, key) => {
    return settings.value[category]?.[key]
  }

  // گرفتن تنظیمات دسته خاص
  const getCategorySettings = (category) => {
    return settings.value[category] || {}
  }

  // بازنشانی تنظیمات به پیش‌فرض
  const resetToDefault = async (category = null) => {
    if (category) {
      settings.value[category] = { ...defaultSettings[category] }
    } else {
      settings.value = { ...defaultSettings }
    }
    settingsChanged.value = true
    await saveSettings()
  }

  // گرفتن تنظیمات برای خروجی JSON
  const exportSettings = () => {
    return JSON.stringify(settings.value, null, 2)
  }

  // وارد کردن تنظیمات از JSON
  const importSettings = async (jsonString) => {
    try {
      const imported = JSON.parse(jsonString)
      settings.value = {
        ...defaultSettings,
        ...imported,
        general: { ...defaultSettings.general, ...(imported.general || {}) },
        notifications: { ...defaultSettings.notifications, ...(imported.notifications || {}) },
        server: { ...defaultSettings.server, ...(imported.server || {}) },
        timers: { ...defaultSettings.timers, ...(imported.timers || {}) }
      }
      settingsChanged.value = true
      await saveSettings()
      return { success: true, message: 'تنظیمات با موفقیت وارد شد' }
    } catch (e) {
      console.error('Import error:', e)
      return { success: false, message: 'فرمت JSON نامعتبر است' }
    }
  }

  // گرفتن تنظیمات فعلی برای مقایسه
  const getCurrentSettings = () => {
    return { ...settings.value }
  }

  // بررسی تغییر تنظیمات
  const hasUnsavedChanges = computed(() => settingsChanged.value)

// گرفتن تنظیمات بر اساس دسته‌بندی
const settingsCategories = [
  {
    id: 'general',
    name: 'اطلاعات عمومی',
    icon: '📱',
    description: 'اطلاعات پایه اپلیکیشن'
  },
  {
    id: 'notifications',
    name: 'اعلان‌ها',
    icon: '🔔',
    description: 'تنظیمات اعلان‌ها و نوتیفیکیشن'
  },
  {
    id: 'server',
    name: 'تنظیمات سرور',
    icon: '🖥️',
    description: 'مدیریت انتخاب و اتصال به سرورها'
  },
  {
    id: 'timers',
    name: 'تایمرها',
    icon: '⏱️',
    description: 'تنظیمات تایمرهای سیستم و عملکرد'
  }
]


  // مقداردهی اولیه
  loadSettings()

  return {
    settings,
    settingsChanged,
    settingsCategories,
    hasUnsavedChanges,
    loading,
    error,
    loadSettings,
    saveSettings,
    updateSettings,
    setSetting,
    getSetting,
    getCategorySettings,
    resetToDefault,
    exportSettings,
    importSettings,
    getCurrentSettings
  }
})
