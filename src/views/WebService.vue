<template>
  <DashboardLayout>
    <div class="page-content">
      <h1 class="page-title">وب سرویس</h1>
      <p class="page-description">مدیریت و تنظیمات وب سرویس‌های VPN.</p>
      
      <div class="content-card">
        <h2>مدیریت وب سرویس</h2>
        <p>محتوای مدیریت وب سرویس در اینجا نمایش داده می‌شود.</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from "../components/DashboardLayout.vue";
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

