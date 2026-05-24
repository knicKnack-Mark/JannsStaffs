<template>
  <div class="admin-settings-page">

    <!-- SETTINGS TABS -->
    <section class="mb-4 fade-slide-up delay-1">
      <div class="settings-tabs-wrapper">
        <div class="settings-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="settings-tab"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <Icon
              :name="tab.icon"
              size="22"
            />

            <span>
              {{ tab.label }}
            </span>
          </button>
        </div>

        <button
          type="button"
          class="btn save-settings-btn"
          @click="saveSettings"
        >
          <Icon
            name="solar:diskette-bold-duotone"
            size="20"
          />

          <span>Save Changes</span>
        </button>
      </div>
    </section>

    <!-- PROFILE SETTINGS -->
    <section
      v-if="activeTab === 'profile'"
      class="fade-slide-up delay-2"
    >
      <div class="row g-4">
        <div class="col-xl-4">
          <div class="settings-card text-center">
            <div class="profile-avatar mx-auto mb-3">
              <Icon
                name="solar:user-bold-duotone"
                size="54"
              />
            </div>

            <h5 class="mb-1 fw-bold">
              {{ profile.name }}
            </h5>

            <p class="text-muted mb-3">
              Super Admin
            </p>

            <button
              type="button"
              class="btn btn-outline-main w-100"
            >
              Change Photo
            </button>
          </div>
        </div>

        <div class="col-xl-8">
          <div class="settings-card">
            <div class="card-title-wrapper">
              <div>
                <h5>
                  Admin Profile
                </h5>

                <p>
                  Update the admin account information.
                </p>
              </div>

              <Icon
                name="solar:user-id-bold-duotone"
                size="34"
              />
            </div>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">
                  Admin Name
                </label>

                <input
                  v-model="profile.name"
                  type="text"
                  class="form-control custom-input"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">
                  Username
                </label>

                <input
                  v-model="profile.username"
                  type="text"
                  class="form-control custom-input"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">
                  Email Address
                </label>

                <input
                  v-model="profile.email"
                  type="email"
                  class="form-control custom-input"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">
                  Contact Number
                </label>

                <input
                  v-model="profile.contact"
                  type="text"
                  class="form-control custom-input"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">
                  New Password
                </label>

                <input
                  v-model="profile.password"
                  type="password"
                  class="form-control custom-input"
                  placeholder="Enter new password"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">
                  Confirm Password
                </label>

                <input
                  v-model="profile.confirmPassword"
                  type="password"
                  class="form-control custom-input"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SYSTEM SETTINGS -->
    <section
      v-if="activeTab === 'system'"
      class="fade-slide-up delay-2"
    >
      <div class="settings-card">
        <div class="card-title-wrapper">
          <div>
            <h5>
              System Settings
            </h5>

            <p>
              Basic configuration for JANNS SPRING RESORT staff system.
            </p>
          </div>

          <Icon
            name="solar:settings-bold-duotone"
            size="34"
          />
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">
              System Name
            </label>

            <input
              v-model="system.name"
              type="text"
              class="form-control custom-input"
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">
              System Type
            </label>

            <input
              v-model="system.type"
              type="text"
              class="form-control custom-input"
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">
              Default Currency
            </label>

            <select
              v-model="system.currency"
              class="form-select custom-input"
            >
              <option value="PHP">
                PHP - Philippine Peso
              </option>

              <option value="USD">
                USD - US Dollar
              </option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">
              Timezone
            </label>

            <select
              v-model="system.timezone"
              class="form-select custom-input"
            >
              <option value="Asia/Manila">
                Asia/Manila
              </option>

              <option value="UTC">
                UTC
              </option>
            </select>
          </div>

          <div class="col-12">
            <label class="form-label">
              System Description
            </label>

            <textarea
              v-model="system.description"
              class="form-control custom-textarea"
              rows="4"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ATTENDANCE SETTINGS -->
    <section
      v-if="activeTab === 'attendance'"
      class="fade-slide-up delay-2"
    >
      <div class="settings-card">
        <div class="card-title-wrapper">
          <div>
            <h5>
              Attendance Settings
            </h5>

            <p>
              Set work schedule, late rules, and attendance status behavior.
            </p>
          </div>

          <Icon
            name="solar:calendar-bold-duotone"
            size="34"
          />
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">
              Work Start Time
            </label>

            <input
              v-model="attendance.workStart"
              type="time"
              class="form-control custom-input"
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">
              Work End Time
            </label>

            <input
              v-model="attendance.workEnd"
              type="time"
              class="form-control custom-input"
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">
              Late Grace Period
            </label>

            <div class="input-group">
              <input
                v-model.number="attendance.gracePeriod"
                type="number"
                class="form-control custom-input"
              />

              <span class="input-group-text">
                minutes
              </span>
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">
              Default Attendance Status
            </label>

            <select
              v-model="attendance.defaultStatus"
              class="form-select custom-input"
            >
              <option value="Present">
                Present
              </option>

              <option value="Absent">
                Absent
              </option>

              <option value="Late">
                Late
              </option>

              <option value="Not Timed In">
                Not Timed In
              </option>
            </select>
          </div>

          <div class="col-12">
            <label class="form-label">
              Working Days
            </label>

            <div class="working-days">
              <label
                v-for="day in days"
                :key="day"
                class="day-check"
              >
                <input
                  v-model="attendance.workingDays"
                  type="checkbox"
                  :value="day"
                />

                <span>
                  {{ day }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PAYROLL SETTINGS -->
    <section
      v-if="activeTab === 'payroll'"
      class="fade-slide-up delay-2"
    >
      <div class="settings-card">
        <div class="card-title-wrapper">
          <div>
            <h5>
              Payroll Settings
            </h5>

            <p>
              Configure payroll cycle, salary rules, deductions, and overtime.
            </p>
          </div>

          <Icon
            name="solar:wallet-money-bold-duotone"
            size="34"
          />
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">
              Payroll Cycle
            </label>

            <select
              v-model="payroll.cycle"
              class="form-select custom-input"
            >
              <option value="Monthly">
                Monthly
              </option>

              <option value="Weekly">
                Weekly
              </option>

              <option value="Daily">
                Daily
              </option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">
              Default Salary Type
            </label>

            <select
              v-model="payroll.salaryType"
              class="form-select custom-input"
            >
              <option value="Monthly">
                Monthly
              </option>

              <option value="Daily">
                Daily
              </option>

              <option value="Hourly">
                Hourly
              </option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">
              Overtime Rate
            </label>

            <div class="input-group">
              <span class="input-group-text">
                ₱
              </span>

              <input
                v-model.number="payroll.overtimeRate"
                type="number"
                class="form-control custom-input"
              />

              <span class="input-group-text">
                / hour
              </span>
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">
              Holiday Rate Multiplier
            </label>

            <div class="input-group">
              <input
                v-model.number="payroll.holidayRate"
                type="number"
                step="0.1"
                class="form-control custom-input"
              />

              <span class="input-group-text">
                x
              </span>
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">
              Default Deduction
            </label>

            <div class="input-group">
              <span class="input-group-text">
                ₱
              </span>

              <input
                v-model.number="payroll.defaultDeduction"
                type="number"
                class="form-control custom-input"
              />
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">
              Auto Mark Payroll as Paid
            </label>

            <select
              v-model="payroll.autoPaid"
              class="form-select custom-input"
            >
              <option :value="true">
                Enabled
              </option>

              <option :value="false">
                Disabled
              </option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- DEPARTMENTS SETTINGS -->
    <section
      v-if="activeTab === 'departments'"
      class="fade-slide-up delay-2"
    >
      <div class="row g-4">
        <div class="col-xl-6">
          <div class="settings-card">
            <div class="card-title-wrapper">
              <div>
                <h5>
                  Departments
                </h5>

                <p>
                  Manage staff department options.
                </p>
              </div>

              <Icon
                name="solar:buildings-2-bold-duotone"
                size="34"
              />
            </div>

            <div class="add-row mb-3">
              <input
                v-model="newDepartment"
                type="text"
                class="form-control custom-input"
                placeholder="Add department"
                @keyup.enter="addDepartment"
              />

              <button
                type="button"
                class="btn btn-add"
                @click="addDepartment"
              >
                Add
              </button>
            </div>

            <div class="list-wrapper">
              <div
                v-for="department in departments"
                :key="department"
                class="settings-list-item"
              >
                <span>
                  {{ department }}
                </span>

                <button
                  type="button"
                  class="btn-icon danger"
                  @click="removeDepartment(department)"
                >
                  <Icon
                    name="solar:trash-bin-trash-bold-duotone"
                    size="20"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-6">
          <div class="settings-card">
            <div class="card-title-wrapper">
              <div>
                <h5>
                  Positions
                </h5>

                <p>
                  Manage staff position options.
                </p>
              </div>

              <Icon
                name="solar:user-id-bold-duotone"
                size="34"
              />
            </div>

            <div class="add-row mb-3">
              <input
                v-model="newPosition"
                type="text"
                class="form-control custom-input"
                placeholder="Add position"
                @keyup.enter="addPosition"
              />

              <button
                type="button"
                class="btn btn-add"
                @click="addPosition"
              >
                Add
              </button>
            </div>

            <div class="list-wrapper">
              <div
                v-for="position in positions"
                :key="position"
                class="settings-list-item"
              >
                <span>
                  {{ position }}
                </span>

                <button
                  type="button"
                  class="btn-icon danger"
                  @click="removePosition(position)"
                >
                  <Icon
                    name="solar:trash-bin-trash-bold-duotone"
                    size="20"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SUCCESS ALERT -->
    <div
      v-if="showSuccess"
      class="save-alert"
    >
      <Icon
        name="solar:check-circle-bold-duotone"
        size="22"
      />

      <span>Settings saved successfully.</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  title: 'Settings',
  subtitle: 'Manage system preferences, attendance rules, and payroll configuration'
})

