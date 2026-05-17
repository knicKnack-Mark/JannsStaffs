<template>
  <div class="staff-card">
    <!-- TOP STATUS -->
    <div class="staff-card-top">
      <span
        class="status-badge"
        :class="staff.status === 'Active' ? 'active' : 'inactive'"
      >
        {{ staff.status }}
      </span>

      <button
        class="card-menu-btn"
        type="button"
        title="Edit staff"
        @click="editStaff"
      >
        <Icon
          name="solar:menu-dots-bold"
          size="20"
        />
      </button>
    </div>

    <!-- STAFF PHOTO -->
    <div class="staff-photo-wrapper">
      <img
        :src="staff.avatar"
        :alt="staff.name"
        class="staff-photo"
      />
    </div>

    <!-- BASIC INFO -->
    <div class="text-center mt-3">
      <h5 class="staff-name mb-1">
        {{ staff.name }}
      </h5>

      <p class="staff-position mb-3">
        {{ staff.position }}
      </p>

      <span
        class="attendance-badge"
        :class="attendanceClass"
      >
        {{ staff.attendance }}
      </span>
    </div>

    <!-- DETAILS -->
    <div class="staff-details mt-4">
      <div class="detail-item">
        <div class="detail-icon">
          <Icon
            name="solar:phone-bold-duotone"
            size="18"
          />
        </div>

        <div>
          <small>Phone</small>

          <p>
            {{ staff.phone }}
          </p>
        </div>
      </div>

      <div class="detail-item">
        <div class="detail-icon salary">
          <Icon
            name="solar:wallet-money-bold-duotone"
            size="18"
          />
        </div>

        <div>
          <small>
            {{ staff.salaryType === 'Monthly' ? 'Monthly Salary' : 'Daily Rate' }}
          </small>

          <p>
            ₱{{ displayedSalary.toLocaleString() }}
          </p>
        </div>
      </div>

      <div class="detail-item">
        <div class="detail-icon type">
          <Icon
            name="solar:calendar-bold-duotone"
            size="18"
          />
        </div>

        <div>
          <small>Salary Type</small>

          <p>
            {{ staff.salaryType }}
          </p>
        </div>
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="staff-actions mt-4">
      <button
        class="staff-action-btn time-in"
        type="button"
        title="Time In"
        :disabled="disableTimeIn"
        @click="$emit('time-in', staff)"
      >
        <Icon
          name="solar:login-3-bold-duotone"
          size="18"
        />

        <span>In</span>
      </button>

      <button
        class="staff-action-btn absent"
        type="button"
        title="Mark Absent"
        :disabled="disableAbsent"
        @click="$emit('mark-absent', staff)"
      >
        <Icon
          name="solar:user-block-bold-duotone"
          size="18"
        />

        <span>Absent</span>
      </button>

      <button
        class="staff-action-btn status"
        type="button"
        :title="staff.status === 'Active' ? 'Set as Inactive' : 'Set as Active'"
        @click="$emit('toggle-status', staff)"
      >
        <Icon
          :name="staff.status === 'Active'
            ? 'solar:pause-circle-bold-duotone'
            : 'solar:play-circle-bold-duotone'"
          size="18"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  staff: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'time-in',
  'mark-absent',
  'toggle-status',
  'edit-staff'
])

const editStaff = () => {
  emit('edit-staff', props.staff)
}

const displayedSalary = computed(() => {
  if (props.staff.salaryType === 'Monthly') {
    return props.staff.monthlySalary || 0
  }

  return props.staff.dailyRate || 0
})

const attendanceClass = computed(() => {
  if (props.staff.attendance === 'Present') return 'present'
  if (props.staff.attendance === 'Absent') return 'absent'
  return 'pending'
})

const disableTimeIn = computed(() => {
  return props.staff.status === 'Inactive' ||
    props.staff.attendance === 'Present' ||
    props.staff.attendance === 'Absent'
})

const disableAbsent = computed(() => {
  return props.staff.status === 'Inactive' ||
    props.staff.attendance === 'Present' ||
    props.staff.attendance === 'Absent'
})
</script>

<style scoped>
.staff-card {
  height: 100%;

  background: white;

  border-radius: 30px;

  padding: 22px;

  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.staff-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

/* TOP */
.staff-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-menu-btn {
  width: 38px;
  height: 38px;

  border: none;

  border-radius: 14px;

  background: #f4f8f7;
  color: #64748b;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.card-menu-btn:hover {
  background: #e0f5f2;
  color: #148b80;
  transform: translateY(-2px);
}

/* PHOTO */
.staff-photo-wrapper {
  width: 118px;
  height: 118px;

  margin: 10px auto 0;

  border-radius: 34px;

  padding: 6px;

  background: linear-gradient(180deg, #e0f5f2, #ffffff);
}

.staff-photo {
  width: 100%;
  height: 100%;

  border-radius: 28px;

  object-fit: cover;
}

/* BASIC INFO */
.staff-name {
  color: #111827;

  font-weight: 800;
}

.staff-position {
  color: #718096;

  font-weight: 500;
}

/* DETAILS */
.staff-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  background: #f8fbfa;

  border-radius: 18px;

  padding: 13px;

  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-icon {
  width: 38px;
  height: 38px;

  border-radius: 14px;

  background: #e0f5f2;
  color: #148b80;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
}

.detail-icon.salary {
  background: #e5efff;
  color: #2563eb;
}

.detail-icon.type {
  background: #fff7ed;
  color: #ea580c;
}

.detail-item small {
  display: block;

  color: #718096;

  font-size: 0.75rem;

  margin-bottom: 2px;
}

.detail-item p {
  margin: 0;

  color: #111827;

  font-weight: 700;
}

/* BADGES */
.status-badge,
.attendance-badge {
  padding: 8px 12px;

  border-radius: 999px;

  font-size: 0.78rem;
  font-weight: 800;

  display: inline-flex;
  align-items: center;
}

.status-badge.active {
  background: #e0f5f2;
  color: #148b80;
}

.status-badge.inactive {
  background: #f1f5f9;
  color: #64748b;
}

.attendance-badge.present {
  background: #dcfce7;
  color: #16a34a;
}

.attendance-badge.absent {
  background: #ffe6e6;
  color: #dc2626;
}

.attendance-badge.pending {
  background: #fff7ed;
  color: #ea580c;
}

/* ACTIONS */
.staff-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 42px;
  gap: 8px;
}

.staff-action-btn {
  height: 42px;

  border: none;

  border-radius: 15px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  font-size: 0.82rem;
  font-weight: 800;

  transition: all 0.2s ease;
}

.staff-action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.staff-action-btn:not(:disabled):hover {
  transform: translateY(-2px);
}

.staff-action-btn.time-in {
  background: #e5efff;
  color: #2563eb;
}

.staff-action-btn.absent {
  background: #ffe6e6;
  color: #dc2626;
}

.staff-action-btn.status {
  background: #fff7ed;
  color: #ea580c;
}

/* RESPONSIVE */
@media (max-width: 767px) {
  .staff-actions {
    grid-template-columns: 1fr;
  }

  .staff-action-btn.status {
    width: 100%;
  }
}
</style>