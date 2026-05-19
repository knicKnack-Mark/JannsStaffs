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

    <!-- TOOLBAR -->
    <section class="attendance-toolbar mb-4">
      <div>
        <h5 class="fw-bold mb-1">
          Daily Attendance
        </h5>

        <p class="text-muted mb-0">
          Monitor staff time-in, time-out, absences, and rendered hours.
        </p>
      </div>

      <div class="toolbar-actions">
        <button
          class="btn print-btn"
          type="button"
        >
          <Icon
            name="solar:printer-bold-duotone"
            size="20"
          />

          <span>Print Attendance</span>
        </button>

        <button
          class="btn export-btn"
          type="button"
        >
          <Icon
            name="solar:file-download-bold-duotone"
            size="20"
          />

          <span>Export Report</span>
        </button>
      </div>
    </section>

    <!-- FILTERS -->
    <section class="filter-card mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-12 col-lg-4">
          <label class="form-label">Attendance Date</label>

          <input
            v-model="selectedDate"
            type="date"
            class="form-control staff-select"
          />
        </div>

        <div class="col-12 col-lg-5">
          <label class="form-label">Search Staff</label>

          <div class="search-box">
            <Icon
              name="solar:magnifer-linear"
              class="search-icon"
              size="20"
            />

            <input
              v-model="search"
              type="text"
              class="form-control staff-search"
              placeholder="Search staff name or position..."
            />
          </div>
        </div>

        <div class="col-12 col-lg-3">
          <label class="form-label">Status</label>

          <select
            v-model="selectedStatus"
            class="form-select staff-select"
          >
            <option value="All">
              All Status
            </option>

            <option value="Present">
              Present
            </option>

            <option value="No Time Out">
              No Time Out
            </option>

            <option value="Late">
              Late
            </option>

            <option value="Absent">
              Absent
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>
      </div>
    </section>

    <!-- ATTENDANCE TABLE -->
    <section class="attendance-table-card">
      <div class="table-header">
        <div>
          <h5 class="fw-bold mb-1">
            Staff Attendance List
          </h5>

          <p class="text-muted mb-0">
            Showing attendance records for {{ formattedSelectedDate }}
          </p>
        </div>

        <span class="records-badge">
          {{ filteredAttendance.length }} records
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
              v-for="staff in filteredAttendance"
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

              <td>
                {{ staff.position }}
              </td>

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
                    @click="timeIn(staff)"
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
                    @click="timeOut(staff)"
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
                    @click="markAbsent(staff)"
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
                    @click="toggleStatus(staff)"
                  >
                    <Icon
                      :name="staff.isActive ? 'solar:user-block-bold-duotone' : 'solar:user-check-bold-duotone'"
                      size="18"
                    />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredAttendance.length === 0">
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

    <!-- RECENT LOGS -->
    <section class="logs-card mt-4">
      <div class="table-header">
        <div>
          <h5 class="fw-bold mb-1">
            Recent Attendance Activity
          </h5>

          <p class="text-muted mb-0">
            Latest attendance actions made today.
          </p>
        </div>

        <div class="logs-icon">
          <Icon
            name="solar:history-bold-duotone"
            size="24"
          />
        </div>
      </div>

      <div
        v-if="attendanceLogs.length"
        class="logs-list"
      >
        <div
          v-for="log in attendanceLogs"
          :key="log.id"
          class="log-item"
        >
          <div
            class="log-icon"
            :class="log.color"
          >
            <Icon
              :name="log.icon"
              size="22"
            />
          </div>

          <div>
            <h6 class="fw-bold mb-0">
              {{ log.title }}
            </h6>

            <small class="text-muted">
              {{ log.time }}
            </small>
          </div>
        </div>
      </div>

      <div
        v-else
        class="empty-logs"
      >
        No recent attendance activity yet.
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

definePageMeta({
  title: 'Attendance',
  subtitle: 'Monitor staff time-in, time-out, absences, and rendered hours'
})

const selectedDate = ref(new Date().toISOString().slice(0, 10))
const search = ref('')
const selectedStatus = ref('All')

