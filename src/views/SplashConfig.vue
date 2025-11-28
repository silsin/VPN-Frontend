<template>
  <DashboardLayout>
    <div class="page-content">
      <h1 class="page-title">کانفیگ اسپلش</h1>
      <p class="page-description">مدیریت کانفیگ‌های V2Ray برای صفحه اسپلش اپلیکیشن VPN.</p>

      <!-- کامپوننت جستجو و فیلتر -->
      <ConfigSearchFilter />

      <!-- کامپوننت جدول -->
      <ConfigTable
        :configs="filteredConfigs"
        @add-config="openAddModal"
        @edit-config="openEditModal"
        @delete-config="deleteConfig"
      />

      <!-- مودال افزودن/ویرایش -->
      <ConfigModal
        :is-open="isModalOpen"
        :editing-config="editingConfig"
        category="splash"
        @close="closeModal"
        @save="handleSave"
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue'
import DashboardLayout from "../components/DashboardLayout.vue"
import ConfigSearchFilter from "../components/ConfigSearchFilter.vue"
import ConfigTable from "../components/ConfigTable.vue"
import ConfigModal from "../components/ConfigModal.vue"
import { useConfigStore } from '../stores/config'

const configStore = useConfigStore()
const isModalOpen = ref(false)
const editingConfig = ref(null)

// استفاده از filteredConfigs از store
const filteredConfigs = computed(() => configStore.filteredConfigs)

const openAddModal = () => {
  editingConfig.value = null
  isModalOpen.value = true
}

const openEditModal = (config) => {
  editingConfig.value = config
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingConfig.value = null
}

const deleteConfig = (configId) => {
  configStore.deleteConfig(configId)
}

const handleSave = () => {
  // عملیات ذخیره در مودال انجام می‌شود
  // اینجا فقط می‌توانیم عملیات اضافی انجام دهیم اگر نیاز باشد
}

// بارگذاری داده‌ها در زمان mount
onMounted(() => {
  configStore.loadConfigs('splash')
})

// بارگذاری مجدد هنگام بازگشت به صفحه
onActivated(() => {
  configStore.loadConfigs('splash')
})
</script>

<style scoped>
.page-content {
  width: 100%;
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
}

.page-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin: 0 0 32px 0;
  font-family: "Vazirmatn", sans-serif;
}

.content-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.content-card h2 {
  color: #2d3748;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px 0;
  font-family: "Vazirmatn", sans-serif;
}

.content-card p {
  color: #4a5568;
  font-size: 15px;
  line-height: 1.8;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
}
</style>

