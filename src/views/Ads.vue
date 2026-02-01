<template>
  <DashboardLayout>
    <div class="page-content">
      <h1 class="page-title">تبلیغات</h1>
      <p class="page-description">مدیریت و تنظیمات تبلیغات در اپلیکیشن VPN.</p>

      <!-- آمار تبلیغات -->
      <div class="stats-section">
        <div class="stats-container">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.total }}</div>
                <div class="stat-label">کل تبلیغات</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.active }}</div>
                <div class="stat-label">تبلیغات فعال</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📄</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.banners }}</div>
                <div class="stat-label">بنرها</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🎥</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.videos }}</div>
                <div class="stat-label">ویدیوها</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- مدیریت نمایش تبلیغات -->
      <AdPlacementManager />

      <!-- جدول مدیریت تبلیغات -->
      <AdsTable
        :ads="ads"
        @add-ad="openAddModal"
        @edit-ad="openEditModal"
        @toggle-status="toggleAdStatus"
        @delete-ad="deleteAd"
      />

      <!-- مودال افزودن/ویرایش تبلیغ -->
      <AdModal
        :is-open="isModalOpen"
        :editing-ad="editingAd"
        @close="closeModal"
        @save="handleSave"
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import DashboardLayout from "../components/DashboardLayout.vue";
import AdPlacementManager from "../components/AdPlacementManager.vue";
import AdsTable from "../components/AdsTable.vue";
import AdModal from "../components/AdModal.vue";
import { useAdsStore } from "../stores/ads";

const adsStore = useAdsStore();
const isModalOpen = ref(false);
const editingAd = ref(null);

// Computed properties
const ads = computed(() => adsStore.ads);
const stats = computed(() => adsStore.stats);

const openAddModal = () => {
  editingAd.value = null;
  isModalOpen.value = true;
};

const openEditModal = (ad) => {
  editingAd.value = ad;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingAd.value = null;
};

const toggleAdStatus = (ad) => {
  const newStatus = !ad.isActive;
  adsStore.updateAd(ad.id, { isActive: newStatus });
};

const deleteAd = (adId) => {
  adsStore.deleteAd(adId);
};

const handleSave = () => {
  // عملیات ذخیره در مودال انجام می‌شود
  // اینجا فقط می‌توانیم عملیات اضافی انجام دهیم اگر نیاز باشد
};

// بارگذاری داده‌ها در زمان mount
onMounted(() => {
  adsStore.loadAds();
});
</script>

<style scoped>
.page-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-title {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 12px 0;
  font-family: "Vazirmatn", sans-serif;
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: -1px;
}

.page-description {
  color: #94a3b8;
  font-size: 16px;
  margin: 0 0 40px 0;
  font-family: "Vazirmatn", sans-serif;
  text-align: center;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 500;
}

.stats-section {
  margin-bottom: 48px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.stat-card {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(25px) saturate(180%);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(129, 140, 248, 0.3);
}

.stat-icon {
  font-size: 32px;
  background: rgba(129, 140, 248, 0.1);
  padding: 12px;
  border-radius: 18px;
  line-height: 1;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: 800;
  color: #ffffff;
  font-family: "Vazirmatn", sans-serif;
  margin-bottom: 2px;
  letter-spacing: -1px;
}

.stat-label {
  font-size: 14px;
  color: #94a3b8;
  font-family: "Vazirmatn", sans-serif;
  font-weight: 500;
}

@media (max-width: 768px) {
  .page-title { font-size: 28px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
}

@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