const attendanceList = ref([
  {
    id: 1001,
    employeeId: 'JNS-001',
    name: 'Maria Santos',
    position: 'Front Desk Officer',
    timeIn: '08:00 AM',
    timeOut: '05:00 PM',
    status: 'Present',
    isActive: true
  },
  {
    id: 1002,
    employeeId: 'JNS-002',
    name: 'Juan Dela Cruz',
    position: 'Pool Attendant',
    timeIn: '08:20 AM',
    timeOut: '',
    status: 'No Time Out',
    isActive: true
  },
  {
    id: 1003,
    employeeId: 'JNS-003',
    name: 'Ana Reyes',
    position: 'Housekeeping Staff',
    timeIn: '',
    timeOut: '',
    status: 'Absent',
    isActive: true
  },
  {
    id: 1004,
    employeeId: 'JNS-004',
    name: 'Carlo Mendoza',
    position: 'Maintenance Worker',
    timeIn: '',
    timeOut: '',
    status: 'Inactive',
    isActive: false
  },
  {
    id: 1005,
    employeeId: 'JNS-005',
    name: 'Liza Aquino',
    position: 'Cashier',
    timeIn: '09:15 AM',
    timeOut: '',
    status: 'Late',
    isActive: true
  },
  {
    id: 1006,
    employeeId: 'JNS-006',
    name: 'Ramon Garcia',
    position: 'Security Guard',
    timeIn: '',
    timeOut: '',
    status: 'Absent',
    isActive: true
  }
])

const attendanceLogs = ref([
  {
    id: 1,
    title: 'Maria Santos completed attendance',
    time: 'Today',
    icon: 'solar:user-check-bold-duotone',
    color: 'green'
  },
  {
    id: 2,
    title: 'Ana Reyes was marked absent',
    time: 'Today',
    icon: 'solar:user-cross-bold-duotone',
    color: 'red'
  },
  {
    id: 3,
    title: 'Juan Dela Cruz timed in at 08:20 AM',
    time: 'Today',
    icon: 'solar:login-3-bold-duotone',
    color: 'blue'
  }
])

const filteredAttendance = computed(() => {
  const keyword = search.value.toLowerCase().trim()

  return attendanceList.value.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(keyword) ||
      staff.position.toLowerCase().includes(keyword) ||
      staff.employeeId.toLowerCase().includes(keyword)

    const matchesStatus =
      selectedStatus.value === 'All' ||
      staff.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

const summaryCards = computed(() => {
  const present = attendanceList.value.filter(staff => staff.status === 'Present').length
  const noTimeOut = attendanceList.value.filter(staff => staff.status === 'No Time Out').length
  const absent = attendanceList.value.filter(staff => staff.status === 'Absent').length
  const late = attendanceList.value.filter(staff => staff.status === 'Late').length

  return [
    {
      title: 'Present Today',
      value: present,
      description: 'Completed attendance',
      icon: 'solar:user-check-bold-duotone',
      color: 'green'
    },
    {
      title: 'No Time Out',
      value: noTimeOut,
      description: 'Currently on duty',
      icon: 'solar:logout-3-bold-duotone',
      color: 'blue'
    },
    {
      title: 'Absent Today',
      value: absent,
      description: 'Marked as absent',
      icon: 'solar:user-cross-bold-duotone',
      color: 'red'
    },
    {
      title: 'Late Today',
      value: late,
      description: 'Timed in late',
      icon: 'solar:alarm-bold-duotone',
      color: 'orange'
    }
  ]
})

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) {
    return 'Today'
  }

  return new Date(selectedDate.value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
})

