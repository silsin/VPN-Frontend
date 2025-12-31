<template>
  <div>
    <!-- Sidebar Overlay -->
    <div
      class="sidebar-overlay"
      :class="{ active: isOpen }"
      @click="$emit('close')"
    ></div>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-open': isOpen }">
      <div class="sidebar-header">
        <h2>منو</h2>
        <button class="sidebar-close" @click="$emit('close')">×</button>
      </div>
      <nav class="sidebar-nav">
        <a
          v-for="item in menuItems"
          :key="item.id"
          href="#"
          class="sidebar-item"
          :class="{
            'sidebar-item-active': activeMenu === item.id,
            'logout-item': item.isLogout,
          }"
          :data-logout="item.isLogout ? 'true' : 'false'"
          @click.prevent="$emit('menu-click', item)"
        >
          <span class="sidebar-item-icon">{{ item.icon }}</span>
          <span class="sidebar-item-text">{{ item.label }}</span>
        </a>
      </nav>
    </aside>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  activeMenu: {
    type: String,
    default: 'dashboard',
  },
  menuItems: {
    type: Array,
    required: true,
  },
});

defineEmits(['close', 'menu-click']);
</script>

<style scoped>
/* Sidebar Overlay */
.sidebar-overlay {
  display: block;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  backdrop-filter: blur(4px);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.sidebar-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #1e1e2e 0%, #2d2d44 100%);
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  visibility: hidden; /* Hide from interactions when closed */
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
}

.sidebar-open {
  transform: translateX(0);
  visibility: visible;
}


.sidebar-header {
  padding: 24px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
}

.sidebar-close {
  display: block;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  font-size: 24px;
  color: #ffffff;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  line-height: 1;
  opacity: 0.9;
  transition: all 0.2s ease;
}

.sidebar-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border-right: 4px solid transparent;
  margin: 4px 12px;
  border-radius: 12px;
  font-family: "Vazirmatn", sans-serif;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-4px);
  color: #ffffff;
}

.sidebar-item-active {
  background: linear-gradient(
    90deg,
    rgba(102, 126, 234, 0.3) 0%,
    rgba(118, 75, 162, 0.3) 100%
  );
  border-right-color: #667eea;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.sidebar-item-icon {
  font-size: 22px;
  margin-left: 16px;
  width: 28px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-item-text {
  font-size: 15px;
  font-weight: 500;
}

/* Logout item styling */
.sidebar-item[data-logout="true"],
.sidebar-item.logout-item {
  color: #ff6b6b;
  margin-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  background: rgba(255, 107, 107, 0.1);
}

.sidebar-item[data-logout="true"]:hover,
.sidebar-item.logout-item:hover {
  background: rgba(255, 107, 107, 0.2);
  color: #ff5252;
}

.sidebar-item[data-logout="true"] .sidebar-item-icon,
.sidebar-item.logout-item .sidebar-item-icon {
  color: #ff6b6b;
}

/* Mobile */
@media (max-width: 768px) {
  .sidebar {
    width: 75%;
    max-width: 320px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 80%;
    max-width: 320px;
  }
}

@media (max-width: 360px) {
  .sidebar {
    width: 100%;
  }
}
</style>

