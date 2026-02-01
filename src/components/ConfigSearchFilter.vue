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
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(129, 140, 248, 0.3);
}

.stat-icon {
  font-size: 36px;
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

.search-filter-row {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
  background: rgba(15, 23, 42, 0.3);
  padding: 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 16px 52px 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  font-size: 16px;
  font-family: "Vazirmatn", sans-serif;
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: #818cf8;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.1);
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #64748b;
}

.filter-buttons {
  display: flex;
  gap: 10px;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 14px 24px;
  border-radius: 16px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.filter-btn.active {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.search-results {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 14px 20px;
  background: rgba(129, 140, 248, 0.1);
  border-radius: 14px;
  border: 1px solid rgba(129, 140, 248, 0.2);
}

.results-text {
  color: #e2e8f0;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
}

.clear-filters-btn {
  background: none;
  border: none;
  color: #818cf8;
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