const getInitials = (name) => {
  if (!name) {
    return 'NA'
  }

  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

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

const convertToDate = (time) => {
  if (!time) {
    return null
  }

  const today = new Date().toDateString()

  return new Date(`${today} ${time}`)
}

const getRenderedHours = (staff) => {
  if (!staff.timeIn || !staff.timeOut) {
    return '--'
  }

  const timeIn = convertToDate(staff.timeIn)
  const timeOut = convertToDate(staff.timeOut)

  if (!timeIn || !timeOut || timeOut <= timeIn) {
    return '--'
  }

  const diffMs = timeOut - timeIn
  const hours = Math.floor(diffMs / 1000 / 60 / 60)
  const minutes = Math.floor((diffMs / 1000 / 60) % 60)

  return `${hours}h ${minutes}m`
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const addLog = (title, icon, color) => {
  attendanceLogs.value.unshift({
    id: Date.now(),
    title,
    time: 'Just now',
    icon,
    color
  })
}

const timeIn = (staff) => {
  const currentTime = getCurrentTime()

  staff.timeIn = currentTime
  staff.timeOut = ''

  const lateLimit = convertToDate('08:30 AM')
  const current = convertToDate(currentTime)

  staff.status = current > lateLimit ? 'Late' : 'No Time Out'

  addLog(
    `${staff.name} timed in at ${currentTime}`,
    'solar:login-3-bold-duotone',
    'blue'
  )
}

const timeOut = (staff) => {
  const currentTime = getCurrentTime()

  staff.timeOut = currentTime
  staff.status = 'Present'

  addLog(
    `${staff.name} timed out at ${currentTime}`,
    'solar:logout-3-bold-duotone',
    'green'
  )
}

const markAbsent = (staff) => {
  staff.timeIn = ''
  staff.timeOut = ''
  staff.status = 'Absent'

  addLog(
    `${staff.name} was marked absent`,
    'solar:user-cross-bold-duotone',
    'red'
  )
}

const toggleStatus = (staff) => {
  staff.isActive = !staff.isActive

  if (!staff.isActive) {
    staff.timeIn = ''
    staff.timeOut = ''
    staff.status = 'Inactive'

    addLog(
      `${staff.name} was set as inactive`,
      'solar:user-block-bold-duotone',
      'orange'
    )

    return
  }

  staff.status = 'Absent'

  addLog(
    `${staff.name} was set as active`,
    'solar:user-check-bold-duotone',
    'green'
  )
}

const isTimeInDisabled = (staff) => {
  return (
    !staff.isActive ||
    staff.status === 'Absent' ||
    staff.status === 'Inactive' ||
    !!staff.timeIn
  )
}

const isTimeOutDisabled = (staff) => {
  return (
    !staff.isActive ||
    staff.status === 'Absent' ||
    staff.status === 'Inactive' ||
    !staff.timeIn ||
    !!staff.timeOut
  )
}

const isAbsentDisabled = (staff) => {
  return (
    !staff.isActive ||
    staff.status === 'Inactive' ||
    !!staff.timeIn ||
    staff.status === 'Present' ||
    staff.status === 'Late' ||
    staff.status === 'No Time Out'
  )
}
</script>

<style scoped>
.attendance-page {
  padding-bottom: 24px;
}

/* TOOLBAR */
.attendance-toolbar {
  background: white;

  border-radius: 26px;

  padding: 22px 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;

  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.print-btn,
.export-btn {
  height: 48px;

  border-radius: 16px;

  padding: 0 18px;

  font-weight: 800;

  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.print-btn {
  background: #f4f8f7;
  color: #334155;
}

.export-btn {
  background: linear-gradient(180deg, #0b5b54, #148b80);
  color: white;
}

.export-btn:hover {
  color: white;
  transform: translateY(-1px);
}

/* FILTER */
.filter-card {
  background: white;

  border-radius: 26px;

  padding: 20px;

  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;

  top: 50%;
  left: 18px;

  transform: translateY(-50%);

  color: #718096;
}

.staff-search,
.staff-select {
  height: 52px;

  border: none;

  border-radius: 16px;

  background: #f4f8f7;

  box-shadow: none;
}

.staff-search {
  padding-left: 50px;
}

.staff-search:focus,
.staff-select:focus {
  background: #f4f8f7;
  box-shadow: 0 0 0 3px rgba(20, 139, 128, 0.12);
}

.form-label {
  color: #334155;

  font-size: 0.85rem;
  font-weight: 800;
}

/* TABLE */
.attendance-table-card,
.logs-card {
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

/* BADGES */
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

/* ACTIONS */
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

/* EMPTY */
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

/* LOGS */
.logs-card {
  padding-bottom: 6px;
}

.logs-icon {
  width: 48px;
  height: 48px;

  border-radius: 16px;

  background: rgba(20, 139, 128, 0.12);
  color: #148b80;

  display: flex;
  align-items: center;
  justify-content: center;
}

.logs-list {
  padding: 0 24px 10px;
}

.log-item {
  padding: 16px 0;

  display: flex;
  align-items: center;
  gap: 12px;

  border-bottom: 1px solid #f1f5f9;
}

.log-item:last-child {
  border-bottom: none;
}

.log-icon {
  width: 44px;
  height: 44px;

  border-radius: 15px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.log-icon.green {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.log-icon.blue {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

.log-icon.red {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.log-icon.orange {
  background: rgba(249, 115, 22, 0.12);
  color: #f97316;
}

.empty-logs {
  margin: 0 24px 20px;

  padding: 18px;

  border-radius: 18px;

  background: #f4f8f7;

  color: #64748b;
}

/* RESPONSIVE */
@media (max-width: 767px) {
  .attendance-toolbar,
  .table-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .toolbar-actions {
    width: 100%;
    flex-direction: column;
  }

  .print-btn,
  .export-btn {
    width: 100%;
    justify-content: center;
  }

  .records-badge {
    align-self: flex-start;
  }
}
</style>