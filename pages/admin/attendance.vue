<template>
  <div class="attendance-page">
    <!-- TOP ACTIONS ONLY -->
    <section class="attendance-top-actions mb-4">
      <button
        class="btn action-btn action-btn-light"
        type="button"
        @click="printAttendance"
      >
        <Icon
          name="solar:printer-bold-duotone"
          size="20"
        />
        <span>Print</span>
      </button>

      <button
        class="btn action-btn action-btn-primary"
        type="button"
        @click="exportReport"
      >
        <Icon
          name="solar:file-download-bold-duotone"
          size="20"
        />
        <span>Export</span>
      </button>
    </section>

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

    <!-- FILTERS -->
    <AdminAttendanceFilters
      v-model:selected-date="selectedDate"
      v-model:search="search"
      v-model:selected-status="selectedStatus"
    />

    <!-- TABLE -->
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
      @update-remarks="updateRemarks"
    />

    <!-- LOGS -->
    <AdminAttendanceLogs
      :logs="attendanceLogs"
    />
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Attendance',
  subtitle: 'Manage daily staff attendance records'
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
  updateRemarks,
  isTimeInDisabled,
  isTimeOutDisabled,
  isAbsentDisabled,
  printAttendance,
  exportReport
} = useAttendance()
</script>

<style scoped>
.attendance-page {
  padding-bottom: 24px;
}

.attendance-top-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.action-btn {
  min-height: 48px;
  border-radius: 16px;
  padding: 0 18px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.action-btn-light {
  background: #ffffff;
  color: #344054;
  border: 1px solid rgba(15, 23, 42, 0.12);
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
}

.action-btn-light:hover {
  background: #f8fafc;
  color: #101828;
}

.action-btn-primary {
  background: #0f766e;
  color: #ffffff;
  border: 1px solid #0f766e;
  box-shadow: 0 8px 22px rgba(15, 118, 110, 0.22);
}

.action-btn-primary:hover {
  background: #115e59;
  border-color: #115e59;
  color: #ffffff;
}

@media (max-width: 768px) {
  .attendance-top-actions {
    width: 100%;
  }

  .attendance-top-actions .btn {
    flex: 1;
    justify-content: center;
  }
}
</style>