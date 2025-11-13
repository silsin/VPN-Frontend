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
    WebService: "web-service",
    EditAccount: "edit-account",
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
  { id: "web-service", label: "وب سرویس", icon: "🌐", route: "WebService" },
  { id: "edit-account", label: "ویرایش حساب", icon: "✏️", route: "EditAccount" },
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

  if (window.innerWidth <= 768) {
    isSidebarOpen.value = false;
  }
};

const handleResize = () => {
  if (window.innerWidth > 768) {
    isSidebarOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  position: relative;
}

.main-wrapper {
  flex: 1;
  width: 100%;
  transition: margin-right 0.3s ease;
}

.dashboard-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
}

@media (max-width: 1024px) {
  .dashboard-main {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .dashboard-main {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .dashboard-main {
    padding: 16px;
  }
}

@media (max-width: 360px) {
  .dashboard-main {
    padding: 12px;
  }
}
</style>

