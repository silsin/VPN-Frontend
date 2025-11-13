<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">👥</div>
      <div class="stat-content">
        <h3>کاربران فعال</h3>
        <p class="stat-value">{{ stats.activeUsers }}</p>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">🖥️</div>
      <div class="stat-content">
        <h3>سرورها</h3>
        <p class="stat-value">{{ stats.servers }}</p>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">📊</div>
      <div class="stat-content">
        <h3>ترافیک امروز</h3>
        <p class="stat-value">{{ stats.todayTraffic }}</p>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">🔗</div>
      <div class="stat-content">
        <h3>اتصالات فعال</h3>
        <p class="stat-value">{{ stats.activeConnections }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.stat-content h3 {
  color: #718096;
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: "Vazirmatn", sans-serif;
}

.stat-value {
  color: #2d3748;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    font-size: 36px;
  }

  .stat-value {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    gap: 10px;
    margin-bottom: 24px;
  }

  .stat-card {
    padding: 16px;
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 32px;
  }

  .stat-content h3 {
    font-size: 11px;
  }

  .stat-value {
    font-size: 22px;
  }
}

@media (max-width: 360px) {
  .stat-card {
    padding: 14px;
  }

  .stat-icon {
    width: 44px;
    height: 44px;
    font-size: 28px;
  }

  .stat-value {
    font-size: 20px;
  }
}
</style>

