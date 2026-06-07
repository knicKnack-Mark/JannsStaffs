<template>
  <section class="mb-4">
    <div class="attendance-table-card">
      <div class="table-header">
        <div>
          <h5>Attendance Records</h5>
          <p>
            Records for {{ formattedDate }}
          </p>
        </div>

        <div class="record-count">
          {{ attendance.length }} record(s)
        </div>
      </div>

      <div class="table-responsive">
        <table class="table align-middle attendance-table">
          <thead>
            <tr>
              <th>Staff</th>
              <th>Department</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Rendered</th>
              <th>Status</th>
              <th>Remarks</th>
              <th class="text-end">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in attendance"
              :key="item.id"
            >
              <td>
                <div class="staff-info">
                  <div class="staff-avatar">
                    <img
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.name"
                      class="staff-avatar-img"
                    >

                    <span v-else>
                      {{ getInitials(item.name) }}
                    </span>
                  </div>

                  <div>
                    <h6>{{ item.name }}</h6>
                    <span>{{ item.position }}</span>
                  </div>
                </div>
              </td>

              <td>
                <span class="department-pill">
                  {{ item.department }}
                </span>
              </td>

              <td>
                <strong>{{ formatTime(item.timeIn) }}</strong>
              </td>

              <td>
                <strong>{{ formatTime(item.timeOut) }}</strong>
              </td>

              <td>
                <span class="rendered-hours">
                  {{ getRenderedHours(item) }}
                </span>
              </td>

              <td>
                <button
                  class="status-badge border-0"
                  :class="getStatusClass(item.status)"
                  type="button"
                  @click="$emit('toggleStatus', item)"
                >
                  {{ item.status }}
                </button>
              </td>

              <td>
                <input
                  :value="item.remarks"
                  type="text"
                  class="form-control remarks-input"
                  placeholder="Add remarks..."
                  @change="$emit('updateRemarks', {
                    item,
                    remarks: $event.target.value
                  })"
                >
              </td>

              <td>
                <div class="table-actions">
                  <button
                    class="btn action-btn action-success"
                    type="button"
                    :disabled="isTimeInDisabled(item)"
                    @click="$emit('timeIn', item)"
                  >
                    <Icon
                      name="solar:login-2-bold-duotone"
                      size="18"
                    />
                    Time In
                  </button>

                  <button
                    class="btn action-btn action-primary"
                    type="button"
                    :disabled="isTimeOutDisabled(item)"
                    @click="$emit('timeOut', item)"
                  >
                    <Icon
                      name="solar:logout-2-bold-duotone"
                      size="18"
                    />
                    Time Out
                  </button>

                  <button
                    class="btn action-btn action-danger"
                    type="button"
                    :disabled="isAbsentDisabled(item)"
                    @click="$emit('markAbsent', item)"
                  >
                    <Icon
                      name="solar:user-cross-bold-duotone"
                      size="18"
                    />
                    Absent
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!attendance.length">
              <td
                colspan="8"
                class="empty-state"
              >
                <Icon
                  name="solar:document-bold-duotone"
                  size="44"
                />
                <h6>No attendance records found</h6>
                <p>Try changing your search or status filter.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
    default: ''
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
  'timeIn',
  'timeOut',
  'markAbsent',
  'toggleStatus',
  'updateRemarks'
])

const formatTime = (time) => {
  if (!time) return '--'

  const [hours, minutes] = time.split(':')
  const date = new Date()
  date.setHours(Number(hours))
  date.setMinutes(Number(minutes))

  return date.toLocaleTimeString('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const getStatusClass = (status) => {
  const classes = {
    Pending: 'status-pending',
    'On Time': 'status-success',
    Late: 'status-warning',
    Undertime: 'status-orange',
    'Half Day': 'status-purple',
    Absent: 'status-danger'
  }

  return classes[status] || 'status-pending'
}
</script>

<style scoped>
.attendance-table-card {
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 22px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.table-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 18px;
}

.table-header h5 {
  font-weight: 800;
  margin-bottom: 4px;
  color: #182230;
}

.table-header p {
  margin-bottom: 0;
  color: #667085;
  font-size: 14px;
}

.record-count {
  background: #f0fdf4;
  color: #15803d;
  font-weight: 800;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
}

.attendance-table {
  margin-bottom: 0;
}

.attendance-table thead th {
  background: #f8fafc;
  color: #667085;
  font-size: 13px;
  font-weight: 800;
  border-bottom: 0;
  padding: 14px;
  white-space: nowrap;
}

.attendance-table tbody td {
  padding: 16px 14px;
  border-color: rgba(15, 23, 42, 0.06);
  vertical-align: middle;
  white-space: nowrap;
}

.staff-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.staff-avatar {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  background: linear-gradient(135deg, #16a34a, #84cc16);
  color: #ffffff;
  display: grid;
  place-items: center;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.staff-info h6 {
  margin-bottom: 2px;
  font-weight: 800;
  color: #182230;
}

.staff-info span {
  color: #667085;
  font-size: 13px;
}

.department-pill {
  background: #f2f4f7;
  color: #344054;
  font-weight: 700;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 13px;
}

.rendered-hours {
  color: #101828;
  font-weight: 800;
}

.status-badge {
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
}

.status-pending {
  background: #f2f4f7;
  color: #475467;
}

.status-success {
  background: #dcfce7;
  color: #15803d;
}

.status-warning {
  background: #fef3c7;
  color: #b45309;
}

.status-orange {
  background: #ffedd5;
  color: #c2410c;
}

.status-purple {
  background: #f3e8ff;
  color: #7e22ce;
}

.status-danger {
  background: #fee2e2;
  color: #b91c1c;
}

.remarks-input {
  min-width: 180px;
  border-radius: 12px;
  border-color: rgba(15, 23, 42, 0.12);
  font-size: 14px;
}

.remarks-input:focus {
  border-color: #1f9d55;
  box-shadow: 0 0 0 4px rgba(31, 157, 85, 0.12);
}

.table-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-btn {
  border-radius: 12px;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  padding: 8px 10px;
}

.action-success {
  background: #dcfce7;
  color: #15803d;
}

.action-primary {
  background: #dbeafe;
  color: #1d4ed8;
}

.action-danger {
  background: #fee2e2;
  color: #b91c1c;
}

.action-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 48px 20px !important;
  color: #98a2b3;
}

.empty-state h6 {
  margin-top: 12px;
  font-weight: 800;
  color: #344054;
}

.empty-state p {
  margin-bottom: 0;
  color: #667085;
}

.staff-avatar {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  background: linear-gradient(135deg, #16a34a, #84cc16);
  color: #ffffff;
  display: grid;
  place-items: center;
  font-weight: 900;
  letter-spacing: 0.5px;
  overflow: hidden;
  flex-shrink: 0;
}

.staff-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (max-width: 1200px) {
  .table-actions {
    min-width: 320px;
  }
}


</style>