const activeTab = ref('profile')
const showSuccess = ref(false)

const tabs = [
  {
    key: 'profile',
    label: 'Profile',
    icon: 'solar:user-bold-duotone'
  },

  {
    key: 'system',
    label: 'System',
    icon: 'solar:settings-bold-duotone'
  },

  {
    key: 'attendance',
    label: 'Attendance',
    icon: 'solar:calendar-bold-duotone'
  },

  {
    key: 'payroll',
    label: 'Payroll',
    icon: 'solar:wallet-money-bold-duotone'
  },

  {
    key: 'departments',
    label: 'Departments',
    icon: 'solar:buildings-2-bold-duotone'
  }
]

const profile = ref({
  name: 'Administrator',
  username: 'admin',
  email: 'admin@jannsresort.com',
  contact: '09123456789',
  password: '',
  confirmPassword: ''
})

const system = ref({
  name: 'JANNS SPRING RESORT',
  type: 'Staff Management System',
  currency: 'PHP',
  timezone: 'Asia/Manila',
  description: 'A staff management system for attendance, payroll, and staff expenses.'
})

const attendance = ref({
  workStart: '08:00',
  workEnd: '17:00',
  gracePeriod: 15,
  defaultStatus: 'Present',
  workingDays: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]
})

const payroll = ref({
  cycle: 'Monthly',
  salaryType: 'Monthly',
  overtimeRate: 100,
  holidayRate: 2,
  defaultDeduction: 0,
  autoPaid: false
})

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

