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
  background: rgba(15, 23, 42, 0.7); /* Translucent dark slate */
  backdrop-filter: blur(25px) saturate(180%);
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  visibility: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
}

.sidebar-open {
  transform: translateX(0);
  visibility: visible;
}

.sidebar-header {
  padding: 32px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sidebar-header h2 {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
  letter-spacing: -0.5px;
}

.sidebar-close {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 20px;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  line-height: 1;
  transition: all 0.3s ease;
}

.sidebar-close:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: rotate(90deg);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 24px;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  margin-bottom: 8px;
  border-radius: 14px;
  font-family: "Vazirmatn", sans-serif;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateX(-5px);
}

.sidebar-item-active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
  border: 1px solid rgba(129, 140, 248, 0.3);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.sidebar-item-active::before {
  content: '';
  position: absolute;
  right: 0;
  top: 20%;
  height: 60%;
  width: 4px;
  background: #818cf8;
  border-radius: 4px 0 0 4px;
  box-shadow: -2px 0 10px rgba(129, 140, 248, 0.8);
}

.sidebar-item-icon {
  font-size: 20px;
  margin-left: 14px;
  transition: transform 0.3s ease;
}

.sidebar-item-active .sidebar-item-icon {
  transform: scale(1.1);
}

.sidebar-item-text {
  font-size: 15px;
  letter-spacing: 0.2px;
}

.logout-item {
  margin-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 20px;
  color: #fb7185 !important;
}

.logout-item:hover {
  background: rgba(251, 113, 133, 0.1) !important;
  border-color: rgba(251, 113, 133, 0.2) !important;
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

