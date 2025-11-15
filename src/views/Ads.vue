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
  const newStatus = ad.status === "active" ? "inactive" : "active";
  adsStore.updateAd(ad.id, { status: newStatus });
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
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
  font-family: "Vazirmatn", sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
}

.page-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin: 0 0 40px 0;
  font-family: "Vazirmatn", sans-serif;
  text-align: center;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.stats-section {
  margin-bottom: 48px;
}

.stats-container {
  max-width: 1000px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin: 0 auto;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  justify-content: center;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  font-family: "Vazirmatn", sans-serif;
  margin-bottom: 6px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  font-family: "Vazirmatn", sans-serif;
  font-weight: 500;
}

@media (max-width: 1024px) {
  .page-content {
    padding: 0 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    max-width: 600px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    font-size: 32px;
  }

  .stat-number {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: 0 16px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-description {
    font-size: 15px;
    margin-bottom: 32px;
  }

  .stats-section {
    margin-bottom: 40px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    max-width: 400px;
  }

  .stat-card {
    padding: 18px;
    gap: 16px;
  }

  .stat-icon {
    font-size: 28px;
  }

  .stat-number {
    font-size: 24px;
  }

  .stat-label {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .page-content {
    padding: 0 12px;
  }

  .page-title {
    font-size: 24px;
  }

  .page-description {
    font-size: 14px;
  }
}
</style>
