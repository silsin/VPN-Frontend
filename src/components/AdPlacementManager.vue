<template>
  <div class="placement-manager">
    <div class="manager-header">
      <h3>مدیریت نمایش تبلیغات</h3>
      <p>تبلیغات فعال در بخش‌های مختلف اپلیکیشن را مدیریت کنید</p>
    </div>

    <!-- مدیریت نمایش تبلیغات -->
    <div class="placement-management">
      <div class="placement-section">
        <h4>🏠 صفحه اسپلش - بنر</h4>
        <div class="placement-ads">
          <div
            v-for="ad in getAdsForPlacement('splash_banner')"
            :key="ad.id"
            class="ad-placement-card"
            :class="{ active: isAdEnabledForPlacement(ad.id, 'splash_banner') }"
          >
            <div class="ad-placement-info">
              <div class="ad-placement-name">{{ ad.name }}</div>
              <div class="ad-placement-type">
                <span class="type-badge" :class="ad.type">{{ ad.type === 'banner' ? 'بنر' : 'ویدیو' }}</span>
              </div>
            </div>
            <div class="ad-placement-toggle">
              <div class="toggle-switch">
                <input
                  type="checkbox"
                  :id="'splash-' + ad.id"
                  :checked="isAdEnabledForPlacement(ad.id, 'splash_banner')"
                  @change="toggleAdForPlacement(ad.id, 'splash_banner')"
                />
                <label :for="'splash-' + ad.id" class="toggle-slider"></label>
              </div>
            </div>
          </div>
          <div v-if="getAdsForPlacement('splash_banner').length === 0" class="no-ads-message">
            هیچ تبلیغی برای این جایگاه تعریف نشده است
          </div>
        </div>
      </div>

      <div class="placement-section">
        <h4>📱 صفحه اصلی - بنر</h4>
        <div class="placement-ads">
          <div
            v-for="ad in getAdsForPlacement('home_banner')"
            :key="ad.id"
            class="ad-placement-card"
            :class="{ active: isAdEnabledForPlacement(ad.id, 'home_banner') }"
          >
            <div class="ad-placement-info">
              <div class="ad-placement-name">{{ ad.name }}</div>
              <div class="ad-placement-type">
                <span class="type-badge" :class="ad.type">{{ ad.type === 'banner' ? 'بنر' : 'ویدیو' }}</span>
              </div>
            </div>
            <div class="ad-placement-toggle">
              <div class="toggle-switch">
                <input
                  type="checkbox"
                  :id="'home-' + ad.id"
                  :checked="isAdEnabledForPlacement(ad.id, 'home_banner')"
                  @change="toggleAdForPlacement(ad.id, 'home_banner')"
                />
                <label :for="'home-' + ad.id" class="toggle-slider"></label>
              </div>
            </div>
          </div>
          <div v-if="getAdsForPlacement('home_banner').length === 0" class="no-ads-message">
            هیچ تبلیغی برای این جایگاه تعریف نشده است
          </div>
        </div>
      </div>

      <div class="placement-section">
        <h4>🎬 تبلیغات ویدیویی</h4>
        <div class="placement-ads">
          <div
            v-for="ad in getAdsForPlacement('video_ads')"
            :key="ad.id"
            class="ad-placement-card"
            :class="{ active: isAdEnabledForPlacement(ad.id, 'video_ads') }"
          >
            <div class="ad-placement-info">
              <div class="ad-placement-name">{{ ad.name }}</div>
              <div class="ad-placement-type">
                <span class="type-badge" :class="ad.type">{{ ad.type === 'banner' ? 'بنر' : 'ویدیو' }}</span>
              </div>
            </div>
            <div class="ad-placement-toggle">
              <div class="toggle-switch">
                <input
                  type="checkbox"
                  :id="'video-' + ad.id"
                  :checked="isAdEnabledForPlacement(ad.id, 'video_ads')"
                  @change="toggleAdForPlacement(ad.id, 'video_ads')"
                />
                <label :for="'video-' + ad.id" class="toggle-slider"></label>
              </div>
            </div>
          </div>
          <div v-if="getAdsForPlacement('video_ads').length === 0" class="no-ads-message">
            هیچ تبلیغی برای این جایگاه تعریف نشده است
          </div>
        </div>
      </div>

      <div class="placement-section">
        <h4>🎁 ویدیو جایزه‌ای</h4>
        <div class="placement-ads">
          <div
            v-for="ad in getAdsForPlacement('rewarded_video')"
            :key="ad.id"
            class="ad-placement-card"
            :class="{ active: isAdEnabledForPlacement(ad.id, 'rewarded_video') }"
          >
            <div class="ad-placement-info">
              <div class="ad-placement-name">{{ ad.name }}</div>
              <div class="ad-placement-type">
                <span class="type-badge" :class="ad.type">{{ ad.type === 'banner' ? 'بنر' : 'ویدیو' }}</span>
              </div>
            </div>
            <div class="ad-placement-toggle">
              <div class="toggle-switch">
                <input
                  type="checkbox"
                  :id="'rewarded-' + ad.id"
                  :checked="isAdEnabledForPlacement(ad.id, 'rewarded_video')"
                  @change="toggleAdForPlacement(ad.id, 'rewarded_video')"
                />
                <label :for="'rewarded-' + ad.id" class="toggle-slider"></label>
              </div>
            </div>
          </div>
          <div v-if="getAdsForPlacement('rewarded_video').length === 0" class="no-ads-message">
            هیچ تبلیغی برای این جایگاه تعریف نشده است
          </div>
        </div>
      </div>
    </div>

    <!-- پیش‌نمایش موبایل -->
    <div class="mobile-preview">
      <div class="preview-header">
        <h4>👁️ پیش‌نمایش نمایش تبلیغات</h4>
      </div>

      <div class="mobile-container">
        <div class="mobile-device">
          <div class="mobile-notch">
            <div class="notch-content">
              <div class="signal-bars">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
              </div>
              <div class="carrier">FlyVPN</div>
              <div class="time">{{ currentTime }}</div>
            </div>
          </div>

          <div class="mobile-screen">
            <div class="screen-content">
              <div class="app-logo">
                <div class="logo-icon">🚀</div>
                <div class="logo-text">FlyVPN</div>
              </div>

              <!-- بنر اسپلش -->
              <div
                class="ad-banner"
                :class="{ 'ad-active': hasActiveAdsForPlacement('splash_banner') }"
              >
                <div v-if="hasActiveAdsForPlacement('splash_banner')" class="ad-content">
                  <div class="ad-label">تبلیغ اسپلش</div>
                  <div class="ad-indicator">📢</div>
                </div>
                <div v-else class="ad-placeholder">
                  بدون تبلیغ
                </div>
              </div>

              <div class="home-content">
                <div class="home-header">
                  <h4>خوش آمدید</h4>
                  <div class="user-avatar">👤</div>
                </div>

                <div class="vpn-status">
                  <div class="status-indicator">🟢</div>
                  <span>اتصال برقرار است</span>
                </div>

                <!-- بنر صفحه اصلی -->
                <div
                  class="ad-banner"
                  :class="{ 'ad-active': hasActiveAdsForPlacement('home_banner') }"
                >
                  <div v-if="hasActiveAdsForPlacement('home_banner')" class="ad-content">
                    <div class="ad-label">تبلیغ صفحه اصلی</div>
                    <div class="ad-indicator">📢</div>
                  </div>
                  <div v-else class="ad-placeholder">
                    بدون تبلیغ
                  </div>
                </div>

                <div class="action-buttons">
                  <button class="action-btn" :class="{ 'with-video': hasActiveAdsForPlacement('video_ads') }">
                    اتصال سریع
                    <span v-if="hasActiveAdsForPlacement('video_ads')" class="video-indicator">🎥</span>
                  </button>
                  <button class="action-btn" :class="{ 'with-reward': hasActiveAdsForPlacement('rewarded_video') }">
                    جایزه روزانه
                    <span v-if="hasActiveAdsForPlacement('rewarded_video')" class="reward-indicator">🎁</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mobile-navigation">
            <div class="nav-btn">
              <span>🏠</span>
            </div>
            <div class="nav-btn">
              <span>📊</span>
            </div>
            <div class="nav-btn active">
              <span>⚙️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdsStore } from '../stores/ads'

