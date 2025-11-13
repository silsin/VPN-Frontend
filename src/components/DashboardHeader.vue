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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hamburger-button {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.hamburger-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.hamburger-button span {
  width: 22px;
  height: 3px;
  background: #ffffff;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.dashboard-header h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #2d3748;
  font-family: "Vazirmatn", sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(102, 126, 234, 0.1);
  padding: 10px 20px;
  border-radius: 25px;
}

.user-info span {
  color: #4a5568;
  font-size: 14px;
  font-weight: 500;
  font-family: "Vazirmatn", sans-serif;
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 16px 20px;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 12px 16px;
  }

  .dashboard-header h1 {
    font-size: 18px;
  }

  .header-left {
    gap: 12px;
  }
}

@media (max-width: 360px) {
  .dashboard-header {
    padding: 10px 12px;
  }

  .dashboard-header h1 {
    font-size: 16px;
  }

  .user-info span {
    font-size: 12px;
  }
}
</style>

