import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// نمونه داده‌های اولیه برای تبلیغات
const initialAds = [
  {
    id: '1',
    name: 'بنر اسپلش صفحه اصلی',
    type: 'banner', // 'banner' or 'video'
    key: 'ca-app-pub-3940256099942544/6300978111',
    platform: 'android', // 'android', 'ios', 'both'
    placements: ['splash_banner'], // array of placement keys
    status: 'active', // 'active', 'inactive'
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'ویدیو تبلیغاتی',
    type: 'video',
    key: 'ca-app-pub-3940256099942544/8691691433',
    platform: 'both',
    placements: ['video_ads', 'rewarded_video'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'بنر صفحه اصلی',
    type: 'banner',
    key: 'ca-app-pub-3940256099942544/1033173712',
    platform: 'ios',
    placements: ['home_banner'],
    status: 'inactive',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// تنظیمات نمایش تبلیغات در بخش‌های مختلف
const initialPlacements = {
  splash_banner: ['1'], // IDs of ads enabled for splash banner
  home_banner: ['1', '3'], // IDs of ads enabled for home banner
  video_ads: ['2'], // IDs of ads enabled for video ads
  rewarded_video: [], // IDs of ads enabled for rewarded video
}

export const useAdsStore = defineStore('ads', () => {
  const ads = ref([])
  const placements = ref({})

  // بارگذاری داده‌ها از localStorage
  const loadAds = () => {
    const storedAds = localStorage.getItem('adsData')
    const storedPlacements = localStorage.getItem('adsPlacements')

    if (storedAds) {
      try {
        ads.value = JSON.parse(storedAds)
      } catch (e) {
        console.error('Error loading ads:', e)
        ads.value = initialAds
      }
    } else {
      ads.value = initialAds
      saveAds()
    }

    if (storedPlacements) {
      try {
        placements.value = JSON.parse(storedPlacements)
      } catch (e) {
        console.error('Error loading placements:', e)
        placements.value = initialPlacements
      }
    } else {
      placements.value = initialPlacements
      savePlacements()
    }
  }

  // ذخیره تبلیغات در localStorage
  const saveAds = () => {
    localStorage.setItem('adsData', JSON.stringify(ads.value))
  }

  // ذخیره تنظیمات نمایش در localStorage
  const savePlacements = () => {
    localStorage.setItem('adsPlacements', JSON.stringify(placements.value))
  }

  // افزودن تبلیغ جدید
  const addAd = (ad) => {
    const newAd = {
      id: Date.now().toString(),
      ...ad,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    ads.value.push(newAd)
    saveAds()
    return newAd
  }

  // بروزرسانی تبلیغ
  const updateAd = (id, updatedAd) => {
    const index = ads.value.findIndex(ad => ad.id === id)
    if (index !== -1) {
      ads.value[index] = {
        ...ads.value[index],
        ...updatedAd,
        updatedAt: new Date().toISOString()
      }
      saveAds()
      return ads.value[index]
    }
    return null
  }

  // حذف تبلیغ
  const deleteAd = (id) => {
    const index = ads.value.findIndex(ad => ad.id === id)
    if (index !== -1) {
      // حذف تبلیغ از تمام placementها
      Object.keys(placements.value).forEach(placementKey => {
        placements.value[placementKey] = placements.value[placementKey].filter(adId => adId !== id)
      })
      savePlacements()

      ads.value.splice(index, 1)
      saveAds()
      return true
    }
    return false
  }

  // گرفتن تبلیغ بر اساس ID
  const getAdById = (id) => {
    return ads.value.find(ad => ad.id === id)
  }

  // مدیریت placementها
  const toggleAdPlacement = (adId, placementKey) => {
    if (!placements.value[placementKey]) {
      placements.value[placementKey] = []
    }

    const index = placements.value[placementKey].indexOf(adId)
    if (index > -1) {
      placements.value[placementKey].splice(index, 1)
    } else {
      placements.value[placementKey].push(adId)
    }
    savePlacements()
  }

  const isAdEnabledForPlacement = (adId, placementKey) => {
    return placements.value[placementKey]?.includes(adId) || false
  }

  const getAdsForPlacement = (placementKey) => {
    const enabledAdIds = placements.value[placementKey] || []
    return ads.value.filter(ad => enabledAdIds.includes(ad.id))
  }

  // آمار تبلیغات
  const stats = computed(() => {
    return {
      total: ads.value.length,
      active: ads.value.filter(ad => ad.status === 'active').length,
      banners: ads.value.filter(ad => ad.type === 'banner').length,
      videos: ads.value.filter(ad => ad.type === 'video').length,
      android: ads.value.filter(ad => ad.platform === 'android' || ad.platform === 'both').length,
      ios: ads.value.filter(ad => ad.platform === 'ios' || ad.platform === 'both').length
    }
  })

  // لیست placementها
  const placementTypes = [
    { key: 'splash_banner', label: 'بنر اسپلش', icon: '📱' },
    { key: 'home_banner', label: 'بنر صفحه اصلی', icon: '🏠' },
    { key: 'video_ads', label: 'تبلیغات ویدیویی', icon: '🎥' },
    { key: 'rewarded_video', label: 'ویدیو جایزه‌ای', icon: '🎁' }
  ]

  // پلتفرم‌ها
  const platforms = [
    { value: 'android', label: 'Android' },
    { value: 'ios', label: 'iOS' },
    { value: 'both', label: 'هر دو' }
  ]

  // انواع تبلیغات
  const adTypes = [
    { value: 'banner', label: 'بنر' },
    { value: 'video', label: 'ویدیو' }
  ]

// اعتبارسنجی تبلیغ
const validateAd = (ad) => {
  if (!ad.name || !ad.name.trim()) {
    return { isValid: false, error: 'نام تبلیغ نمی‌تواند خالی باشد' }
  }

  if (!ad.key || !ad.key.trim()) {
    return { isValid: false, error: 'کلید تبلیغ نمی‌تواند خالی باشد' }
  }

  if (!ad.placements || ad.placements.length === 0) {
    return { isValid: false, error: 'حداقل یک مکان نمایش باید انتخاب شود' }
  }

  if (!['banner', 'video'].includes(ad.type)) {
    return { isValid: false, error: 'نوع تبلیغ نامعتبر است' }
  }

  if (!['android', 'ios', 'both'].includes(ad.platform)) {
    return { isValid: false, error: 'پلتفرم نامعتبر است' }
  }

  return { isValid: true, error: null }
}

  // مقداردهی اولیه
  loadAds()

  return {
    ads,
    placements,
    stats,
    placementTypes,
    platforms,
    adTypes,
    addAd,
    updateAd,
    deleteAd,
    getAdById,
    toggleAdPlacement,
    isAdEnabledForPlacement,
    getAdsForPlacement,
    validateAd,
    loadAds,
    saveAds,
    savePlacements
  }
})
