import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api'

export const useDialogStore = defineStore('dialog', () => {
  const dialogs = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Pagination & Filtering state
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })
  
  const searchQuery = ref('')
  const filterType = ref('all') // 'all', 'dialog', 'push'
  const filterStatus = ref('all') // 'all', 'draft', 'scheduled', 'sent', 'cancelled'

  // Constants
  const dialogTypes = [
    { value: 'info', label: 'اطلاع‌رسانی', icon: 'ℹ️', color: '#3b82f6' },
    { value: 'success', label: 'موفقیت', icon: '✅', color: '#10b981' },
    { value: 'warning', label: 'هشدار', icon: '⚠️', color: '#f59e0b' },
    { value: 'error', label: 'خطا', icon: '❌', color: '#ef4444' }
  ]

  const priorities = [
    { value: 'low', label: 'کم', color: '#6b7280' },
    { value: 'normal', label: 'معمولی', color: '#3b82f6' },
    { value: 'high', label: 'زیاد', color: '#f59e0b' },
    { value: 'urgent', label: 'فوری', color: '#ef4444' }
  ]

  const targets = [
    { value: 'all', label: 'همه کاربران' },
    { value: 'android', label: 'کاربران Android' },
    { value: 'ios', label: 'کاربران iOS' },
    { value: 'specific_users', label: 'کاربران خاص' }
  ]

  const statuses = [
    { value: 'draft', label: 'پیش‌نویس', color: '#6b7280' },
    { value: 'scheduled', label: 'برنامه‌ریزی شده', color: '#3b82f6' },
    { value: 'sent', label: 'ارسال شده', color: '#10b981' },
    { value: 'cancelled', label: 'لغو شده', color: '#ef4444' }
  ]

  // Fetch Dialogs from API
  const fetchDialogs = async (page = 1) => {
    loading.value = true
    error.value = null
    
    try {
      const params = {
        page,
        limit: pagination.value.limit
      }
      
      if (filterType.value !== 'all') {
        if (filterType.value === 'dialog') params.type = 'in-app'
        else if (filterType.value === 'push') params.type = 'push'
      }
      
      if (filterStatus.value !== 'all') {
        params.status = filterStatus.value
      }
      
      if (searchQuery.value.trim()) {
        params.search = searchQuery.value
      }

      const response = await api.get('/dialogs', { params })
      
      if (Array.isArray(response.data)) {
         dialogs.value = response.data
      } else {
         const { data, total, totalPages } = response.data
         dialogs.value = data || response.data.items || []
         pagination.value.total = total || response.data.total || 0
         pagination.value.page = page
         pagination.value.totalPages = totalPages || Math.ceil(pagination.value.total / pagination.value.limit)
      }

    } catch (err) {
      console.error('Error fetching dialogs:', err)
      error.value = err.response?.data?.message || 'خطا در دریافت لیست دیالوگ‌ها'
    } finally {
      loading.value = false
    }
  }

  // Add new Dialog
  const addDialog = async (dialogData) => {
    loading.value = true
    error.value = null
    try {
      const payload = {
        ...dialogData,
        type: dialogData.type === 'dialog' ? 'in-app' : dialogData.type
      }
      
      await api.post('/dialogs', payload)
      await fetchDialogs(1)
      return { success: true }
    } catch (err) {
      console.error('Error adding dialog:', err)
      return { success: false, error: err.response?.data?.message || 'خطا در ایجاد دیالوگ' }
    } finally {
      loading.value = false
    }
  }

  // Update Dialog
  const updateDialog = async (id, dialogData) => {
    loading.value = true
    try {
      await api.put(`/dialogs/${id}`, dialogData)
      await fetchDialogs(pagination.value.page)
      return { success: true }
    } catch (err) {
      console.error('Error updating dialog:', err)
      return { success: false, error: err.response?.data?.message || 'خطا در ویرایش دیالوگ' }
    } finally {
      loading.value = false
    }
  }

  // Delete Dialog
  const deleteDialog = async (id) => {
    loading.value = true
    try {
      await api.delete(`/dialogs/${id}`)
      await fetchDialogs(pagination.value.page)
      return { success: true }
    } catch (err) {
      console.error('Error deleting dialog:', err)
      return { success: false, error: err.response?.data?.message || 'خطا در حذف دیالوگ' }
    } finally {
      loading.value = false
    }
  }

  // Send Immediately
  const sendDialog = async (id) => {
    loading.value = true
    try {
      await api.post(`/dialogs/${id}/send`)
      await fetchDialogs(pagination.value.page)
      return { success: true }
    } catch (err) {
      console.error('Error sending dialog:', err)
      return { success: false, error: err.response?.data?.message || 'خطا در ارسال دیالوگ' }
    } finally {
      loading.value = false
    }
  }

  // Cancel Scheduled
  const cancelScheduledDialog = async (id) => {
    loading.value = true
    try {
      await api.post(`/dialogs/${id}/cancel`)
      await fetchDialogs(pagination.value.page)
      return { success: true }
    } catch (err) {
      console.error('Error cancelling dialog:', err)
      return { success: false, error: err.response?.data?.message || 'خطا در لغو دیالوگ' }
    } finally {
      loading.value = false
    }
  }

  // Get Analytics
  const getAnalytics = async (id) => {
    try {
      const response = await api.get(`/dialogs/${id}/analytics`)
      return response.data
    } catch (err) {
      console.error('Error fetching analytics:', err)
      return null
    }
  }

  // Setters for filters
  const setSearchQuery = (query) => {
    searchQuery.value = query
    fetchDialogs(1)
  }

  const setFilterType = (type) => {
    filterType.value = type
    fetchDialogs(1)
  }

  const setFilterStatus = (status) => {
    filterStatus.value = status
    fetchDialogs(1)
  }
  
  const setPage = (page) => {
    fetchDialogs(page)
  }

  // Validation
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

  // Computed properties
  const filteredDialogs = computed(() => dialogs.value)
  
  const stats = computed(() => {
    const dialogsList = dialogs.value || []
    return {
      total: pagination.value.total,
      dialogs: dialogsList.filter(d => d.type === 'in-app').length,
      pushes: dialogsList.filter(d => d.type === 'push').length,
      sent: dialogsList.filter(d => d.status === 'sent').length,
      scheduled: dialogsList.filter(d => d.status === 'scheduled').length,
      draft: dialogsList.filter(d => d.status === 'draft').length
    }
  })

  return {
    dialogs,
    loading,
    error,
    pagination,
    searchQuery,
    filterType,
    filterStatus,
    filteredDialogs,
    stats,
    dialogTypes,
    priorities,
    targets,
    statuses,
    fetchDialogs,
    addDialog,
    updateDialog,
    deleteDialog,
    sendDialog,
    cancelScheduledDialog,
    getAnalytics,
    setSearchQuery,
    setFilterType,
    setFilterStatus,
    setPage,
    validateDialog
  }
})
