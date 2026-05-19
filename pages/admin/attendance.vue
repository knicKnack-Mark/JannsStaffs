<template>
  <div class="attendance-page">
    <!-- SUMMARY CARDS -->
    <section class="mb-4">
      <div class="row g-4">
        <div
          v-for="card in summaryCards"
          :key="card.title"
          class="col-12 col-sm-6 col-xl-3"
        >
          <AdminAnalyticsCard
            :title="card.title"
            :value="card.value"
            :icon="card.icon"
            :description="card.description"
            :color="card.color"
          />
        </div>
      </div>
    </section>

    <AdminPageToolbar
      title="Daily Attendance"
      subtitle="Monitor staff time-in, time-out, absences, and rendered hours."
    >
      <template #actions>
        <button
          class="btn toolbar-btn toolbar-btn-light"
          type="button"
        >
          <Icon
            name="solar:printer-bold-duotone"
            size="20"
          />

          <span>Print Attendance</span>
        </button>

        <button
          class="btn toolbar-btn toolbar-btn-primary"
          type="button"
        >
          <Icon
            name="solar:file-download-bold-duotone"
            size="20"
          />

          <span>Export Report</span>
        </button>
      </template>
    </AdminPageToolbar>

    <AdminAttendanceFilters
      v-model:selected-date="selectedDate"
      v-model:search="search"
      v-model:selected-status="selectedStatus"
    />

    <AdminAttendanceTable
      :attendance="filteredAttendance"
      :formatted-date="formattedSelectedDate"
      :get-initials="getInitials"
      :get-rendered-hours="getRenderedHours"
      :is-time-in-disabled="isTimeInDisabled"
      :is-time-out-disabled="isTimeOutDisabled"
      :is-absent-disabled="isAbsentDisabled"
      @time-in="timeIn"
      @time-out="timeOut"
      @mark-absent="markAbsent"
      @toggle-status="toggleStatus"
    />

    <AdminAttendanceLogs
      :logs="attendanceLogs"
    />
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Attendance',
  subtitle: 'Monitor staff time-in, time-out, absences, and rendered hours'
})

const {
  selectedDate,
  search,
  selectedStatus,
  attendanceLogs,
  filteredAttendance,
  summaryCards,
  formattedSelectedDate,
  getInitials,
  getRenderedHours,
  timeIn,
  timeOut,
  markAbsent,
  toggleStatus,
  isTimeInDisabled,
  isTimeOutDisabled,
  isAbsentDisabled
} = useAttendance()
</script>

<style scoped>
.attendance-page {
  padding-bottom: 24px;
}
</style>