const departments = ref([
  'Front Desk',
  'Housekeeping',
  'Kitchen',
  'Maintenance',
  'Admin'
])

const positions = ref([
  'Manager',
  'Receptionist',
  'Cleaner',
  'Cook',
  'Staff'
])

const newDepartment = ref('')
const newPosition = ref('')

const addDepartment = () => {
  const value = newDepartment.value.trim()

  if (!value) {
    return
  }

  if (!departments.value.includes(value)) {
    departments.value.push(value)
  }

  newDepartment.value = ''
}

const removeDepartment = (department) => {
  departments.value = departments.value.filter((item) => item !== department)
}

const addPosition = () => {
  const value = newPosition.value.trim()

  if (!value) {
    return
  }

  if (!positions.value.includes(value)) {
    positions.value.push(value)
  }

  newPosition.value = ''
}

const removePosition = (position) => {
  positions.value = positions.value.filter((item) => item !== position)
}

const saveSettings = () => {
  showSuccess.value = true

  setTimeout(() => {
    showSuccess.value = false
  }, 2500)

  console.log({
    profile: profile.value,
    system: system.value,
    attendance: attendance.value,
    payroll: payroll.value,
    departments: departments.value,
    positions: positions.value
  })
}
</script>

<style scoped>
.admin-settings-page {
  padding-bottom: 24px;
  animation: pageFadeIn 0.35s ease both;
}

