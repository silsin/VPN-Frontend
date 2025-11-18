import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

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
  }
}

export const useAppSettingsStore = defineStore('appSettings', () => {
  const settings = ref({ ...defaultSettings })
  const settingsChanged = ref(false)

  // بارگذاری تنظیمات از localStorage
  const loadSettings = () => {
    const stored = localStorage.getItem('appSettings')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        settings.value = { ...defaultSettings, ...parsed }
      } catch (e) {
        console.error('Error loading app settings:', e)
        settings.value = { ...defaultSettings }
        saveSettings()
      }
    } else {
      settings.value = { ...defaultSettings }
      saveSettings()
    }
  }

  // ذخیره تنظیمات در localStorage
  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings.value))
    settingsChanged.value = false
  }

  // بروزرسانی تنظیمات
  const updateSettings = (category, newSettings) => {
    if (settings.value[category]) {
      settings.value[category] = { ...settings.value[category], ...newSettings }
      settingsChanged.value = true
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
  const resetToDefault = (category = null) => {
    if (category) {
      settings.value[category] = { ...defaultSettings[category] }
    } else {
      settings.value = { ...defaultSettings }
    }
    settingsChanged.value = true
    saveSettings()
  }

  // گرفتن تنظیمات برای خروجی JSON
  const exportSettings = () => {
    return JSON.stringify(settings.value, null, 2)
  }

  // وارد کردن تنظیمات از JSON
  const importSettings = (jsonString) => {
    try {
      const imported = JSON.parse(jsonString)
      settings.value = { ...defaultSettings, ...imported }
      settingsChanged.value = true
      saveSettings()
      return { success: true, message: 'تنظیمات با موفقیت وارد شد' }
    } catch (e) {
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
  }
]


  // مقداردهی اولیه
  loadSettings()

  return {
    settings,
    settingsChanged,
    settingsCategories,
    hasUnsavedChanges,
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
