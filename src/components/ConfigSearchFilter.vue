<template>
  <div class="search-filter-container">
    <!-- آمار سریع -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-label">کل کانفیگ‌ها</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔗</div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.links }}</div>
          <div class="stat-label">لینک V2Ray</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📄</div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.jsons }}</div>
          <div class="stat-label">کانفیگ JSON</div>
        </div>
      </div>
    </div>

    <!-- جستجو و فیلتر -->
    <div class="search-filter-row">
      <div class="search-box">
        <input
          type="text"
          v-model="localSearchQuery"
          @input="debouncedSearch"
          placeholder="جستجو در نام کانفیگ یا محتوا..."
          class="search-input"
        />
        <div class="search-icon">🔍</div>
      </div>

      <div class="filter-buttons">
        <button
          class="filter-btn"
          :class="{ active: localFilterType === 'all' }"
          @click="setFilter('all')"
        >
          همه
        </button>
        <button
          class="filter-btn"
          :class="{ active: localFilterType === 'link' }"
          @click="setFilter('link')"
        >
          لینک V2Ray
        </button>
        <button
          class="filter-btn"
          :class="{ active: localFilterType === 'json' }"
          @click="setFilter('json')"
        >
          کانفیگ JSON
        </button>
      </div>
    </div>

    <!-- نتایج جستجو -->
    <div class="search-results" v-if="searchQuery || filterType !== 'all'">
      <span class="results-text">
        {{ filteredConfigs.length }} نتیجه یافت شد
      </span>
      <button
        v-if="searchQuery || filterType !== 'all'"
        class="clear-filters-btn"
        @click="clearFilters"
      >
        پاک کردن فیلترها
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useConfigStore } from '../stores/config'

const configStore = useConfigStore()

// استفاده از reactive references برای جلوگیری از immediate updates
const localSearchQuery = ref(configStore.searchQuery)
const localFilterType = ref(configStore.filterType)

// Computed properties از store
const searchQuery = computed(() => configStore.searchQuery)
const filterType = computed(() => configStore.filterType)
const stats = computed(() => configStore.stats)
const filteredConfigs = computed(() => configStore.filteredConfigs)

// Debounce function برای جستجو
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    configStore.setSearchQuery(localSearchQuery.value)
  }, 300)
}

// تنظیم فیلتر
const setFilter = (type) => {
  localFilterType.value = type
  configStore.setFilterType(type)
}

// پاک کردن فیلترها
const clearFilters = () => {
  localSearchQuery.value = ''
  localFilterType.value = 'all'
  configStore.setSearchQuery('')
  configStore.setFilterType('all')
}

// همگام‌سازی local state با store
watch(() => configStore.searchQuery, (newValue) => {
  localSearchQuery.value = newValue
})

watch(() => configStore.filterType, (newValue) => {
  localFilterType.value = newValue
})
</script>

<style scoped>
.search-filter-container {
  margin-bottom: 32px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 32px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  font-family: "Vazirmatn", sans-serif;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  font-family: "Vazirmatn", sans-serif;
}

.search-filter-row {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 14px 48px 14px 20px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 16px;
  font-family: "Vazirmatn", sans-serif;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #a0aec0;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(102, 126, 234, 0.2);
  color: #4a5568;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.search-results {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.results-text {
  color: #2d3748;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
}

.clear-filters-btn {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.2s ease;
}

.clear-filters-btn:hover {
  color: #5a67d8;
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .search-filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: auto;
  }

  .filter-buttons {
    justify-content: center;
  }

  .search-results {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
}
</style>
