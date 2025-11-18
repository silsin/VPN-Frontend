import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// نمونه داده‌های اولیه برای آپدیت‌ها و تاریخچه انتشار
const initialUpdates = [
  {
    id: '1',
    versionName: '1.2.0',
    versionCode: 120,
    platform: 'both', // 'android', 'ios', 'both'
    updateType: 'normal', // 'normal', 'force'
    status: 'active', // 'active', 'inactive'
    releaseNotes: [
      'اضافه شدن قابلیت اتصال سریع',
      'بهبود عملکرد VPN',
      'رفع مشکلات اتصال',
      'به‌روزرسانی رابط کاربری'
    ],
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.flyvpn.app',
    iosUrl: 'https://apps.apple.com/app/flyvpn/id123456789',
    minSupportedVersion: '1.0.0',
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    releasedAt: new Date('2024-01-15T14:30:00Z').toISOString(),
    isLatest: true
  },
  {
    id: '2',
    versionName: '1.1.5',
    versionCode: 115,
    platform: 'both',
    updateType: 'normal',
    status: 'inactive',
    releaseNotes: [
      'رفع مشکلات اتصال به سرورها',
      'بهبود امنیت اتصال',
      'اضافه شدن پشتیبانی از زبان‌های بیشتر'
    ],
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.flyvpn.app',
    iosUrl: 'https://apps.apple.com/app/flyvpn/id123456789',
    minSupportedVersion: '1.0.0',
    createdAt: new Date('2024-01-08T09:00:00Z').toISOString(),
    releasedAt: new Date('2024-01-08T16:20:00Z').toISOString(),
    isLatest: false
  },
  {
    id: '3',
    versionName: '1.1.0',
    versionCode: 110,
    platform: 'android',
    updateType: 'force',
    status: 'inactive',
    releaseNotes: [
      'نسخه اولیه انتشار',
      'پشتیبانی از پروتکل‌های V2Ray',
      'رابط کاربری جدید'
    ],
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.flyvpn.app',
    iosUrl: null,
    minSupportedVersion: '1.0.0',
    createdAt: new Date('2024-01-01T08:00:00Z').toISOString(),
    releasedAt: new Date('2024-01-01T12:00:00Z').toISOString(),
    isLatest: false
  }
]

// تنظیمات دیالوگ آپدیت
const initialUpdateDialog = {
  title: 'نسخه جدید FlyVPN',
  message: 'نسخه جدید اپلیکیشن FlyVPN منتشر شده است. برای تجربه بهترین عملکرد، همین حالا بروزرسانی کنید.',
  forceUpdateTitle: 'بروزرسانی اجباری',
  forceUpdateMessage: 'برای ادامه استفاده از اپلیکیشن، باید به آخرین نسخه بروزرسانی کنید.',
  updateButtonText: 'بروزرسانی',
  laterButtonText: 'بعداً',
  skipButtonText: 'رد کردن',
  showSkipOption: true,
  imageUrl: null
}

