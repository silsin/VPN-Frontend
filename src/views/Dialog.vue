<template>
  <DashboardLayout>
    <div class="page-content">
      <h1 class="page-title">دیالوگ و اعلان‌ها</h1>
      <p class="page-description">مدیریت دیالوگ‌های درون برنامه‌ای و اعلان‌های Push برای ارتباط با کاربران.</p>

      <!-- آمار دیالوگ‌ها -->
      <div class="stats-section">
        <div class="stats-container">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">💬</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.dialogs }}</div>
                <div class="stat-label">دیالوگ‌ها</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🔔</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.pushes }}</div>
                <div class="stat-label">اعلان‌های Push</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📤</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.sent }}</div>
                <div class="stat-label">ارسال شده</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⏰</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.scheduled }}</div>
                <div class="stat-label">برنامه‌ریزی شده</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- فیلترها -->
      <div class="filters-section">
        <div class="filters-container">
          <div class="filter-group">
            <label>نوع:</label>
            <select v-model="filterType" @change="updateFilters" class="filter-select">
              <option value="all">همه</option>
              <option value="dialog">دیالوگ‌ها</option>
              <option value="push">اعلان‌های Push</option>
            </select>
          </div>

          <div class="filter-group">
            <label>وضعیت:</label>
            <select v-model="filterStatus" @change="updateFilters" class="filter-select">
              <option value="all">همه</option>
              <option value="draft">پیش‌نویس</option>
              <option value="scheduled">برنامه‌ریزی شده</option>
              <option value="sent">ارسال شده</option>
              <option value="cancelled">لغو شده</option>
            </select>
          </div>

          <div class="search-group">
            <input
              type="text"
              v-model="searchQuery"
              @input="debouncedSearch"
              placeholder="جستجو در عنوان یا پیام..."
              class="search-input"
            />
            <div class="search-icon">🔍</div>
          </div>
        </div>
      </div>

      <!-- جدول دیالوگ‌ها -->
      <DialogTable
        :dialogs="filteredDialogs"
        @add-dialog="openAddModal"
        @edit-dialog="openEditModal"
        @send-dialog="sendDialog"
        @cancel-scheduled="cancelScheduledDialog"
        @delete-dialog="deleteDialog"
      />

      <!-- مودال افزودن/ویرایش -->
      <DialogModal
        :is-open="isModalOpen"
        :editing-dialog="editingDialog"
        @close="closeModal"
        @save="handleSave"
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from "../components/DashboardLayout.vue"
import DialogTable from "../components/DialogTable.vue"
import DialogModal from "../components/DialogModal.vue"
import { useDialogStore } from '../stores/dialog'

const dialogStore = useDialogStore()
const isModalOpen = ref(false)
const editingDialog = ref(null)

// فیلترها
const searchQuery = ref('')
const filterType = ref('all')
const filterStatus = ref('all')

// Computed properties
const stats = computed(() => dialogStore.stats)
const filteredDialogs = computed(() => dialogStore.filteredDialogs)

// Debounce برای جستجو
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    dialogStore.setSearchQuery(searchQuery.value)
  }, 300)
}

const updateFilters = () => {
  dialogStore.setFilterType(filterType.value)
  dialogStore.setFilterStatus(filterStatus.value)
}

const openAddModal = () => {
  editingDialog.value = null
  isModalOpen.value = true
}

const openEditModal = (dialog) => {
  editingDialog.value = dialog
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingDialog.value = null
}

const sendDialog = (dialog) => {
  if (confirm(`آیا مطمئن هستید که می‌خواهید "${dialog.title}" را ارسال کنید؟`)) {
    dialogStore.sendDialog(dialog.id)
  }
}

const cancelScheduledDialog = (dialog) => {
  if (confirm(`آیا مطمئن هستید که برنامه‌ریزی "${dialog.title}" را لغو کنید؟`)) {
    dialogStore.cancelScheduledDialog(dialog.id)
  }
}

const deleteDialog = (dialogId) => {
  dialogStore.deleteDialog(dialogId)
}

const handleSave = () => {
  // عملیات ذخیره در مودال انجام می‌شود
  // اینجا فقط می‌توانیم عملیات اضافی انجام دهیم اگر نیاز باشد
}

// بارگذاری داده‌ها در زمان mount
onMounted(() => {
  dialogStore.loadDialogs()
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
}
</style>

