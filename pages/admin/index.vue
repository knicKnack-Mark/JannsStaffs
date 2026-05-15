<template>
  <div>
    <!-- ANALYTICS -->
    <section class="mb-4">
      <div class="row g-4">
        <div
          v-for="item in analytics"
          :key="item.title"
          class="col-xl-3 col-md-6"
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
    <section class="mb-4">
      <div class="row g-4">
        <!-- ATTENDANCE -->
        <div class="col-xl-8">
          <AdminAttendanceChart
            :attendance-chart="attendanceChart"
          />
        </div>

        <!-- QUICK STATS -->
        <div class="col-xl-4">
          <AdminQuickStats />
        </div>
      </div>
    </section>

    <!-- ACTIVITIES + NOTIFICATIONS -->
    <section class="mb-4">
      <div class="row g-4">
        <!-- ACTIVITIES -->
        <div class="col-xl-7">
          <AdminActivityFeed
            :activities="activities"
          />
        </div>

        <!-- NOTIFICATIONS -->
        <div class="col-xl-5">
          <AdminNotificationsPanel
            :notifications="notifications"
          />
        </div>
      </div>
    </section>

    <!-- DEPARTMENT + EXTRA -->
    <section class="mb-4">
      <div class="row g-4">
        <div class="col-xl-6">
          <AdminDepartmentOverview />
        </div>

        <div class="col-xl-6">
          <AdminQuickStats />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const {
  analytics,
  attendanceChart,
  activities,
  notifications
} = useDashboard()
</script>