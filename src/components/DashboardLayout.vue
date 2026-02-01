<template>
  <div class="dashboard-container">
    <Sidebar
      :is-open="isSidebarOpen"
      :active-menu="activeMenu"
      :menu-items="menuItems"
      @close="toggleSidebar"
      @menu-click="handleMenuClick"
    />

    <div class="main-wrapper">
      <DashboardHeader
        :username="authStore.user?.username"
        @toggle-sidebar="toggleSidebar"
      />

      <main class="dashboard-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Sidebar from "./Sidebar.vue";
import DashboardHeader from "./DashboardHeader.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isSidebarOpen = ref(false);

const activeMenu = computed(() => {
  const routeName = route.name;
  if (!routeName) return "dashboard";
  
  // تبدیل route name به menu id
  const routeToMenuId = {
    Dashboard: "dashboard",
    Users: "users",
    MainConfig: "main-config",
    SplashConfig: "splash-config",
    Ads: "ads",
    Dialog: "dialog",
    Update: "update",
    AppSettings: "app-settings",
    HelpLink: "help-link",
    FreeConfigs: "free-configs",
  };
  
  return routeToMenuId[routeName] || "dashboard";
});

const menuItems = [
  { id: "dashboard", label: "داشبورد", icon: "📊", route: "Dashboard" },
  { id: "users", label: "کاربران", icon: "👥", route: "Users" },
  { id: "main-config", label: "کانفیگ اصلی", icon: "⚙️", route: "MainConfig" },
  { id: "splash-config", label: "کانفیگ اسپلش", icon: "🖼️", route: "SplashConfig" },
  { id: "ads", label: "تبلیغات", icon: "📢", route: "Ads" },
  { id: "dialog", label: "دیالوگ", icon: "💬", route: "Dialog" },
  { id: "update", label: "آپدیت", icon: "🔄", route: "Update" },
  { id: "app-settings", label: "تنظیمات برنامه", icon: "🔧", route: "AppSettings" },
  { id: "help-link", label: "لینک کمکی", icon: "🔗", route: "HelpLink" },
  { id: "free-configs", label: "کانفیگ‌های رایگان", icon: "🔓", route: "FreeConfigs" },
  {
    id: "logout",
    label: "خروج از حساب",
    icon: "🚪",
    route: null,
    isLogout: true,
  },
];

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleMenuClick = (item) => {
  if (item.isLogout) {
    authStore.logout();
    router.push("/login");
  } else if (item.route) {
    router.push({ name: item.route });
  }

  // Always close sidebar after selection since it is an overlay
  isSidebarOpen.value = false;
};

</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  min-height: 100dvh;
  background: #0f172a; /* Deep slate background */
  background-image: 
    radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0, transparent 50%), 
    radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.15) 0, transparent 50%), 
    radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.1) 0, transparent 50%), 
    radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.1) 0, transparent 50%);
  display: flex;
  position: relative;
  overflow-x: hidden;
  color: #f1f5f9;
}

.main-wrapper {
  flex: 1;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.dashboard-main {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 40px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1024px) {
  .dashboard-main { padding: 24px; }
}

@media (max-width: 768px) {
  .dashboard-main { padding: 20px; }
}

@media (max-width: 480px) {
  .dashboard-container { display: flex; flex-direction: column; }
  .dashboard-main { padding: 16px; }
}

@media (max-width: 360px) {
  .dashboard-main {
    padding: 12px;
  }
}
</style>