const adsStore = useAdsStore()
const currentTime = ref('')

// Computed properties
const ads = computed(() => adsStore.ads.filter(ad => ad.status === 'active'))

const getAdsForPlacement = (placementKey) => {
  return ads.value.filter(ad => ad.placements && ad.placements.includes(placementKey))
}

const isAdEnabledForPlacement = (adId, placementKey) => {
  return adsStore.isAdEnabledForPlacement(adId, placementKey)
}

const hasActiveAdsForPlacement = (placementKey) => {
  const enabledAds = adsStore.placements[placementKey] || []
  return enabledAds.length > 0
}

const toggleAdForPlacement = (adId, placementKey) => {
  adsStore.toggleAdPlacement(adId, placementKey)
}

// بروزرسانی زمان
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  updateTime()
  const interval = setInterval(updateTime, 60000) // بروزرسانی هر دقیقه

  return () => clearInterval(interval)
})
</script>

<style scoped>
.placement-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.manager-header {
  text-align: center;
  margin-bottom: 32px;
}

.manager-header h3 {
  color: #2d3748;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  font-family: "Vazirmatn", sans-serif;
}

.manager-header p {
  color: #718096;
  font-size: 16px;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
}

.placement-management {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 32px;
  margin-bottom: 48px;
}

.placement-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.placement-section h4 {
  color: #2d3748;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px 0;
  font-family: "Vazirmatn", sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
}

