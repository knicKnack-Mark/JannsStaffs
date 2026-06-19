<template>
  <div class="admin-settings-page">
    <AdminSettingsTabs
      v-model="activeTab"
      :tabs="tabs"
      @save="saveSettings"
    />

    <div
      v-if="loading"
      class="settings-card text-center"
    >
      Loading settings...
    </div>

    <template v-else>
      <!-- PROFILE SETTINGS -->
      <ProfileSettings
        v-if="activeTab === 'profile'"
        :profile="profile"
      />

      <!-- SYSTEM SETTINGS -->
      <SystemSettings
        v-if="activeTab === 'system'"
        v-model="system"
      />

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
            <AdminSettingsField v-model="attendance.workStart" label="Work Start Time" type="time" />
            <AdminSettingsField v-model="attendance.workEnd" label="Work End Time" type="time" />

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
      <DepartmentSettings
        v-if="activeTab === 'departments'"
        :departments="departments"
        :positions="positions"
        @update:departments="departments = $event"
        @update:positions="positions = $event"
      />
    </template>

    <div
      v-if="showSuccess"
      class="save-alert"
    >
      <Icon name="solar:check-circle-bold-duotone" size="22" />
      <span>{{ successMessage }}</span>
    </div>

    <div
      v-if="showError"
      class="save-alert error"
    >
      <Icon name="solar:danger-circle-bold-duotone" size="22" />
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import DepartmentSettings from '~/components/admin/settings/DepartmentSettings.vue'
import SystemSettings from '~/components/admin/settings/SystemSettings.vue'
import ProfileSettings from '~/components/admin/settings/ProfileSettings.vue'
import { onMounted, ref } from 'vue'

definePageMeta({
  title: 'Settings',
  subtitle: 'Manage system preferences, attendance rules, and payroll configuration'
})

const { apiFetch } = useApi()

const activeTab = ref('profile')
const loading = ref(false)
const saving = ref(false)

const showSuccess = ref(false)
const showError = ref(false)

const successMessage = ref('Settings saved successfully.')
const errorMessage = ref('Something went wrong.')

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

const applySettings = (settings) => {
  if (!settings) return

  profile.value = {
    ...profile.value,
    ...(settings.profile || {})
  }

  system.value = {
    ...system.value,
    ...(settings.system || {})
  }

  attendance.value = {
    ...attendance.value,
    ...(settings.attendance || {})
  }

  payroll.value = {
    ...payroll.value,
    ...(settings.payroll || {})
  }

  departments.value = settings.departments || departments.value
  positions.value = settings.positions || positions.value
}

const fetchSettings = async () => {
  loading.value = true

  try {
    const response = await apiFetch('/settings')

    applySettings(response.settings)
  } catch (error) {
    console.error(error)
    showToast('error', 'Failed to load settings.')
  } finally {
    loading.value = false
  }
}


const saveSettings = async () => {
  if (saving.value) return

  saving.value = true

  try {
    await apiFetch('/settings', {
      method: 'PUT',
      body: {
        profile: profile.value,
        system: system.value,
        attendance: attendance.value,
        payroll: payroll.value,
        departments: departments.value,
        positions: positions.value
      }
    })

    showToast('success', 'Settings saved successfully.')
  } catch (error) {
    console.error(error)
    showToast('error', 'Failed to save settings.')
  } finally {
    saving.value = false
  }
}

const showToast = (type, message) => {
  showSuccess.value = false
  showError.value = false

  if (type === 'success') {
    successMessage.value = message
    showSuccess.value = true
  } else {
    errorMessage.value = message
    showError.value = true
  }

  setTimeout(() => {
    showSuccess.value = false
    showError.value = false
  }, 2500)
}

onMounted(() => {
  fetchSettings()
})
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

.save-alert.error {
  background: #dc3545;
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