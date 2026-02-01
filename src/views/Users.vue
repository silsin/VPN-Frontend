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
  color: #94a3b8;
  font-size: 16px;
  margin: 0 0 32px 0;
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
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.content-card h2 {
  color: #ffffff;
  font-size: 22px;
  font-weight: 800;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: "Vazirmatn", sans-serif;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.error-message {
  background: rgba(225, 29, 72, 0.1);
  color: #fb7185;
  padding: 14px;
  border-radius: 14px;
  margin-bottom: 24px;
  border: 1px solid rgba(225, 29, 72, 0.2);
}

.table-container {
  overflow-x: auto;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.1);
}

.users-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.users-table th {
  padding: 20px 24px;
  text-align: right;
  color: #94a3b8;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.users-table td {
  padding: 20px 24px;
  text-align: right;
  color: #e2e8f0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.users-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.monospace {
  font-family: 'Courier New', monospace;
  direction: ltr;
  text-align: left;
  opacity: 0.8;
  font-size: 13px;
}

.platform-badge {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.platform-badge.android { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
.platform-badge.ios { background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); }

@media (max-width: 480px) {
  .page-title { font-size: 24px; }
  .content-card { padding: 20px; border-radius: 20px; }
  .card-header { flex-direction: column; gap: 20px; align-items: stretch; }
  .users-table th, .users-table td { padding: 16px 12px; }
}
</style>


