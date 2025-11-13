<template>
  <DashboardLayout>
    <div class="dashboard-content">
      <StatsCards :stats="stats" />
      <DashboardSections />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import DashboardLayout from "../components/DashboardLayout.vue";
import StatsCards from "../components/StatsCards.vue";
import DashboardSections from "../components/DashboardSections.vue";

const router = useRouter();
const authStore = useAuthStore();

const stats = ref({
  activeUsers: 1250,
  servers: 15,
  todayTraffic: "2.5 TB",
  activeConnections: 342,
});

onMounted(() => {
  authStore.checkAuth();
  if (!authStore.isAuthenticated.value) {
    router.push("/login");
  }
});
</script>

<style scoped>
.dashboard-content {
  width: 100%;
}
</style>
