<template>
  <div class="dashboard-sections">
    <section class="dashboard-section">
      <h2>مدیریت کاربران</h2>
      <div class="section-content">
        <p>در این بخش می‌توانید کاربران VPN را مدیریت کنید.</p>
        <button class="action-button">مشاهده کاربران</button>
      </div>
    </section>

    <section class="dashboard-section">
      <h2>مدیریت سرورها</h2>
      <div class="section-content">
        <p>تنظیمات و مدیریت سرورهای VPN را انجام دهید.</p>
        <button class="action-button">مشاهده سرورها</button>
      </div>
    </section>

    <section class="dashboard-section">
      <h2>گزارشات و آمار</h2>
      <div class="section-content">
        <p>مشاهده گزارشات و آمار استفاده از VPN.</p>
        <button class="action-button">مشاهده گزارشات</button>
      </div>
    </section>

    <section class="dashboard-section">
      <h2>تنظیمات</h2>
      <div class="section-content">
        <p>تنظیمات کلی سیستم و پیکربندی VPN.</p>
        <button class="action-button">تنظیمات</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.dashboard-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dashboard-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.dashboard-section h2 {
  color: #2d3748;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 20px 0;
  font-family: "Vazirmatn", sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-content p {
  color: #4a5568;
  font-size: 15px;
  line-height: 1.8;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
}

.action-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  font-family: "Vazirmatn", sans-serif;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.action-button:active {
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .dashboard-sections {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-sections {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .dashboard-section {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .dashboard-sections {
    gap: 10px;
  }

  .dashboard-section {
    padding: 16px;
  }

  .dashboard-section h2 {
    font-size: 16px;
  }

  .section-content p {
    font-size: 13px;
  }

  .action-button {
    width: 100%;
    padding: 10px 16px;
  }
}

@media (max-width: 360px) {
  .dashboard-section {
    padding: 14px;
  }

  .dashboard-section h2 {
    font-size: 15px;
  }
}
</style>

