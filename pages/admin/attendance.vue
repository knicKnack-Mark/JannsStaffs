<template>
  <div
    v-if="hasLoaded"
    class="attendance-page page-animate"
  >
    <!-- SUMMARY CARDS -->
    <section class="mb-4 fade-slide-up delay-1">
      <div class="row g-4">
        <div
          v-for="(card, index) in summaryCards"
          :key="card.title"
          class="col-12 col-sm-6 col-xl-3 fade-slide-up"
          :style="{ animationDelay: `${0.08 + index * 0.08}s` }"
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

    <!-- FILTERS WITH ACTION BUTTONS -->
    <div class="fade-slide-up delay-5">
      <AdminAttendanceFilters
        v-model:selected-date="selectedDate"
        v-model:search="search"
        v-model:selected-status="selectedStatus"
      >
        <template #actions>
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
        </template>
      </AdminAttendanceFilters>
    </div>

    <!-- TABLE -->
    <div class="fade-slide-up delay-6">
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
    </div>

    <!-- LOGS -->
    <div class="fade-slide-up delay-7">
      <AdminAttendanceLogs
        :logs="attendanceLogs"
      />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Attendance',
  subtitle: 'Manage daily staff attendance records'
})

const {
  hasLoaded,
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

/* PAGE ANIMATION */
.page-animate {
  animation: pageFadeSlide 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes pageFadeSlide {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* COMPONENT ANIMATION */
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

/* BUTTONS */
.action-btn {
  min-height: 46px;
  border-radius: 16px;
  padding: 0 18px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn:active {
  transform: scale(0.97);
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

/* COMPONENT HOVER FEEL */
:deep(.card),
:deep(.analytics-card),
:deep(.attendance-card),
:deep(.filter-card),
:deep(.table-card),
:deep(.logs-card) {
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

:deep(.card:hover),
:deep(.analytics-card:hover),
:deep(.attendance-card:hover),
:deep(.filter-card:hover),
:deep(.table-card:hover),
:deep(.logs-card:hover) {
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .action-btn {
    flex: 1;
  }
}

/* REDUCE MOTION */
@media (prefers-reduced-motion: reduce) {
  .page-animate,
  .fade-slide-up {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .action-btn,
  :deep(.card),
  :deep(.analytics-card),
  :deep(.attendance-card),
  :deep(.filter-card),
  :deep(.table-card),
  :deep(.logs-card) {
    transition: none !important;
  }

  .action-btn:hover,
  .action-btn:active,
  :deep(.card:hover),
  :deep(.analytics-card:hover),
  :deep(.attendance-card:hover),
  :deep(.filter-card:hover),
  :deep(.table-card:hover),
  :deep(.logs-card:hover) {
    transform: none !important;
  }
}
</style>