.placement-ads {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ad-placement-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.2s ease;
}

.ad-placement-card:hover {
  background: rgba(102, 126, 234, 0.08);
  transform: translateY(-1px);
}

.ad-placement-card.active {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.ad-placement-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.ad-placement-name {
  font-weight: 600;
  color: #2d3748;
  font-family: "Vazirmatn", sans-serif;
  font-size: 15px;
  flex: 1;
}

.ad-placement-type {
  flex-shrink: 0;
}

.type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
}

.type-badge.banner {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.type-badge.video {
  background: rgba(251, 146, 60, 0.1);
  color: #ea580c;
}

.ad-placement-toggle {
  flex-shrink: 0;
}

.no-ads-message {
  text-align: center;
  padding: 32px 16px;
  color: #718096;
  font-family: "Vazirmatn", sans-serif;
  font-style: italic;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 2px dashed rgba(102, 126, 234, 0.2);
}

/* Toggle Switch Styles */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .toggle-slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.mobile-preview {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 32px;
}

.preview-header {
  text-align: center;
  margin-bottom: 24px;
}

.preview-header h4 {
  color: #2d3748;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
}

.mobile-container {
  display: flex;
  justify-content: center;
}

.mobile-device {
  width: 300px;
  height: 600px;
  background: #000;
  border-radius: 30px;
  position: relative;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.mobile-notch {
  height: 35px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.notch-content {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.signal-bars {
  display: flex;
  gap: 2px;
}

.bar {
  width: 3px;
  height: 10px;
  background: white;
  border-radius: 1px;
}

.bar:nth-child(1) { height: 4px; opacity: 0.3; }
.bar:nth-child(2) { height: 6px; opacity: 0.5; }
.bar:nth-child(3) { height: 8px; opacity: 0.7; }
.bar:nth-child(4) { height: 10px; opacity: 1; }

.mobile-screen {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: calc(100% - 35px - 60px);
  position: relative;
  overflow: hidden;
}

.screen-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  direction: rtl;
}

.app-logo {
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.logo-text {
  color: white;
  font-size: 20px;
  font-weight: 700;
  font-family: "Vazirmatn", sans-serif;
}

.ad-banner {
  width: 100%;
  height: 50px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0;
  transition: all 0.3s ease;
  font-family: "Vazirmatn", sans-serif;
  font-size: 14px;
  font-weight: 600;
}

.ad-banner.ad-active {
  background: rgba(34, 197, 94, 0.15);
  border: 2px solid rgba(34, 197, 94, 0.4);
  color: #16a34a;
}

.ad-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ad-placeholder {
  color: #718096;
}

.home-content {
  flex: 1;
  margin-top: 20px;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.home-header h4 {
  color: white;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
  font-size: 16px;
}

.user-avatar {
  font-size: 24px;
}

.vpn-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  margin-bottom: 15px;
  font-family: "Vazirmatn", sans-serif;
  font-size: 14px;
  justify-content: center;
}

.status-indicator {
  font-size: 16px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.action-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.action-btn.with-video {
  background: rgba(251, 146, 60, 0.2);
  border: 1px solid rgba(251, 146, 60, 0.3);
}

.action-btn.with-reward {
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.video-indicator,
.reward-indicator {
  font-size: 14px;
}

.mobile-navigation {
  height: 60px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  padding: 8px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.nav-btn.active {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-btn span {
  font-size: 18px;
  margin-bottom: 2px;
}

@media (max-width: 1024px) {
  .placement-controls {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .placement-manager {
    padding: 0 15px;
  }

  .mobile-device {
    width: 260px;
    height: 520px;
  }

  .placement-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .placement-info {
    width: 100%;
  }

  .placement-toggle {
    align-self: flex-end;
  }

  .control-group {
    padding: 20px;
  }
}
</style>
