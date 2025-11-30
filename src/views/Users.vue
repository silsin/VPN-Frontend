<template>
  <DashboardLayout>
    <div class="page-content">
      <h1 class="page-title">مدیریت کاربران</h1>
      <p class="page-description">در این بخش می‌توانید لیست دستگاه‌های متصل شده را مشاهده کنید.</p>
      
      <div class="content-card">
        <div class="card-header">
          <h2>لیست دستگاه‌ها</h2>
          <button @click="fetchData" class="refresh-btn" :disabled="loading">
            <span v-if="loading">در حال بارگذاری...</span>
            <span v-else>بروزرسانی</span>
          </button>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>نام دستگاه</th>
                <th>پلتفرم</th>
                <th>شناسه دستگاه</th>
                <th>شناسه پوش (Push ID)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading && deviceLogins.length === 0">
                <td colspan="4" class="text-center">در حال دریافت اطلاعات...</td>
              </tr>
              <tr v-else-if="deviceLogins.length === 0">
                <td colspan="4" class="text-center">هیچ دستگاهی یافت نشد.</td>
              </tr>
              <tr v-for="device in deviceLogins" :key="device.deviceId">
                <td>{{ device.deviceName }}</td>
                <td>
                  <span :class="['platform-badge', device.platform]">
                    {{ device.platform }}
                  </span>
                </td>
                <td class="monospace">{{ device.deviceId }}</td>
                <td class="monospace" :title="device.pushId">{{ truncate(device.pushId) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useUsersStore } from '../stores/users';
import DashboardLayout from "../components/DashboardLayout.vue";

const usersStore = useUsersStore();

const deviceLogins = computed(() => usersStore.deviceLogins);
const loading = computed(() => usersStore.loading);
const error = computed(() => usersStore.error);

const fetchData = () => {
  usersStore.fetchDeviceLogins();
};

const truncate = (str) => {
  if (!str) return '-';
  return str.length > 20 ? str.substring(0, 20) + '...' : str;
};

onMounted(() => {
  fetchData();
});
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.content-card h2 {
  color: #2d3748;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
}

.refresh-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Vazirmatn", sans-serif;
  transition: background 0.3s;
}

.refresh-btn:hover:not(:disabled) {
  background: #5a67d8;
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background-color: #fed7d7;
  color: #c53030;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-family: "Vazirmatn", sans-serif;
}

.table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Vazirmatn", sans-serif;
}

.users-table th,
.users-table td {
  padding: 16px;
  text-align: right;
  border-bottom: 1px solid #e2e8f0;
}

.users-table th {
  font-weight: 600;
  color: #4a5568;
  background-color: #f7fafc;
}

.users-table tr:last-child td {
  border-bottom: none;
}

.users-table tr:hover {
  background-color: #f7fafc;
}

.monospace {
  font-family: monospace;
  direction: ltr;
  text-align: left;
}

.text-center {
  text-align: center;
}

.platform-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.platform-badge.android {
  background-color: #c6f6d5;
  color: #22543d;
}

.platform-badge.ios {
  background-color: #bee3f8;
  color: #2c5282;
}
</style>


