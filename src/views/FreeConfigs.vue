<template>
  <DashboardLayout>
    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">کانفیگ‌های رایگان</h1>
          <p class="page-description">لیست سرورهای فعال VPN Gate (به‌روزرسانی خودکار توسط سرور).</p>
        </div>
      </div>

      <div class="content-card">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>در حال بارگذاری لیست سرورها...</p>
        </div>

        <div v-else-if="configs.length === 0" class="empty-state">
          <p>هیچ سرور فعالی یافت نشد. دکمه به‌روزرسانی را امتحان کنید.</p>
        </div>

        <div v-else class="table-container">
          <table class="configs-table">
            <thead>
              <tr>
                <th>کشور</th>
                <th>آدرس IP</th>
                <th>امتیاز / پینگ</th>
                <th>پروتکل</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="config in configs" :key="config.IP">
                <td>
                  <div class="country-info">
                    <span class="flag-icon">{{ getFlag(config.CountryShort) }}</span>
                    <span>{{ config.CountryLong }}</span>
                  </div>
                </td>
                <td>{{ config.IP }}</td>
                <td>
                  <div class="stats-info">
                    <span class="score">⭐ {{ config.Score }}</span>
                    <span class="ping">📶 {{ config.Ping || 'N/A' }}ms</span>
                  </div>
                </td>
                <td>
                  <span class="protocol-badge">OpenVPN</span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button v-if="getExistingConfig(config.IP)" class="delete-btn" @click="removeFromPanel(config)" :disabled="isBusy === config.IP">
                      {{ isBusy === config.IP ? 'در حال حذف...' : 'حذف از پنل' }}
                    </button>
                    <button v-else class="import-btn" @click="importConfig(config)" :disabled="isBusy === config.IP">
                      {{ isBusy === config.IP ? 'در حال افزودن...' : 'افزودن به پنل' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import DashboardLayout from "../components/DashboardLayout.vue"
import { vpnGateService } from '../services/vpngate'
import { useConfigStore } from '../stores/config'

const configStore = useConfigStore()
const configs = ref([])
const loading = ref(true)
const isBusy = ref(null)

const loadConfigs = async () => {
  loading.value = true
  try {
    const response = await vpnGateService.getFreeConfigs()
    configs.value = response.data
    // Load existing panel configs for duplicate check
    await configStore.loadConfigs()
  } catch (error) {
    console.error('Error loading configs:', error)
  } finally {
    loading.value = false
  }
}

const getExistingConfig = (ip) => {
  if (!configStore.configs) return null
  return configStore.configs.find(c => 
    (c.name && c.name.includes(ip)) || 
    (c.content && c.content.includes(ip))
  )
}

const importConfig = async (config) => {
  if (confirm(`آیا از افزودن سرور ${config.IP} به کانفیگ‌های خود مطمئن هستید؟`)) {
    isBusy.value = config.IP
    try {
      // Create a new config entry in the panel
      await configStore.addConfig({
        name: `VPN Gate - ${config.CountryLong} (${config.IP})`,
        type: 'openvpn', // Now using the explicit openvpn type
        category: 'main',
        country: config.CountryShort.toLowerCase(),
        content: config.OpenVPN_ConfigData_Base64 // The ovpn data
      })
      alert('کانفیگ با موفقیت به پنل اضافه شد.')
    } catch (error) {
      console.error('Error importing:', error)
      alert('خطا در افزودن کانفیگ به پنل.')
    } finally {
      isBusy.value = null
    }
  }
}

const removeFromPanel = async (config) => {
  const existing = getExistingConfig(config.IP)
  if (!existing) return

  if (confirm(`آیا از حذف سرور ${config.IP} از پنل خود مطمئن هستید؟`)) {
    isBusy.value = config.IP
    try {
      await configStore.deleteConfig(existing.id)
      alert('کانفیگ با موفقیت از پنل حذف شد.')
    } catch (error) {
      console.error('Error deleting:', error)
      alert('خطا در حذف کانفیگ از پنل.')
    } finally {
      isBusy.value = null
    }
  }
}

const getFlag = (code) => {
  if (!code) return '🌐'
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

onMounted(loadConfigs)
</script>

<style scoped>
.page-content {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
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
  color: #94a3b8;
  font-size: 16px;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
  font-weight: 500;
}

.content-card {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(25px) saturate(180%);
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 32px;
  min-height: 400px;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.table-container {
  overflow-x: auto;
  border-radius: 20px;
}

.configs-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: right;
}

.configs-table th {
  padding: 20px 24px;
  color: #94a3b8;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.05);
}

.configs-table td {
  padding: 24px;
  color: #e2e8f0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  vertical-align: middle;
}

.configs-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.country-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: #ffffff;
}

.flag-icon {
  font-size: 24px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: 8px;
}

.protocol-badge {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 800;
  border: 1px solid rgba(59, 130, 246, 0.2);
  text-transform: uppercase;
}

.stats-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.score { color: #fbbf24; font-weight: 800; font-size: 15px; }
.ping { color: #4ade80; font-size: 12px; font-weight: 600; }

.import-btn {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: "Vazirmatn", sans-serif;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.import-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
  filter: brightness(1.1);
}

.delete-btn {
  background: rgba(244, 63, 94, 0.1);
  color: #fb7185;
  border: 1px solid rgba(244, 63, 94, 0.2);
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Vazirmatn", sans-serif;
}

.delete-btn:hover:not(:disabled) {
  background: #f43f5e;
  color: white;
  transform: translateY(-2px);
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #94a3b8;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(99, 102, 241, 0.1);
  border-top-color: #818cf8;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
