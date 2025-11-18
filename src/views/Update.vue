<template>
  <DashboardLayout>
    <div class="page-content">
      <h1 class="page-title">مدیریت آپدیت‌ها</h1>
      <p class="page-description">کنترل نسخه‌های اپلیکیشن و مدیریت بروزرسانی‌های اجباری و اختیاری.</p>

      <!-- آمار آپدیت‌ها -->
      <div class="stats-section">
        <div class="stats-container">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📦</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.total }}</div>
                <div class="stat-label">کل نسخه‌ها</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🚀</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.active }}</div>
                <div class="stat-label">نسخه‌های فعال</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⚡</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.forceUpdates }}</div>
                <div class="stat-label">آپدیت‌های اجباری</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📱</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.latestVersion }}</div>
                <div class="stat-label">آخرین نسخه</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- تنظیمات دیالوگ آپدیت -->
      <div class="dialog-settings-section">
        <div class="settings-container">
          <h3>⚙️ تنظیمات دیالوگ آپدیت</h3>
          <p>پیام‌ها و تنظیمات نمایش دیالوگ بروزرسانی را سفارشی کنید</p>

          <div class="dialog-settings-grid">
            <div class="setting-group">
              <label for="dialog-title">عنوان دیالوگ آپدیت</label>
              <input
                id="dialog-title"
                type="text"
                v-model="updateDialog.title"
                class="setting-input"
                placeholder="عنوان دیالوگ"
              />
            </div>

            <div class="setting-group">
              <label for="dialog-message">پیام دیالوگ آپدیت</label>
              <textarea
                id="dialog-message"
                v-model="updateDialog.message"
                class="setting-textarea"
                placeholder="پیام دیالوگ"
                rows="3"
              ></textarea>
            </div>

            <div class="setting-group">
              <label for="force-title">عنوان دیالوگ اجباری</label>
              <input
                id="force-title"
                type="text"
                v-model="updateDialog.forceUpdateTitle"
                class="setting-input"
                placeholder="عنوان برای آپدیت اجباری"
              />
            </div>

            <div class="setting-group">
              <label for="force-message">پیام دیالوگ اجباری</label>
              <textarea
                id="force-message"
                v-model="updateDialog.forceUpdateMessage"
                class="setting-textarea"
                placeholder="پیام برای آپدیت اجباری"
                rows="3"
              ></textarea>
            </div>

            <div class="setting-group">
              <label for="update-btn">متن دکمه بروزرسانی</label>
              <input
                id="update-btn"
                type="text"
                v-model="updateDialog.updateButtonText"
                class="setting-input"
                placeholder="متن دکمه بروزرسانی"
              />
            </div>

            <div class="setting-group">
              <label for="later-btn">متن دکمه بعداً</label>
              <input
                id="later-btn"
                type="text"
                v-model="updateDialog.laterButtonText"
                class="setting-input"
                placeholder="متن دکمه بعداً"
              />
            </div>

            <div class="setting-group">
              <label for="skip-btn">متن دکمه رد کردن</label>
              <input
                id="skip-btn"
                type="text"
                v-model="updateDialog.skipButtonText"
                class="setting-input"
                placeholder="متن دکمه رد کردن"
              />
            </div>

            <div class="setting-group checkbox-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="updateDialog.showSkipOption"
                  class="setting-checkbox"
                />
                <span class="checkmark"></span>
                نمایش گزینه رد کردن آپدیت
              </label>
            </div>

            <div class="setting-group">
              <label for="dialog-image">تصویر دیالوگ (اختیاری)</label>
              <input
                id="dialog-image"
                type="url"
                v-model="updateDialog.imageUrl"
                class="setting-input"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div class="settings-actions">
            <button class="save-settings-btn" @click="saveDialogSettings">
              💾 ذخیره تنظیمات
            </button>
          </div>
        </div>
      </div>

      <!-- فیلترها -->
      <div class="filters-section">
        <div class="filters-container">
          <div class="filter-group">
            <label>پلتفرم:</label>
            <select v-model="filterPlatform" @change="updateFilters" class="filter-select">
              <option value="all">همه پلتفرم‌ها</option>
              <option value="android">Android</option>
              <option value="ios">iOS</option>
              <option value="both">هر دو</option>
            </select>
          </div>

          <div class="filter-group">
            <label>وضعیت:</label>
            <select v-model="filterStatus" @change="updateFilters" class="filter-select">
              <option value="all">همه وضعیت‌ها</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </div>

          <div class="search-group">
            <input
              type="text"
              v-model="searchQuery"
              @input="debouncedSearch"
              placeholder="جستجو در نام نسخه یا تغییرات..."
              class="search-input"
            />
            <div class="search-icon">🔍</div>
          </div>
        </div>
      </div>

      <!-- جدول آپدیت‌ها -->
      <UpdateTable
        :updates="filteredUpdates"
        :latest-update="latestUpdate"
        @add-update="openAddModal"
        @edit-update="openEditModal"
        @activate-update="activateUpdate"
        @view-update="viewUpdate"
        @delete-update="deleteUpdate"
      />

      <!-- مودال افزودن/ویرایش آپدیت -->
      <UpdateModal
        :is-open="isModalOpen"
        :editing-update="editingUpdate"
        @close="closeModal"
        @save="handleSave"
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from "../components/DashboardLayout.vue"
import UpdateTable from "../components/UpdateTable.vue"
import UpdateModal from "../components/UpdateModal.vue"
import { useUpdateStore } from '../stores/update'

