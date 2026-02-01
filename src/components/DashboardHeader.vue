<template>
  <header class="dashboard-header">
    <div class="header-content">
      <div class="header-left">
        <button class="hamburger-button" @click="$emit('toggle-sidebar')">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1>پنل مدیریت VPN</h1>
      </div>
      <div class="user-info">
        <span>خوش آمدید، {{ username || "کاربر" }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  username: {
    type: String,
    default: "",
  },
});

defineEmits(['toggle-sidebar']);
</script>

<style scoped>
.dashboard-header {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 40px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.hamburger-button {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.hamburger-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.hamburger-button span {
  width: 20px;
  height: 2px;
  background: #ffffff;
  border-radius: 2px;
}

.dashboard-header h1 {
  font-size: 22px;
  font-weight: 800;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(129, 140, 248, 0.1);
  padding: 8px 20px;
  border-radius: 14px;
  border: 1px solid rgba(129, 140, 248, 0.2);
  transition: all 0.3s ease;
}

.user-info:hover {
  background: rgba(129, 140, 248, 0.15);
  border-color: rgba(129, 140, 248, 0.3);
}

.user-info span {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  font-family: "Vazirmatn", sans-serif;
}

@media (max-width: 768px) {
  .dashboard-header { padding: 12px 20px; }
  .dashboard-header h1 { font-size: 18px; }
}

@media (max-width: 480px) {
  .user-info span { display: none; }
  .user-info::before { content: '👤'; font-size: 18px; }
}
</style>

