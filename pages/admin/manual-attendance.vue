<template>
  <div class="attendance-kiosk-page">
    <!-- MAIN CLOCK CARD -->
    <section class="kiosk-card">
      <div class="brand-area">
        <div class="brand-logo">
          JS
        </div>

        <div>
          <h1>JANNS SPRING RESORT</h1>
          <p>Manual Staff Attendance</p>
        </div>
      </div>

      <!-- RUNNING TIME -->
      <div class="clock-area">
        <h2>{{ currentTime }}</h2>
        <p>{{ currentDate }}</p>
      </div>

      <!-- STAFF ID INPUT -->
      <form
        class="attendance-form"
        @submit.prevent="submitAttendance"
      >
        <label>Enter Staff ID</label>

        <div class="input-group">
          <Icon
            name="solar:user-id-bold-duotone"
            size="24"
            class="input-icon"
          />

          <input
            ref="staffIdInput"
            v-model="staffId"
            type="text"
            class="form-control staff-id-input"
            :class="{ shake: isShaking }"
            placeholder="Example: JS-001"
            autocomplete="off"
          >
        </div>

        <small>Press Enter to register Time In or Time Out</small>
      </form>

      <!-- RESULT MESSAGE -->
      <Transition name="message-slide">
        <div
          v-if="message.text"
          class="result-message"
          :class="message.type"
        >
          <Icon
            :name="message.icon"
            size="24"
          />

          <div>
            <h4>{{ message.title }}</h4>
            <p>{{ message.text }}</p>
          </div>
        </div>
      </Transition>
    </section>

    <!-- TODAY LOGS -->
    <section class="logs-card">
      <div class="logs-header">
        <div>
          <h3>Today Attendance Logs</h3>
          <p>Latest staff time in and time out records.</p>
        </div>

        <span>{{ attendanceLogs.length }} record(s)</span>
      </div>

      <div
        v-if="attendanceLogs.length"
        class="table-responsive"
      >
        <table class="table attendance-table align-middle">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="record in attendanceLogs"
              :key="record.id"
              class="log-row"
            >
              <td>
                <strong>{{ record.staffCode }}</strong>
              </td>

              <td>
                <div class="staff-name">
                  <span>{{ getInitials(record.name) }}</span>

                  <div>
                    <strong>{{ record.name }}</strong>
                    <small>{{ record.position }}</small>
                  </div>
                </div>
              </td>

              <td>{{ record.timeIn || '--' }}</td>
              <td>{{ record.timeOut || '--' }}</td>

              <td>
                <span
                  class="status-pill"
                  :class="record.timeOut ? 'completed' : 'timed-in'"
                >
                  {{ record.timeOut ? 'Completed' : 'Timed In' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-else
        class="empty-state"
      >
        <Icon
          name="solar:clock-circle-bold-duotone"
          size="44"
        />

        <h4>No attendance records yet</h4>
        <p>Enter a Staff ID above to start recording attendance.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Manual Attendance',
  subtitle: 'Enter staff ID to record time in and time out'
})

const staffIdInput = ref(null)
const staffId = ref('')
const currentTime = ref('')
const currentDate = ref('')
const attendanceLogs = ref([])
const isShaking = ref(false)

const message = ref({
  type: '',
  icon: '',
  title: '',
  text: ''
})

const staffList = ref([
  {
    id: 1,
    staffCode: 'JS-001',
    name: 'Juan Dela Cruz',
    position: 'Pool Attendant'
  },
  {
    id: 2,
    staffCode: 'JS-002',
    name: 'Maria Santos',
    position: 'Front Desk Staff'
  },
  {
    id: 3,
    staffCode: 'JS-003',
    name: 'Pedro Reyes',
    position: 'Housekeeping Staff'
  },
  {
    id: 4,
    staffCode: 'JS-004',
    name: 'Ana Garcia',
    position: 'Kitchen Staff'
  },
  {
    id: 5,
    staffCode: 'JS-005',
    name: 'Mark Lopez',
    position: 'Maintenance Staff'
  }
])

let timer = null
let messageTimer = null

