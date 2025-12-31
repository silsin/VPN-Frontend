<template>
  <div class="settings-tabs">
    <!-- تب‌ها -->
    <div class="tabs-header">
      <div class="tabs-list">
        <button
          v-for="category in categories"
          :key="category.id"
          class="tab-button"
          :class="{ active: activeTab === category.id }"
          @click="setActiveTab(category.id)"
        >
          <span class="tab-icon">{{ category.icon }}</span>
          <span class="tab-label">{{ category.name }}</span>
        </button>
      </div>
      <div class="tab-actions">
        <button class="action-btn export-btn" @click="$emit('export-settings')" title="خروجی تنظیمات">
          📤
        </button>
        <button class="action-btn import-btn" @click="$emit('import-settings')" title="ورودی تنظیمات">
          📥
        </button>
        <button class="action-btn reset-btn" @click="$emit('reset-settings')" title="بازنشانی به پیش‌فرض">
          🔄
        </button>
      </div>
    </div>

    <!-- محتوای تب -->
    <div class="tab-content">
      <div class="tab-header">
        <h3 class="tab-title">
          <span class="tab-title-icon">{{ activeCategory.icon }}</span>
          {{ activeCategory.name }}
        </h3>
        <p class="tab-description">{{ activeCategory.description }}</p>
      </div>

      <div class="settings-section">
        <slot :category="activeTab" :settings="getCategorySettings(activeTab)"></slot>
      </div>

      <div class="tab-footer">
        <button
          class="save-category-btn"
          @click="$emit('save-category', activeTab)"
          :disabled="!hasUnsavedChanges"
        >
          💾 ذخیره تغییرات
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppSettingsStore } from '../stores/appSettings'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  initialTab: {
    type: String,
    default: 'general'
  }
})

const emit = defineEmits(['export-settings', 'import-settings', 'reset-settings', 'save-category'])

const settingsStore = useAppSettingsStore()
const activeTab = ref(props.initialTab)

const activeCategory = computed(() => {
  return props.categories.find(cat => cat.id === activeTab.value) || props.categories[0]
})

const hasUnsavedChanges = computed(() => settingsStore.hasUnsavedChanges)

const setActiveTab = (tabId) => {
  activeTab.value = tabId
}

const getCategorySettings = (categoryId) => {
  return settingsStore.getCategorySettings(categoryId)
}

// تنظیم تب فعال در ابتدا
watch(() => props.initialTab, (newTab) => {
  activeTab.value = newTab
}, { immediate: true })
</script>

<style scoped>
.settings-tabs {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.tabs-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tabs-list {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tabs-list::-webkit-scrollbar {
  display: none;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-family: "Vazirmatn", sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.tab-button.active {
  color: white;
  background: rgba(255, 255, 255, 0.15);
  border-bottom-color: white;
}

.tab-icon {
  font-size: 16px;
}

.tab-actions {
  display: flex;
  gap: 8px;
  padding: 0 16px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.tab-content {
  padding: 24px;
}

.tab-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.tab-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
  font-family: "Vazirmatn", sans-serif;
}

.tab-title-icon {
  font-size: 24px;
}

.tab-description {
  margin: 0;
  color: #718096;
  font-size: 14px;
  font-family: "Vazirmatn", sans-serif;
  line-height: 1.5;
}

.settings-section {
  min-height: 300px;
}

.tab-footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
  display: flex;
  justify-content: center;
}

.save-category-btn {
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
  font-size: 14px;
}

.save-category-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.save-category-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 1024px) {
  .tabs-header {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .tab-actions {
    padding: 0;
  }

  .tabs-list {
    width: 100%;
    justify-content: flex-start; /* Prevent clipping on small screens */
    padding-bottom: 4px; /* Space for scrollbar if visible */
  }
}

@media (max-width: 768px) {
  .tab-content {
    padding: 20px;
  }

  .tab-title {
    font-size: 18px;
  }

  .tab-description {
    font-size: 13px;
  }

  .tab-button {
    padding: 12px 16px;
    font-size: 13px;
  }

  .tab-icon {
    font-size: 14px;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}
</style>
