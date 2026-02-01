<template>
  <DashboardLayout>
    <div class="page-content">
      <h1 class="page-title">کانفیگ اصلی</h1>
      <p class="page-description">مدیریت سرورها و کانفیگ‌ها (V2Ray, OpenVPN, SSTP, SSH).</p>

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
        category="main"
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
  configStore.loadConfigs('main')
})

// بارگذاری مجدد هنگام بازگشت به صفحه
onActivated(() => {
  configStore.loadConfigs('main')
})
</script>

<style scoped>
.page-content {
  width: 100%;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 12px 0;
  font-family: "Vazirmatn", sans-serif;
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
}

.page-description {
  color: #94a3b8;
  font-size: 16px;
  margin: 0 0 32px 0;
  font-family: "Vazirmatn", sans-serif;
  font-weight: 500;
}
</style>

