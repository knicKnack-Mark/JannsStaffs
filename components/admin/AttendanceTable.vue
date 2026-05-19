<template>
  <section class="attendance-table-card">
    <div class="table-header">
      <div>
        <h5 class="fw-bold mb-1">
          Staff Attendance List
        </h5>

        <p class="text-muted mb-0">
          Showing attendance records for {{ formattedDate }}
        </p>
      </div>

      <span class="records-badge">
        {{ attendance.length }} records
      </span>
    </div>

    <div class="table-responsive">
      <table class="table attendance-table align-middle mb-0">
        <thead>
          <tr>
            <th>Staff</th>
            <th>Position</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Status</th>
            <th>Rendered Hours</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="staff in attendance"
            :key="staff.id"
          >
            <td>
              <div class="staff-info">
                <div class="staff-avatar">
                  {{ getInitials(staff.name) }}
                </div>

                <div>
                  <h6 class="fw-bold mb-0">
                    {{ staff.name }}
                  </h6>

                  <small class="text-muted">
                    {{ staff.employeeId }}
                  </small>
                </div>
              </div>
            </td>

            <td>{{ staff.position }}</td>

            <td>
              <span
                v-if="staff.timeIn"
                class="fw-semibold"
              >
                {{ staff.timeIn }}
              </span>

              <span
                v-else
                class="text-muted"
              >
                --
              </span>
            </td>

            <td>
              <span
                v-if="staff.timeOut"
                class="fw-semibold"
              >
                {{ staff.timeOut }}
              </span>

              <span
                v-else
                class="text-muted"
              >
                --
              </span>
            </td>

            <td>
              <span
                class="attendance-badge"
                :class="getStatusClass(staff.status)"
              >
                {{ staff.status }}
              </span>
            </td>

            <td>
              <span class="fw-bold">
                {{ getRenderedHours(staff) }}
              </span>
            </td>

            <td>
              <div class="action-group">
                <button
                  class="btn action-btn time-in-btn"
                  type="button"
                  title="Time In"
                  :disabled="isTimeInDisabled(staff)"
                  @click="$emit('time-in', staff)"
                >
                  <Icon
                    name="solar:login-3-bold-duotone"
                    size="18"
                  />
                </button>

                <button
                  class="btn action-btn time-out-btn"
                  type="button"
                  title="Time Out"
                  :disabled="isTimeOutDisabled(staff)"
                  @click="$emit('time-out', staff)"
                >
                  <Icon
                    name="solar:logout-3-bold-duotone"
                    size="18"
                  />
                </button>

                <button
                  class="btn action-btn absent-btn"
                  type="button"
                  title="Mark Absent"
                  :disabled="isAbsentDisabled(staff)"
                  @click="$emit('mark-absent', staff)"
                >
                  <Icon
                    name="solar:user-cross-bold-duotone"
                    size="18"
                  />
                </button>

                <button
                  class="btn action-btn status-btn"
                  type="button"
                  :title="staff.isActive ? 'Set as Inactive' : 'Set as Active'"
                  @click="$emit('toggle-status', staff)"
                >
                  <Icon
                    :name="staff.isActive ? 'solar:user-block-bold-duotone' : 'solar:user-check-bold-duotone'"
                    size="18"
                  />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="attendance.length === 0">
            <td
              colspan="7"
              class="p-0"
            >
              <div class="empty-card">
                <Icon
                  name="solar:calendar-search-bold-duotone"
                  size="44"
                />

                <h5 class="fw-bold mt-3">
                  No attendance found
                </h5>

                <p class="text-muted mb-0">
                  Try changing your search or filter.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
defineProps({
  attendance: {
    type: Array,
    default: () => []
  },
  formattedDate: {
    type: String,
    default: 'Today'
  },
  getInitials: {
    type: Function,
    required: true
  },
  getRenderedHours: {
    type: Function,
    required: true
  },
  isTimeInDisabled: {
    type: Function,
    required: true
  },
  isTimeOutDisabled: {
    type: Function,
    required: true
  },
  isAbsentDisabled: {
    type: Function,
    required: true
  }
})

defineEmits([
  'time-in',
  'time-out',
  'mark-absent',
  'toggle-status'
])

const getStatusClass = (status) => {
  switch (status) {
    case 'Present':
      return 'badge-green'
    case 'No Time Out':
      return 'badge-blue'
    case 'Late':
      return 'badge-orange'
    case 'Absent':
      return 'badge-red'
    case 'Inactive':
      return 'badge-gray'
    default:
      return 'badge-gray'
  }
}
</script>

<style scoped>
.attendance-table-card {
  background: white;
  border-radius: 26px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.table-header {
  padding: 22px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid #eef2f7;
}

.records-badge {
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(20, 139, 128, 0.12);
  color: #148b80;
  font-size: 13px;
  font-weight: 900;
}

.attendance-table thead th {
  padding: 16px 20px;
  background: #f8fafc;
  color: #334155;
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.attendance-table tbody td {
  padding: 18px 20px;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}

.staff-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.staff-avatar {
  width: 48px;
  height: 48px;
  border-radius: 15px;
  background: linear-gradient(180deg, #148b80, #0b5b54);
  color: white;
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: 900;
  flex: 0 0 auto;
}

.attendance-badge {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.badge-green {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.badge-blue {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

.badge-red {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.badge-orange {
  background: rgba(249, 115, 22, 0.12);
  color: #f97316;
}

.badge-gray {
  background: rgba(100, 116, 139, 0.12);
  color: #64748b;
}

.action-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.time-in-btn {
  background: rgba(20, 139, 128, 0.12);
  color: #148b80;
}

.time-out-btn {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

.absent-btn {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.status-btn {
  background: rgba(249, 115, 22, 0.12);
  color: #f97316;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.empty-card {
  min-height: 260px;
  background: white;
  border-radius: 30px;
  color: #148b80;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

@media (max-width: 767px) {
  .table-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .records-badge {
    align-self: flex-start;
  }
}
</style>