<template>
  <div class="admin-dashboard-page">
    <AdminResortLoader :show="loading" />

    <div v-if="!loading">
      <!-- ANALYTICS -->
      <section class="mb-4 dashboard-section fade-slide-up delay-1">
        <div class="row g-4">
          <div
            v-for="(item, index) in analytics"
            :key="item.title"
            class="col-xl-3 col-md-6 fade-slide-up"
            :style="{ animationDelay: `${0.08 + index * 0.08}s` }"
          >
            <AdminAnalyticsCard
              :title="item.title"
              :value="item.value"
              :icon="item.icon"
              :description="item.description"
              :color="item.color"
            />
          </div>
        </div>
      </section>

      <!-- ATTENDANCE + QUICK STATS -->
      <section class="mb-4 dashboard-section">
        <div class="row g-4">
          <!-- ATTENDANCE -->
          <div class="col-xl-8 fade-slide-up delay-5">
            <AdminAttendanceChart
              :attendance-chart="attendanceChart"
            />
          </div>

          <!-- QUICK STATS -->
          <div class="col-xl-4 fade-slide-up delay-6">
            <AdminQuickStats :stats="quickStats" />
          </div>
        </div>
      </section>

      <!-- ACTIVITIES + NOTIFICATIONS -->
      <section class="mb-4 dashboard-section">
        <div class="row g-4">
          <!-- ACTIVITIES -->
          <div class="col-xl-7 fade-slide-up delay-7">
            <AdminActivityFeed
              :activities="activities"
            />
          </div>

          <!-- NOTIFICATIONS -->
          <div class="col-xl-5 fade-slide-up delay-8">
            <AdminNotificationsPanel
              :notifications="notifications"
            />
          </div>
        </div>
      </section>

      <!-- DEPARTMENT + EXTRA -->
      <section class="mb-4 dashboard-section">
        <div class="row g-4">
          <div class="col-xl-6 fade-slide-up delay-9">
            <AdminDepartmentOverview :departments="departments" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const {
  loading,
  analytics,
  attendanceChart,
  quickStats,
  activities,
  notifications,
  departments,
  fetchDashboard
} = useDashboard()

onMounted(() => {
  fetchDashboard()
})

onActivated(() => {
  fetchDashboard()
})

watch(
  () => useRoute().fullPath,
  () => {
    fetchDashboard()
  }
)
</script>

<style scoped>
.admin-dashboard-page {
  animation: pageFadeIn 0.35s ease both;
}

.fade-slide-up {
  opacity: 0;
  transform: translateY(22px);
  animation: fadeSlideUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  will-change: opacity, transform;
}

.delay-1 {
  animation-delay: 0.05s;
}

.delay-2 {
  animation-delay: 0.12s;
}

.delay-3 {
  animation-delay: 0.19s;
}

.delay-4 {
  animation-delay: 0.26s;
}

.delay-5 {
  animation-delay: 0.38s;
}

.delay-6 {
  animation-delay: 0.48s;
}

.delay-7 {
  animation-delay: 0.58s;
}

.delay-8 {
  animation-delay: 0.68s;
}

.delay-9 {
  animation-delay: 0.78s;
}

.delay-10 {
  animation-delay: 0.88s;
}

@keyframes fadeSlideUp {
  0% {
    opacity: 0;
    transform: translateY(22px) scale(0.985);
  }

  60% {
    opacity: 1;
    transform: translateY(-2px) scale(1);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pageFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

:deep(.card) {
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

:deep(.card:hover) {
  transform: translateY(-3px);
}

@media (prefers-reduced-motion: reduce) {
  .admin-dashboard-page,
  .fade-slide-up {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  :deep(.card),
  :deep(.card:hover) {
    transition: none !important;
    transform: none !important;
  }
}
</style>