const updateClock = () => {
  const now = new Date()

  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })

  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  })
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const submitAttendance = () => {
  const enteredId = staffId.value.trim().toUpperCase()

  if (!enteredId) {
    shakeInput()

    showMessage({
      type: 'warning',
      icon: 'solar:danger-triangle-bold-duotone',
      title: 'Staff ID Required',
      text: 'Please enter a valid Staff ID.'
    })

    focusInput()
    return
  }

  const staff = staffList.value.find((item) => {
    return item.staffCode.toUpperCase() === enteredId
  })

  if (!staff) {
    shakeInput()

    showMessage({
      type: 'error',
      icon: 'solar:user-cross-bold-duotone',
      title: 'Staff Not Found',
      text: `${enteredId} is not registered in the staff list.`
    })

    resetInput()
    return
  }

  const existingRecord = attendanceLogs.value.find((record) => {
    return record.staffCode === staff.staffCode
  })

  const timeNow = getCurrentTime()

  if (!existingRecord) {
    attendanceLogs.value.unshift({
      id: Date.now(),
      staffCode: staff.staffCode,
      name: staff.name,
      position: staff.position,
      timeIn: timeNow,
      timeOut: ''
    })

    showMessage({
      type: 'success',
      icon: 'solar:login-3-bold-duotone',
      title: 'Time In Recorded',
      text: `${staff.name} timed in at ${timeNow}.`
    })

    resetInput()
    return
  }

  if (existingRecord.timeIn && !existingRecord.timeOut) {
    existingRecord.timeOut = timeNow

    showMessage({
      type: 'success',
      icon: 'solar:logout-3-bold-duotone',
      title: 'Time Out Recorded',
      text: `${staff.name} timed out at ${timeNow}.`
    })

    resetInput()
    return
  }

  showMessage({
    type: 'warning',
    icon: 'solar:check-circle-bold-duotone',
    title: 'Attendance Already Completed',
    text: `${staff.name} already has Time In and Time Out today.`
  })

  resetInput()
}

const showMessage = ({ type, icon, title, text }) => {
  message.value = {
    type,
    icon,
    title,
    text
  }

  if (messageTimer) {
    clearTimeout(messageTimer)
  }

  messageTimer = setTimeout(() => {
    message.value = {
      type: '',
      icon: '',
      title: '',
      text: ''
    }
  }, 3500)
}

const shakeInput = () => {
  isShaking.value = true

  setTimeout(() => {
    isShaking.value = false
  }, 450)
}

const resetInput = () => {
  staffId.value = ''
  focusInput()
}

const focusInput = () => {
  nextTick(() => {
    staffIdInput.value?.focus()
  })
}

const getInitials = (name) => {
  if (!name) return ''

  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 1000)
  focusInput()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }

  if (messageTimer) {
    clearTimeout(messageTimer)
  }
})
</script>

<style scoped>
.attendance-kiosk-page {
  min-height: calc(100vh - 120px);
  padding-bottom: 28px;
  animation: pageFadeIn 0.55s ease both;
}

/* MAIN CARD */
.kiosk-card {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgba(45, 212, 191, 0.24), transparent 34%),
    linear-gradient(135deg, #0f766e 0%, #115e59 48%, #134e4a 100%);
  border-radius: 34px;
  padding: 34px;
  color: #ffffff;
  box-shadow: 0 24px 54px rgba(15, 118, 110, 0.25);
  animation: kioskPop 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.kiosk-card::before {
  content: "";
  position: absolute;
  inset: -80px;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.14), transparent 24%),
    radial-gradient(circle at 80% 30%, rgba(45, 212, 191, 0.18), transparent 28%),
    radial-gradient(circle at 50% 90%, rgba(255, 255, 255, 0.08), transparent 25%);
  animation: bgFloat 9s ease-in-out infinite alternate;
  pointer-events: none;
}

.kiosk-card > * {
  position: relative;
  z-index: 1;
}

/* BRAND */
.brand-area {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 34px;
}

.brand-logo {
  width: 62px;
  height: 62px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.24);
  display: grid;
  place-items: center;
  font-size: 21px;
  font-weight: 950;
}

.brand-area h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 950;
  letter-spacing: -0.5px;
}

.brand-area p {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.76);
  font-weight: 600;
}

/* CLOCK */
.clock-area {
  text-align: center;
  margin-bottom: 34px;
}

.clock-area h2 {
  margin: 0;
  font-size: clamp(64px, 9vw, 132px);
  font-weight: 950;
  line-height: 1;
  letter-spacing: -4px;
  animation: clockPulse 2.4s ease-in-out infinite;
  text-shadow: 0 10px 32px rgba(0, 0, 0, 0.18);
}

.clock-area p {
  margin: 12px 0 0;
  font-size: 20px;
  font-weight: 750;
  color: rgba(255, 255, 255, 0.8);
}

/* FORM */
.attendance-form {
  max-width: 720px;
  margin: 0 auto;
}

.attendance-form label {
  display: block;
  margin-bottom: 10px;
  color: #ccfbf1;
  font-size: 14px;
  font-weight: 850;
}

.input-group {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  z-index: 5;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
}

