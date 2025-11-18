import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// نمونه داده‌های اولیه برای دیالوگ‌ها و اعلان‌ها
const initialDialogs = [
  {
    id: '1',
    title: 'به‌روزرسانی مهم اپلیکیشن',
    message: 'نسخه جدید FlyVPN با امکانات بیشتر منتشر شد. همین حالا بروزرسانی کنید!',
    type: 'dialog', // 'dialog' or 'push'
    dialogType: 'info', // 'info', 'warning', 'success', 'error'
    target: 'all', // 'all', 'android', 'ios', 'specific_users'
    status: 'sent', // 'draft', 'scheduled', 'sent', 'cancelled'
    priority: 'normal', // 'low', 'normal', 'high', 'urgent'
    scheduleTime: null,
    sentTime: new Date().toISOString(),
    imageUrl: null,
    actionButtons: [
      { text: 'بروزرسانی', action: 'update_app' },
      { text: 'بعداً', action: 'dismiss' }
    ],
    clickAction: 'open_update_page',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'پیشنهاد ویژه!',
    message: 'با خرید اشتراک طلایی ۵۰٪ تخفیف بگیرید. پیشنهاد محدود است!',
    type: 'push',
    target: 'all',
    status: 'scheduled',
    priority: 'high',
    scheduleTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    sentTime: null,
    imageUrl: 'https://example.com/promo-image.jpg',
    actionButtons: [],
    clickAction: 'open_premium_page',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'خوش آمدید!',
    message: 'از نصب FlyVPN سپاسگزاریم. از امکانات رایگان استفاده کنید.',
    type: 'dialog',
    dialogType: 'success',
    target: 'all',
    status: 'draft',
    priority: 'normal',
    scheduleTime: null,
    sentTime: null,
    imageUrl: null,
    actionButtons: [
      { text: 'شروع کنید', action: 'open_main' }
    ],
    clickAction: 'none',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export const useDialogStore = defineStore('dialog', () => {
  const dialogs = ref([])
  const searchQuery = ref('')
  const filterType = ref('all') // 'all', 'dialog', 'push'
  const filterStatus = ref('all') // 'all', 'draft', 'scheduled', 'sent', 'cancelled'

  // بارگذاری داده‌ها از localStorage
  const loadDialogs = () => {
    const stored = localStorage.getItem('dialogData')
    if (stored) {
      try {
        dialogs.value = JSON.parse(stored)
      } catch (e) {
        console.error('Error loading dialogs:', e)
        dialogs.value = initialDialogs
      }
    } else {
      dialogs.value = initialDialogs
      saveDialogs()
    }
  }

  // ذخیره داده‌ها در localStorage
  const saveDialogs = () => {
    localStorage.setItem('dialogData', JSON.stringify(dialogs.value))
  }

  // افزودن دیالوگ/اعلان جدید
  const addDialog = (dialog) => {
    const newDialog = {
      id: Date.now().toString(),
      ...dialog,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    dialogs.value.push(newDialog)
    saveDialogs()
    return newDialog
  }

  // بروزرسانی دیالوگ/اعلان
  const updateDialog = (id, updatedDialog) => {
    const index = dialogs.value.findIndex(dialog => dialog.id === id)
    if (index !== -1) {
      dialogs.value[index] = {
        ...dialogs.value[index],
        ...updatedDialog,
        updatedAt: new Date().toISOString()
      }
      saveDialogs()
      return dialogs.value[index]
    }
    return null
  }

  // حذف دیالوگ/اعلان
  const deleteDialog = (id) => {
    const index = dialogs.value.findIndex(dialog => dialog.id === id)
    if (index !== -1) {
      dialogs.value.splice(index, 1)
      saveDialogs()
      return true
    }
    return false
  }

  // گرفتن دیالوگ/اعلان بر اساس ID
  const getDialogById = (id) => {
    return dialogs.value.find(dialog => dialog.id === id)
  }

  // ارسال دیالوگ/اعلان
  const sendDialog = (id) => {
    const dialog = getDialogById(id)
    if (dialog) {
      updateDialog(id, {
        status: 'sent',
        sentTime: new Date().toISOString()
      })
      return true
    }
    return false
  }

  // لغو برنامه‌ریزی شده
  const cancelScheduledDialog = (id) => {
    const dialog = getDialogById(id)
    if (dialog && dialog.status === 'scheduled') {
      updateDialog(id, {
        status: 'cancelled',
        scheduleTime: null
      })
      return true
    }
    return false
  }

  // تنظیم فیلترها
  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  const setFilterType = (type) => {
    filterType.value = type
  }

  const setFilterStatus = (status) => {
    filterStatus.value = status
  }

  // دیالوگ‌های فیلتر شده
  const filteredDialogs = computed(() => {
    let filtered = dialogs.value

    // فیلتر بر اساس نوع
    if (filterType.value !== 'all') {
      filtered = filtered.filter(dialog => dialog.type === filterType.value)
    }

    // فیلتر بر اساس وضعیت
    if (filterStatus.value !== 'all') {
      filtered = filtered.filter(dialog => dialog.status === filterStatus.value)
    }

    // فیلتر بر اساس جستجو
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(dialog =>
        dialog.title.toLowerCase().includes(query) ||
        dialog.message.toLowerCase().includes(query)
      )
    }

    // مرتب‌سازی بر اساس تاریخ ایجاد (جدیدترین اول)
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  })

  // آمار دیالوگ‌ها
  const stats = computed(() => {
    return {
      total: dialogs.value.length,
      dialogs: dialogs.value.filter(d => d.type === 'dialog').length,
      pushes: dialogs.value.filter(d => d.type === 'push').length,
      sent: dialogs.value.filter(d => d.status === 'sent').length,
      scheduled: dialogs.value.filter(d => d.status === 'scheduled').length,
      draft: dialogs.value.filter(d => d.status === 'draft').length
    }
  })

  // لیست انواع دیالوگ
  const dialogTypes = [
    { value: 'info', label: 'اطلاع‌رسانی', icon: 'ℹ️', color: '#3b82f6' },
    { value: 'success', label: 'موفقیت', icon: '✅', color: '#10b981' },
    { value: 'warning', label: 'هشدار', icon: '⚠️', color: '#f59e0b' },
    { value: 'error', label: 'خطا', icon: '❌', color: '#ef4444' }
  ]

  // لیست اولویت‌ها
  const priorities = [
    { value: 'low', label: 'کم', color: '#6b7280' },
    { value: 'normal', label: 'معمولی', color: '#3b82f6' },
    { value: 'high', label: 'زیاد', color: '#f59e0b' },
    { value: 'urgent', label: 'فوری', color: '#ef4444' }
  ]

  // لیست اهداف
  const targets = [
    { value: 'all', label: 'همه کاربران' },
    { value: 'android', label: 'کاربران Android' },
    { value: 'ios', label: 'کاربران iOS' },
    { value: 'specific_users', label: 'کاربران خاص' }
  ]

  // لیست وضعیت‌ها
  const statuses = [
    { value: 'draft', label: 'پیش‌نویس', color: '#6b7280' },
    { value: 'scheduled', label: 'برنامه‌ریزی شده', color: '#3b82f6' },
    { value: 'sent', label: 'ارسال شده', color: '#10b981' },
    { value: 'cancelled', label: 'لغو شده', color: '#ef4444' }
  ]

  // اعتبارسنجی دیالوگ
  const validateDialog = (dialog) => {
    if (!dialog.title || !dialog.title.trim()) {
      return { isValid: false, error: 'عنوان نمی‌تواند خالی باشد' }
    }

    if (!dialog.message || !dialog.message.trim()) {
      return { isValid: false, error: 'پیام نمی‌تواند خالی باشد' }
    }

    if (!['dialog', 'push'].includes(dialog.type)) {
      return { isValid: false, error: 'نوع نامعتبر است' }
    }

    if (dialog.type === 'dialog' && !dialogTypes.some(t => t.value === dialog.dialogType)) {
      return { isValid: false, error: 'نوع دیالوگ نامعتبر است' }
    }

    if (!targets.some(t => t.value === dialog.target)) {
      return { isValid: false, error: 'هدف نامعتبر است' }
    }

    if (!priorities.some(p => p.value === dialog.priority)) {
      return { isValid: false, error: 'اولویت نامعتبر است' }
    }

    return { isValid: true, error: null }
  }

  // مقداردهی اولیه
  loadDialogs()

  return {
    dialogs,
    searchQuery,
    filterType,
    filterStatus,
    filteredDialogs,
    stats,
    dialogTypes,
    priorities,
    targets,
    statuses,
    addDialog,
    updateDialog,
    deleteDialog,
    getDialogById,
    sendDialog,
    cancelScheduledDialog,
    setSearchQuery,
    setFilterType,
    setFilterStatus,
    validateDialog,
    loadDialogs,
    saveDialogs
  }
})