/* TABS */
.settings-tabs-wrapper {
  background: white;

  border-radius: 26px;

  padding: 10px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.settings-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.settings-tab {
  min-height: 52px;

  padding: 0 18px;

  border: none;

  border-radius: 17px;

  background: transparent;

  color: #64748b;

  font-weight: 800;

  display: flex;
  align-items: center;
  gap: 8px;

  transition: all 0.25s ease;
}

.settings-tab:hover {
  background: #f4f8f7;
  color: #0b5b54;
}

.settings-tab.active {
  background: linear-gradient(180deg, #0b5b54, #148b80);
  color: white;
  box-shadow: 0 12px 24px rgba(11, 91, 84, 0.22);
}

.save-settings-btn {
  height: 52px;

  padding: 0 22px;

  border: none;
  border-radius: 17px;

  background: linear-gradient(180deg, #0b5b54, #148b80);

  color: white;
  font-weight: 800;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  white-space: nowrap;

  box-shadow: 0 12px 24px rgba(11, 91, 84, 0.22);

  transition: all 0.25s ease;
}

.save-settings-btn:hover {
  color: white;
  transform: translateY(-1px);
}

.save-settings-btn:active {
  transform: translateY(0);
}

/* CARD */
.settings-card {
  background: white;

  border-radius: 26px;

  padding: 24px;

  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.card-title-wrapper {
  margin-bottom: 22px;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;

  color: #0b5b54;
}

.card-title-wrapper h5 {
  margin-bottom: 4px;

  color: #143c3a;
  font-weight: 800;
}

.card-title-wrapper p {
  margin-bottom: 0;

  color: #7b8a8a;
}

/* PROFILE */
.profile-avatar {
  width: 118px;
  height: 118px;

  border-radius: 34px;

  background: linear-gradient(
    135deg,
    rgba(11, 91, 84, 0.12),
    rgba(20, 139, 128, 0.2)
  );

  color: #0b5b54;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* BUTTONS */
.btn-outline-main {
  height: 48px;

  border-radius: 16px;
  border: 1px solid rgba(11, 91, 84, 0.25);

  color: #0b5b54;
  font-weight: 800;
}

.btn-outline-main:hover {
  background: #0b5b54;
  color: white;
}

.btn-add {
  height: 50px;

  padding: 0 20px;

  border: none;
  border-radius: 16px;

  background: linear-gradient(180deg, #0b5b54, #148b80);

  color: white;
  font-weight: 800;
}

.btn-add:hover {
  color: white;
  transform: translateY(-1px);
}

.btn-icon {
  width: 40px;
  height: 40px;

  border: none;

  border-radius: 14px;

  background: #f4f8f7;

  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon.danger {
  color: #dc3545;
}

.btn-icon.danger:hover {
  background: rgba(220, 53, 69, 0.1);
}

/* INPUTS */
.form-label {
  color: #334155;

  font-size: 0.85rem;
  font-weight: 800;
}

.custom-input,
.custom-textarea {
  border: none;

  border-radius: 16px;

  background: #f4f8f7;

  box-shadow: none;
}

.custom-input {
  height: 50px;
}

.custom-textarea {
  resize: none;
  padding: 14px 16px;
}

.custom-input:focus,
.custom-textarea:focus {
  background: #f4f8f7;
  box-shadow: 0 0 0 3px rgba(20, 139, 128, 0.12);
}

.input-group-text {
  border: none;

  background: #eaf3f2;

  color: #0b5b54;
  font-weight: 800;
}

/* WORKING DAYS */
.working-days {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.day-check {
  cursor: pointer;
}

.day-check input {
  display: none;
}

.day-check span {
  min-height: 44px;

  padding: 0 16px;

  border-radius: 15px;

  background: #f4f8f7;

  color: #526766;

  font-weight: 800;

  display: flex;
  align-items: center;

  transition: all 0.25s ease;
}

.day-check input:checked + span {
  background: linear-gradient(180deg, #0b5b54, #148b80);
  color: white;
}

/* LIST */
.add-row {
  display: flex;
  gap: 10px;
}

.list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.settings-list-item {
  min-height: 58px;

  padding: 10px 14px;

  border-radius: 17px;

  background: #f4f8f7;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.settings-list-item span {
  color: #334155;
  font-weight: 800;
}

/* ALERT */
.save-alert {
  position: fixed;

  right: 28px;
  bottom: 28px;

  z-index: 99999;

  padding: 16px 20px;

  border-radius: 18px;

  background: #0b5b54;

  color: white;
  font-weight: 800;

  display: flex;
  align-items: center;
  gap: 10px;

  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.22);

  animation: toastSlide 0.3s ease both;
}

/* ANIMATION */
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
  animation-delay: 0.16s;
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

@keyframes toastSlide {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* RESPONSIVE */
@media (max-width: 767px) {
  .settings-tabs-wrapper {
    align-items: stretch;
    flex-direction: column;
  }

  .settings-tabs {
    width: 100%;
  }

  .settings-tab {
    flex: 1 1 calc(50% - 10px);
    justify-content: center;
  }

  .settings-tab span {
    font-size: 0.9rem;
  }

  .save-settings-btn {
    width: 100%;
    justify-content: center;
  }

  .add-row {
    flex-direction: column;
  }

  .btn-add {
    width: 100%;
  }

  .save-alert {
    left: 18px;
    right: 18px;
    bottom: 18px;

    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .admin-settings-page,
  .fade-slide-up,
  .save-alert {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>