.staff-id-input {
  min-height: 68px;
  border-radius: 22px !important;
  border: 0;
  padding-left: 58px;
  padding-right: 20px;
  font-size: 24px;
  font-weight: 900;
  color: #101828;
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.16);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.staff-id-input:focus {
  transform: translateY(-2px);
  box-shadow:
    0 18px 35px rgba(15, 23, 42, 0.16),
    0 0 0 5px rgba(204, 251, 241, 0.35);
}

.staff-id-input.shake {
  animation: inputShake 0.42s ease;
}

.attendance-form small {
  display: block;
  margin-top: 10px;
  text-align: center;
  color: rgba(255, 255, 255, 0.76);
  font-weight: 650;
}

/* RESULT MESSAGE */
.result-message {
  max-width: 720px;
  margin: 22px auto 0;
  padding: 16px 18px;
  border-radius: 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.result-message h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 950;
}

.result-message p {
  margin: 3px 0 0;
  font-weight: 650;
}

.result-message.success {
  background: rgba(220, 252, 231, 0.16);
  color: #dcfce7;
}

.result-message.error {
  background: rgba(254, 226, 226, 0.16);
  color: #fee2e2;
}

.result-message.warning {
  background: rgba(254, 243, 199, 0.16);
  color: #fef3c7;
}

/* LOGS */
.logs-card {
  margin-top: 24px;
  background: #ffffff;
  border-radius: 28px;
  padding: 22px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.06);
  animation: logsFadeUp 0.65s ease both;
  animation-delay: 0.12s;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

.logs-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
}

.logs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.logs-header h3 {
  margin: 0;
  color: #101828;
  font-size: 22px;
  font-weight: 950;
}

.logs-header p {
  margin: 4px 0 0;
  color: #667085;
  font-weight: 600;
}

.logs-header span {
  padding: 9px 13px;
  border-radius: 999px;
  background: #ecfdf5;
  color: #0f766e;
  font-weight: 900;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

.logs-header span:hover {
  transform: scale(1.04);
}

/* TABLE */
.attendance-table {
  margin: 0;
}

.attendance-table thead th {
  background: #f8fafc;
  color: #475467;
  font-size: 13px;
  font-weight: 900;
  border-bottom: 0;
  padding: 14px;
}

.attendance-table tbody td {
  padding: 15px 14px;
  color: #344054;
  font-weight: 700;
  border-color: rgba(15, 23, 42, 0.07);
}

.log-row {
  animation: rowSlideIn 0.36s ease both;
}

.log-row:nth-child(1) {
  animation-delay: 0.03s;
}

.log-row:nth-child(2) {
  animation-delay: 0.06s;
}

.log-row:nth-child(3) {
  animation-delay: 0.09s;
}

.log-row:nth-child(4) {
  animation-delay: 0.12s;
}

.log-row:nth-child(5) {
  animation-delay: 0.15s;
}

/* STAFF NAME */
.staff-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.staff-name span {
  width: 42px;
  height: 42px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  background: #ecfdf5;
  color: #0f766e;
  font-size: 13px;
  font-weight: 950;
}

.staff-name strong {
  display: block;
  color: #101828;
  font-weight: 950;
}

.staff-name small {
  display: block;
  color: #667085;
  font-weight: 600;
}

/* STATUS */
.status-pill {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 950;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

.status-pill.timed-in {
  background: #fef3c7;
  color: #b45309;
}

.status-pill.completed {
  background: #dcfce7;
  color: #15803d;
}

/* EMPTY */
.empty-state {
  padding: 42px;
  text-align: center;
  background: #f8fafc;
  border-radius: 22px;
  color: #667085;
}

.empty-state h4 {
  margin: 10px 0 4px;
  color: #101828;
  font-weight: 950;
}

.empty-state p {
  margin: 0;
  font-weight: 600;
}

/* TRANSITIONS */
.message-slide-enter-active,
.message-slide-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s ease;
}

.message-slide-enter-from,
.message-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.message-slide-enter-to,
.message-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* ANIMATIONS */
@keyframes pageFadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes kioskPop {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes clockPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.015);
    opacity: 0.94;
  }
}

@keyframes inputShake {
  0%,
  100% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-8px);
  }

  40% {
    transform: translateX(8px);
  }

  60% {
    transform: translateX(-6px);
  }

  80% {
    transform: translateX(6px);
  }
}

@keyframes logsFadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rowSlideIn {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bgFloat {
  from {
    transform: translate3d(-12px, -8px, 0) scale(1);
  }

  to {
    transform: translate3d(12px, 8px, 0) scale(1.04);
  }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .kiosk-card {
    border-radius: 26px;
    padding: 24px;
  }

  .brand-area {
    align-items: flex-start;
  }

  .clock-area h2 {
    letter-spacing: -2px;
  }

  .staff-id-input {
    min-height: 62px;
    font-size: 20px;
  }

  .logs-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>