export const useUpdateStore = defineStore('update', () => {
  const updates = ref([])
  const updateDialog = ref({})
  const searchQuery = ref('')
  const filterPlatform = ref('all') // 'all', 'android', 'ios', 'both'
  const filterStatus = ref('all') // 'all', 'active', 'inactive'

  // بارگذاری داده‌ها از localStorage
  const loadUpdates = () => {
    const storedUpdates = localStorage.getItem('updateData')
    const storedDialog = localStorage.getItem('updateDialog')

    if (storedUpdates) {
      try {
        updates.value = JSON.parse(storedUpdates)
      } catch (e) {
        console.error('Error loading updates:', e)
        updates.value = initialUpdates
      }
    } else {
      updates.value = initialUpdates
      saveUpdates()
    }

    if (storedDialog) {
      try {
        updateDialog.value = JSON.parse(storedDialog)
      } catch (e) {
        console.error('Error loading update dialog:', e)
        updateDialog.value = initialUpdateDialog
      }
    } else {
      updateDialog.value = initialUpdateDialog
      saveUpdateDialog()
    }
  }

  // ذخیره آپدیت‌ها در localStorage
  const saveUpdates = () => {
    localStorage.setItem('updateData', JSON.stringify(updates.value))
  }

  // ذخیره تنظیمات دیالوگ در localStorage
  const saveUpdateDialog = () => {
    localStorage.setItem('updateDialog', JSON.stringify(updateDialog.value))
  }

  // افزودن آپدیت جدید
  const addUpdate = (update) => {
    // اگر آپدیت جدید فعال است، آپدیت‌های قبلی را غیرفعال کن
    if (update.status === 'active') {
      updates.value.forEach(u => {
        if (u.status === 'active') {
          u.status = 'inactive'
          u.isLatest = false
        }
      })
    }

    const newUpdate = {
      id: Date.now().toString(),
      ...update,
      isLatest: update.status === 'active',
      createdAt: new Date().toISOString(),
      releasedAt: update.status === 'active' ? new Date().toISOString() : null
    }

    updates.value.push(newUpdate)
    saveUpdates()
    return newUpdate
  }

  // بروزرسانی آپدیت
  const updateUpdate = (id, updatedUpdate) => {
    const index = updates.value.findIndex(update => update.id === id)
    if (index !== -1) {
      // اگر وضعیت به فعال تغییر کرد، سایر آپدیت‌ها را غیرفعال کن
      if (updatedUpdate.status === 'active' && updates.value[index].status !== 'active') {
        updates.value.forEach(u => {
          if (u.id !== id && u.status === 'active') {
            u.status = 'inactive'
            u.isLatest = false
          }
        })
        updatedUpdate.isLatest = true
        updatedUpdate.releasedAt = new Date().toISOString()
      } else if (updatedUpdate.status === 'inactive') {
        updatedUpdate.isLatest = false
      }

      updates.value[index] = {
        ...updates.value[index],
        ...updatedUpdate,
        updatedAt: new Date().toISOString()
      }
      saveUpdates()
      return updates.value[index]
    }
    return null
  }

  // حذف آپدیت
  const deleteUpdate = (id) => {
    const index = updates.value.findIndex(update => update.id === id)
    if (index !== -1) {
      updates.value.splice(index, 1)
      saveUpdates()
      return true
    }
    return false
  }

  // گرفتن آپدیت بر اساس ID
  const getUpdateById = (id) => {
    return updates.value.find(update => update.id === id)
  }

  // گرفتن آخرین نسخه فعال
  const getLatestUpdate = () => {
    return updates.value.find(update => update.isLatest && update.status === 'active')
  }

  // بروزرسانی تنظیمات دیالوگ
  const updateDialogSettings = (settings) => {
    updateDialog.value = { ...updateDialog.value, ...settings }
    saveUpdateDialog()
    return updateDialog.value
  }

  // تنظیم فیلترها
  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  const setFilterPlatform = (platform) => {
    filterPlatform.value = platform
  }

  const setFilterStatus = (status) => {
    filterStatus.value = status
  }

  // آپدیت‌های فیلتر شده
  const filteredUpdates = computed(() => {
    let filtered = updates.value

    // فیلتر بر اساس پلتفرم
    if (filterPlatform.value !== 'all') {
      filtered = filtered.filter(update => update.platform === filterPlatform.value)
    }

    // فیلتر بر اساس وضعیت
    if (filterStatus.value !== 'all') {
      filtered = filtered.filter(update => update.status === filterStatus.value)
    }

    // فیلتر بر اساس جستجو
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(update =>
        update.versionName.toLowerCase().includes(query) ||
        update.releaseNotes.some(note => note.toLowerCase().includes(query))
      )
    }

    // مرتب‌سازی بر اساس تاریخ انتشار (جدیدترین اول)
    return filtered.sort((a, b) => {
      if (a.isLatest && !b.isLatest) return -1
      if (!a.isLatest && b.isLatest) return 1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  })

  // آمار آپدیت‌ها
  const stats = computed(() => {
    const latest = getLatestUpdate()
    return {
      total: updates.value.length,
      active: updates.value.filter(u => u.status === 'active').length,
      android: updates.value.filter(u => u.platform === 'android' || u.platform === 'both').length,
      ios: updates.value.filter(u => u.platform === 'ios' || u.platform === 'both').length,
      forceUpdates: updates.value.filter(u => u.updateType === 'force').length,
      latestVersion: latest ? latest.versionName : 'N/A',
      latestCode: latest ? latest.versionCode : 0
    }
  })

  // لیست پلتفرم‌ها
  const platforms = [
    { value: 'android', label: 'Android' },
    { value: 'ios', label: 'iOS' },
    { value: 'both', label: 'هر دو' }
  ]

  // لیست انواع آپدیت
  const updateTypes = [
    { value: 'normal', label: 'آپدیت معمولی' },
    { value: 'force', label: 'آپدیت اجباری' }
  ]

  // لیست وضعیت‌ها
  const statuses = [
    { value: 'active', label: 'فعال', color: '#10b981' },
    { value: 'inactive', label: 'غیرفعال', color: '#6b7280' }
  ]

  // اعتبارسنجی آپدیت
  const validateUpdate = (update) => {
    if (!update.versionName || !update.versionName.trim()) {
      return { isValid: false, error: 'نام نسخه نمی‌تواند خالی باشد' }
    }

    if (!update.versionCode || update.versionCode < 1) {
      return { isValid: false, error: 'کد نسخه باید عدد مثبت باشد' }
    }

    // بررسی تکراری بودن کد نسخه
    const existingUpdate = updates.value.find(u =>
      u.id !== update.id &&
      u.versionCode === update.versionCode &&
      u.platform === update.platform
    )
    if (existingUpdate) {
      return { isValid: false, error: 'این کد نسخه برای این پلتفرم قبلاً استفاده شده است' }
    }

    if (!platforms.some(p => p.value === update.platform)) {
      return { isValid: false, error: 'پلتفرم نامعتبر است' }
    }

    if (!updateTypes.some(t => t.value === update.updateType)) {
      return { isValid: false, error: 'نوع آپدیت نامعتبر است' }
    }

    if (update.releaseNotes && update.releaseNotes.length === 0) {
      return { isValid: false, error: 'حداقل یک نکته انتشار اضافه کنید' }
    }

    if (update.platform === 'android' || update.platform === 'both') {
      if (!update.downloadUrl || !update.downloadUrl.trim()) {
        return { isValid: false, error: 'لینک دانلود Android نمی‌تواند خالی باشد' }
      }
    }

    if (update.platform === 'ios' || update.platform === 'both') {
      if (!update.iosUrl || !update.iosUrl.trim()) {
        return { isValid: false, error: 'لینک دانلود iOS نمی‌تواند خالی باشد' }
      }
    }

    return { isValid: true, error: null }
  }

  // مقداردهی اولیه
  loadUpdates()

  return {
    updates,
    updateDialog,
    searchQuery,
    filterPlatform,
    filterStatus,
    filteredUpdates,
    stats,
    platforms,
    updateTypes,
    statuses,
    addUpdate,
    updateUpdate,
    deleteUpdate,
    getUpdateById,
    getLatestUpdate,
    updateDialogSettings,
    setSearchQuery,
    setFilterPlatform,
    setFilterStatus,
    validateUpdate,
    loadUpdates,
    saveUpdates,
    saveUpdateDialog
  }
})