const updateStore = useUpdateStore()
const isModalOpen = ref(false)
const editingUpdate = ref(null)

// فیلترها
const searchQuery = ref('')
const filterPlatform = ref('all')
const filterStatus = ref('all')

// تنظیمات دیالوگ
const updateDialog = ref({ ...updateStore.updateDialog })

// Computed properties
const stats = computed(() => updateStore.stats)
const filteredUpdates = computed(() => updateStore.filteredUpdates)
const latestUpdate = computed(() => updateStore.getLatestUpdate())

// Debounce برای جستجو
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    updateStore.setSearchQuery(searchQuery.value)
  }, 300)
}

const updateFilters = () => {
  updateStore.setFilterPlatform(filterPlatform.value)
  updateStore.setFilterStatus(filterStatus.value)
}

const openAddModal = () => {
  editingUpdate.value = null
  isModalOpen.value = true
}

const openEditModal = (update) => {
  editingUpdate.value = update
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingUpdate.value = null
}

const activateUpdate = (update) => {
  if (confirm(`آیا مطمئن هستید که نسخه "${update.versionName}" را فعال کنید؟ نسخه فعلی غیرفعال خواهد شد.`)) {
    updateStore.updateUpdate(update.id, { status: 'active' })
  }
}

const viewUpdate = (update) => {
  // نمایش جزئیات کامل آپدیت در یک مودال یا صفحه جداگانه
  alert(`جزئیات نسخه ${update.versionName}:\n\n${update.releaseNotes.join('\n• ')}`)
}

const deleteUpdate = (updateId) => {
  updateStore.deleteUpdate(updateId)
}

const saveDialogSettings = () => {
  updateStore.updateDialogSettings(updateDialog.value)
  alert('تنظیمات دیالوگ آپدیت ذخیره شد!')
}

const handleSave = () => {
  // عملیات ذخیره در مودال انجام می‌شود
  // اینجا فقط می‌توانیم عملیات اضافی انجام دهیم اگر نیاز باشد
}

// بارگذاری داده‌ها در زمان mount
onMounted(() => {
  updateStore.loadUpdates()
})
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

.dialog-settings-section {
  margin-bottom: 48px;
}

.settings-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.settings-container h3 {
  color: #2d3748;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
  font-family: "Vazirmatn", sans-serif;
}

.settings-container > p {
  color: #718096;
  font-size: 14px;
  margin: 0 0 24px 0;
  font-family: "Vazirmatn", sans-serif;
}

.dialog-settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.setting-group {
  display: flex;
  flex-direction: column;
}

.setting-group.checkbox-group {
  justify-content: center;
}

.setting-group label {
  color: #2d3748;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  margin-bottom: 8px;
  font-size: 14px;
}

.setting-input,
.setting-textarea {
  padding: 12px 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 14px;
  font-family: "Vazirmatn", sans-serif;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  outline: none;
  resize: vertical;
}

.setting-input:focus,
.setting-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-family: "Vazirmatn", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
}

.setting-checkbox {
  display: none;
}

.checkmark {
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-label input:checked ~ .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label input:checked ~ .checkmark:after {
  display: block;
}

.settings-actions {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

.save-settings-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-settings-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.filters-section {
  margin-bottom: 32px;
}

.filters-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  color: #2d3748;
  font-family: "Vazirmatn", sans-serif;
  font-size: 14px;
  white-space: nowrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  font-family: "Vazirmatn", sans-serif;
  font-size: 14px;
  background: white;
  min-width: 120px;
}

.search-group {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  font-family: "Vazirmatn", sans-serif;
  font-size: 14px;
  background: white;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #667eea;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
  font-size: 16px;
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

  .dialog-settings-grid {
    grid-template-columns: 1fr;
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

  .dialog-settings-section {
    margin-bottom: 40px;
  }

  .settings-container {
    padding: 24px;
  }

  .dialog-settings-grid {
    gap: 16px;
  }

  .filters-container {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .filter-group {
    justify-content: space-between;
  }

  .search-group {
    min-width: auto;
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

  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .stat-icon {
    font-size: 24px;
  }

  .stat-number {
    font-size: 20px;
  }

  .settings-container {
    padding: 20px;
  }

  .dialog-settings-grid {
    gap: 12px;
  }
}
</style>

