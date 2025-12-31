import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api'

export const useAdsStore = defineStore('ads', () => {
  const ads = ref([])
  const settings = ref({})
  const loading = ref(false)
  const error = ref(null)

  // Load ads from backend
  const loadAds = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/ads')
      ads.value = response.data
    } catch (err) {
      error.value = 'خطا در بارگذاری تبلیغات'
      console.error('Error loading ads:', err)
    } finally {
      loading.value = false
    }
  }

  // Load settings from backend
  const loadSettings = async () => {
    try {
      const response = await api.get('/ads/settings')
      settings.value = response.data
    } catch (err) {
      error.value = 'خطا در بارگذاری تنظیمات'
      console.error('Error loading settings:', err)
    }
  }

  // Add new ad
  const addAd = async (adData) => {
    loading.value = true
    error.value = null
    try {
      // Normalize type for backend
      if (adData.type === 'video_ad') {
        adData.type = 'video'
      }
      const response = await api.post('/ads', adData)
      ads.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = 'خطا در افزودن تبلیغ'
      console.error('Error adding ad:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update ad
  const updateAd = async (id, updatedData) => {
    loading.value = true
    error.value = null
    try {
      // Normalize type for backend
      if (updatedData.type === 'video_ad') {
        updatedData.type = 'video'
      }
      const response = await api.patch(`/ads/${id}`, updatedData)
      const index = ads.value.findIndex(ad => ad.id === id)
      if (index !== -1) {
        ads.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'خطا در بروزرسانی تبلیغ'
      console.error('Error updating ad:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete ad
  const deleteAd = async (id) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/ads/${id}`)
      const index = ads.value.findIndex(ad => ad.id === id)
      if (index !== -1) {
        ads.value.splice(index, 1)
      }
      return true
    } catch (err) {
      error.value = 'خطا در حذف تبلیغ'
      console.error('Error deleting ad:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get ad by ID
  const getAdById = (id) => {
    return ads.value.find(ad => ad.id === id)
  }

  // Update setting
  const updateSetting = async (key, value) => {
    try {
      const response = await api.patch('/ads/settings', { [key]: value })
      settings.value = response.data
      return response.data
    } catch (err) {
      error.value = 'خطا در بروزرسانی تنظیمات'
      console.error('Error updating setting:', err)
      throw err
    }
  }

  // Stats computed property
  const stats = computed(() => {
    return {
      total: ads.value.length,
      active: ads.value.filter(ad => ad.isActive === true).length,
      banners: ads.value.filter(ad => ad.type === 'banner').length,
      videos: ads.value.filter(ad => ad.type === 'video').length,
      rewards: ads.value.filter(ad => ad.type === 'reward').length,
      android: ads.value.filter(ad => ad.platform === 'android' || ad.platform === 'both').length,
      ios: ads.value.filter(ad => ad.platform === 'ios' || ad.platform === 'both').length
    }
  })

  // Placement types
  const placementTypes = [
    { key: 'splash', label: 'بنر اسپلش', icon: '📱' },
    { key: 'main_page', label: 'بنر صفحه اصلی', icon: '🏠' },
    { key: 'video_ad', label: 'تبلیغات ویدیویی', icon: '🎬' },
    { key: 'reward_video', label: 'ویدیو جایزه‌ای', icon: '🎁' },
    { key: 'vpn_connect', label: 'اتصال VPN', icon: '🔌' },
    { key: 'vpn_disconnect', label: 'قطع اتصال VPN', icon: '❌' },
    { key: 'server_change', label: 'تغییر سرور', icon: '🔄' }
  ]

  // Platforms
  const platforms = [
    { value: 'android', label: 'Android' },
    { value: 'ios', label: 'iOS' },
    { value: 'both', label: 'هر دو' }
  ]

  // Ad types
  const adTypes = [
    { value: 'banner', label: 'بنر' },
    { value: 'video', label: 'ویدیو' },
    { value: 'reward', label: 'جایزه‌ای' }
  ]

  // Validate ad
  const validateAd = (ad) => {
    // Normalize type for internal validation and consistency
    if (ad.type === 'video_ad') {
      ad.type = 'video'
    }
    
    console.log('Validating ad data:', ad)
    
    if (!ad.name || !ad.name.trim()) {
      return { isValid: false, error: 'نام تبلیغ نمی‌تواند خالی باشد' }
    }

    if (!ad.adUnitId || !ad.adUnitId.trim()) {
      return { isValid: false, error: 'کلید تبلیغ نمی‌تواند خالی باشد' }
    }

    if (!ad.placement || !ad.placement.trim()) {
      return { isValid: false, error: 'مکان نمایش باید انتخاب شود' }
    }

    if (!['banner', 'video', 'reward'].includes(ad.type)) {
      console.warn('Invalid ad type detected:', ad.type)
      return { isValid: false, error: 'نوع تبلیغ نامعتبر است' }
    }

    if (!['android', 'ios', 'both'].includes(ad.platform)) {
      return { isValid: false, error: 'پلتفرم نامعتبر است' }
    }

    return { isValid: true, error: null }
  }

  // Helper functions for placement management (for UI compatibility)
  const placements = computed(() => {
    const result = {
      splash: [],
      main_page: [],
      video_ad: [],
      reward_video: [],
      vpn_connect: [],
      vpn_disconnect: [],
      server_change: []
    }
    
    ads.value.forEach(ad => {
      if (ad.isActive && ad.placement && result[ad.placement]) {
        result[ad.placement].push(ad.id)
      }
    })
    
    return result
  })

  const toggleAdPlacement = async (adId, placementKey) => {
    const ad = getAdById(adId)
    if (!ad) return

    // Toggle by changing the placement
    const newPlacement = ad.placement === placementKey ? null : placementKey
    await updateAd(adId, { placement: newPlacement })
  }

  const isAdEnabledForPlacement = (adId, placementKey) => {
    const ad = getAdById(adId)
    return ad?.placement === placementKey && ad?.isActive === true
  }

  const getAdsForPlacement = (placementKey) => {
    return ads.value.filter(ad => ad.placement === placementKey)
  }

  return {
    ads,
    settings,
    loading,
    error,
    stats,
    placements,
    placementTypes,
    platforms,
    adTypes,
    addAd,
    updateAd,
    deleteAd,
    getAdById,
    updateSetting,
    toggleAdPlacement,
    isAdEnabledForPlacement,
    getAdsForPlacement,
    validateAd,
    loadAds,
    loadSettings
  }
})
