<template>
  <div class="admin-settings-page">
    <AdminSettingsTabs
      v-model="activeTab"
      :tabs="tabs"
      @save="saveSettings"
    />

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
          <AdminSettingsCard
            title="Admin Profile"
            description="Update the admin account information."
            icon="solar:user-id-bold-duotone"
          >
            <div class="row g-3">
              <AdminSettingsField
                v-model="profile.name"
                label="Admin Name"
              />

              <AdminSettingsField
                v-model="profile.username"
                label="Username"
              />

              <AdminSettingsField
                v-model="profile.email"
                label="Email Address"
                type="email"
              />

              <AdminSettingsField
                v-model="profile.contact"
                label="Contact Number"
              />

              <AdminSettingsField
                v-model="profile.password"
                label="New Password"
                type="password"
                placeholder="Enter new password"
              />

              <AdminSettingsField
                v-model="profile.confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
              />
            </div>
          </AdminSettingsCard>
        </div>
      </div>
    </section>

    <!-- SYSTEM SETTINGS -->
    <section
      v-if="activeTab === 'system'"
      class="fade-slide-up delay-2"
    >
      <AdminSettingsCard
        title="System Settings"
        description="Basic configuration for JANNS SPRING RESORT staff system."
        icon="solar:settings-bold-duotone"
      >
        <div class="row g-3">
          <AdminSettingsField
            v-model="system.name"
            label="System Name"
          />

          <AdminSettingsField
            v-model="system.type"
            label="System Type"
          />

          <AdminSettingsField
            v-model="system.currency"
            label="Default Currency"
            type="select"
            :options="currencyOptions"
          />

          <AdminSettingsField
            v-model="system.timezone"
            label="Timezone"
            type="select"
            :options="timezoneOptions"
          />

          <AdminSettingsField
            v-model="system.description"
            label="System Description"
            type="textarea"
            column-class="col-12"
          />
        </div>
      </AdminSettingsCard>
    </section>

    <!-- ATTENDANCE SETTINGS -->
    <section
      v-if="activeTab === 'attendance'"
      class="fade-slide-up delay-2"
    >
      <AdminSettingsCard
        title="Attendance Settings"
        description="Set work schedule, late rules, and attendance status behavior."
        icon="solar:calendar-bold-duotone"
      >
        <div class="row g-3">
          <AdminSettingsField
            v-model="attendance.workStart"
            label="Work Start Time"
            type="time"
          />

          <AdminSettingsField
            v-model="attendance.workEnd"
            label="Work End Time"
            type="time"
          />

          <AdminSettingsField
            v-model="attendance.gracePeriod"
            label="Late Grace Period"
            type="number"
            suffix="minutes"
            number
          />

          <AdminSettingsField
            v-model="attendance.defaultStatus"
            label="Default Attendance Status"
            type="select"
            :options="attendanceStatusOptions"
          />

          <div class="col-12">
            <label class="form-label">
              Working Days
            </label>

            <AdminWorkingDaysPicker
              v-model="attendance.workingDays"
              :days="days"
            />
          </div>
        </div>
      </AdminSettingsCard>
    </section>

    <!-- PAYROLL SETTINGS -->
    <section
      v-if="activeTab === 'payroll'"
      class="fade-slide-up delay-2"
    >
      <AdminSettingsCard
        title="Payroll Settings"
        description="Configure payroll cycle, salary rules, deductions, and overtime."
        icon="solar:wallet-money-bold-duotone"
      >
        <div class="row g-3">
          <AdminSettingsField
            v-model="payroll.cycle"
            label="Payroll Cycle"
            type="select"
            :options="payrollCycleOptions"
          />

          <AdminSettingsField
            v-model="payroll.salaryType"
            label="Default Salary Type"
            type="select"
            :options="salaryTypeOptions"
          />

          <AdminSettingsField
            v-model="payroll.overtimeRate"
            label="Overtime Rate"
            type="number"
            prefix="₱"
            suffix="/ hour"
            number
          />

          <AdminSettingsField
            v-model="payroll.holidayRate"
            label="Holiday Rate Multiplier"
            type="number"
            suffix="x"
            step="0.1"
            number
          />

          <AdminSettingsField
            v-model="payroll.sssDeduction"
            label="SSS Deduction"
            type="number"
            prefix="₱"
            number
          />

          <AdminSettingsField
            v-model="payroll.philHealthDeduction"
            label="PhilHealth Deduction"
            type="number"
            prefix="₱"
            number
          />

          <AdminSettingsField
            v-model="payroll.pagIbigDeduction"
            label="Pag-IBIG Deduction"
            type="number"
            prefix="₱"
            number
          />

          <AdminSettingsField
            v-model="payroll.autoPaid"
            label="Auto Mark Payroll as Paid"
            type="select"
            :options="autoPaidOptions"
          />
        </div>
      </AdminSettingsCard>
    </section>

    <!-- DEPARTMENTS SETTINGS -->
    <section
      v-if="activeTab === 'departments'"
      class="fade-slide-up delay-2"
    >
      <div class="row g-4">
        <div class="col-xl-6">
          <AdminSettingsOptionList
            title="Departments"
            description="Manage staff department options."
            icon="solar:buildings-2-bold-duotone"
            placeholder="Add department"
            :items="departments"
            @add="addDepartment"
            @remove="removeDepartment"
          />
        </div>

        <div class="col-xl-6">
          <AdminSettingsOptionList
            title="Positions"
            description="Manage staff position options."
            icon="solar:user-id-bold-duotone"
            placeholder="Add position"
            :items="positions"
            @add="addPosition"
            @remove="removePosition"
          />
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
  sssDeduction: 0,
  philHealthDeduction: 0,
  pagIbigDeduction: 0,
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

const currencyOptions = [
  {
    label: 'PHP - Philippine Peso',
    value: 'PHP'
  },
  {
    label: 'USD - US Dollar',
    value: 'USD'
  }
]

const timezoneOptions = [
  {
    label: 'Asia/Manila',
    value: 'Asia/Manila'
  },
  {
    label: 'UTC',
    value: 'UTC'
  }
]

const attendanceStatusOptions = [
  {
    label: 'Present',
    value: 'Present'
  },
  {
    label: 'Absent',
    value: 'Absent'
  },
  {
    label: 'Late',
    value: 'Late'
  },
  {
    label: 'Not Timed In',
    value: 'Not Timed In'
  }
]

const payrollCycleOptions = [
  {
    label: 'Monthly',
    value: 'Monthly'
  },
  {
    label: 'Weekly',
    value: 'Weekly'
  },
  {
    label: 'Daily',
    value: 'Daily'
  }
]

const salaryTypeOptions = [
  {
    label: 'Monthly',
    value: 'Monthly'
  },
  {
    label: 'Daily',
    value: 'Daily'
  },
  {
    label: 'Hourly',
    value: 'Hourly'
  }
]

const autoPaidOptions = [
  {
    label: 'Enabled',
    value: true
  },
  {
    label: 'Disabled',
    value: false
  }
]

const addDepartment = (value) => {
  if (!departments.value.includes(value)) {
    departments.value.push(value)
  }
}

const removeDepartment = (department) => {
  departments.value = departments.value.filter((item) => item !== department)
}

const addPosition = (value) => {
  if (!positions.value.includes(value)) {
    positions.value.push(value)
  }
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

.settings-card {
  background: white;
  border-radius: 26px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

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

.fade-slide-up {
  opacity: 0;
  transform: translateY(22px);
  animation: fadeSlideUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  will-change: opacity, transform;
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

@media (max-width: 767px) {
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