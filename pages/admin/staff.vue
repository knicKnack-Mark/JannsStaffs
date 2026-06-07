<template>
  <div class="staff-page">
    <!-- SUMMARY CARDS -->
    <section class="mb-4 scroll-animate">
      <div class="row g-4">
        <div
          v-for="(card, index) in summaryCards"
          :key="card.title"
          class="col-12 col-sm-6 col-xl-3 scroll-animate"
          :style="{ transitionDelay: `${index * 0.08}s` }"
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
    <div class="scroll-animate">
      <AdminPageToolbar
        title="Staff Directory"
        subtitle="View staff profiles, positions, salary type, and attendance status."
      >
        <template #actions>
          <button
            class="btn toolbar-btn toolbar-btn-primary"
            type="button"
            @click="openAddStaffModal"
          >
            <Icon name="solar:user-plus-bold-duotone" size="20" />
            <span>Add Staff</span>
          </button>
        </template>
      </AdminPageToolbar>
    </div>

    <!-- FILTERS -->
    <section class="filter-card mb-4 scroll-animate">
      <div class="row g-3 align-items-center">
        <div class="col-12 col-lg-6">
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
              placeholder="Search staff name, position, or phone..."
            />
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
          <select
            v-model="selectedStatus"
            class="form-select staff-select"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
          <select
            v-model="selectedSalaryType"
            class="form-select staff-select"
          >
            <option value="All">All Salary Types</option>
            <option value="Monthly">Monthly</option>
            <option value="Daily">Daily</option>
          </select>
        </div>
      </div>
    </section>

    <!-- STAFF CARDS -->
    <section>
      <TransitionGroup
        name="staff-list"
        tag="div"
        class="row g-4"
      >
        <div
          v-for="(staff, index) in filteredStaff"
          :key="staff.id"
          class="col-12 col-sm-6 col-xl-4 col-xxl-3 scroll-animate"
          :style="{ transitionDelay: `${index * 0.06}s` }"
        >
          <AdminStaffCard
            :staff="staff"
            @time-in="markTimeIn"
            @mark-absent="markAbsent"
            @toggle-status="toggleStatus"
            @edit-staff="openEditStaffModal"
          />
        </div>

        <div
          v-if="filteredStaff.length === 0"
          key="empty"
          class="col-12 scroll-animate"
        >
          <div class="empty-card">
            <Icon
              name="solar:users-group-rounded-bold-duotone"
              size="44"
            />

            <h5 class="fw-bold mt-3">
              No staff found
            </h5>

            <p class="text-muted mb-0">
              Try changing your search or filter.
            </p>
          </div>
        </div>
      </TransitionGroup>
    </section>

    <!-- ADD STAFF MODAL COMPONENT -->
    <AdminStaffFormModal
      :show="showAddStaffModal"
      @close="closeAddStaffModal"
      @save="addStaff"
    />

    <!-- EDIT STAFF MODAL -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showEditStaffModal"
          class="custom-modal-backdrop"
          @click.self="closeEditStaffModal"
        >
          <div class="custom-modal-card">
            <div class="modal-header-custom">
              <div>
                <h5 class="fw-bold mb-1">
                  Update Staff
                </h5>

                <p class="text-muted mb-0">
                  Edit staff profile, salary, and status.
                </p>
              </div>

              <button
                type="button"
                class="modal-close-btn"
                @click="closeEditStaffModal"
              >
                <Icon
                  name="solar:close-circle-bold-duotone"
                  size="24"
                />
              </button>
            </div>

            <form @submit.prevent="updateStaff">
              <div class="row g-3 mt-2">
                <div class="col-12">
                  <label class="form-label">Full Name</label>
                  <input
                    v-model="editForm.name"
                    type="text"
                    class="form-control modal-input"
                    required
                  />
                </div>

                <div class="col-12">
                  <label class="form-label">Position</label>
                  <input
                    v-model="editForm.position"
                    type="text"
                    class="form-control modal-input"
                    required
                  />
                </div>

                <div class="col-12">
                  <label class="form-label">Phone</label>
                  <input
                    v-model="editForm.phone"
                    type="text"
                    class="form-control modal-input"
                    required
                  />
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Salary Type</label>
                  <select
                    v-model="editForm.salaryType"
                    class="form-select modal-input"
                    required
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">
                    {{ editForm.salaryType === 'Monthly' ? 'Monthly Salary' : 'Daily Rate' }}
                  </label>

                  <input
                    v-if="editForm.salaryType === 'Monthly'"
                    v-model.number="editForm.monthlySalary"
                    type="number"
                    class="form-control modal-input"
                    required
                  />

                  <input
                    v-else
                    v-model.number="editForm.dailyRate"
                    type="number"
                    class="form-control modal-input"
                    required
                  />
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Status</label>
                  <select
                    v-model="editForm.status"
                    class="form-select modal-input"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Staff Photo</label>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      class="form-control modal-input"
                      @change="handleAvatarUpload"
                    />
                </div>
              </div>

              <div class="modal-actions mt-4">
                <button
                  type="button"
                  class="btn cancel-btn"
                  @click="closeEditStaffModal"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  class="btn save-btn"
                >
                  <Icon
                    name="solar:diskette-bold-duotone"
                    size="18"
                  />

                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { useToast } from 'vue-toastification'

definePageMeta({
  title: 'Staff',
  subtitle: 'Manage staff attendance, records, and status'
})

const { apiFetch } = useApi()
const toast = useToast()

const search = ref('')
const selectedStatus = ref('All')
const selectedSalaryType = ref('All')
const showAddStaffModal = ref(false)
const showEditStaffModal = ref(false)
const loading = ref(false)

let observer = null

const editForm = ref({
  id: null,
  name: '',
  position: '',
  phone: '',
  salaryType: 'Monthly',
  monthlySalary: 0,
  dailyRate: 0,
  status: 'Active',
  avatar: null
})

const staffList = ref([])

const normalizeStaff = (staff) => ({
  id: staff.id,
  name: staff.name,
  position: staff.position,
  phone: staff.phone,
  salaryType: staff.salary_type,
  monthlySalary: staff.monthly_salary,
  dailyRate: staff.daily_rate,
  status: staff.status,
  attendance: staff.attendance,
  avatar: staff.avatar
})

const buildFormData = (form) => {
  const formData = new FormData()

  formData.append('name', form.name)
  formData.append('position', form.position)
  formData.append('phone', form.phone || '')
  formData.append('salary_type', form.salaryType)
  formData.append('status', form.status)

  if (form.salaryType === 'Monthly') {
    formData.append('monthly_salary', form.monthlySalary || 0)
    formData.append('daily_rate', '')
  } else {
    formData.append('daily_rate', form.dailyRate || 0)
    formData.append('monthly_salary', '')
  }

  if (form.avatar instanceof File) {
    formData.append('avatar', form.avatar)
  }

  return formData
}

const handleAvatarUpload = (event) => {
  const file = event.target.files?.[0]

  if (file) {
    editForm.value.avatar = file
  }
}

const fetchStaff = async () => {
  try {
    loading.value = true

    const res = await apiFetch('/staff')
    staffList.value = (res.data || []).map(normalizeStaff)

    await observeScrollItems()
  } catch (err) {
    console.error(err)
    toast.error(err?.data?.message || 'Failed to load staff.')
  } finally {
    loading.value = false
  }
}

const filteredStaff = computed(() => {
  const keyword = search.value.toLowerCase()

  return staffList.value.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(keyword) ||
      staff.position.toLowerCase().includes(keyword) ||
      staff.phone?.toLowerCase().includes(keyword)

    const matchesStatus =
      selectedStatus.value === 'All' ||
      staff.status === selectedStatus.value

    const matchesSalaryType =
      selectedSalaryType.value === 'All' ||
      staff.salaryType === selectedSalaryType.value

    return matchesSearch && matchesStatus && matchesSalaryType
  })
})

const summaryCards = computed(() => {
  const total = staffList.value.length
  const active = staffList.value.filter(staff => staff.status === 'Active').length
  const monthly = staffList.value.filter(staff => staff.salaryType === 'Monthly').length
  const daily = staffList.value.filter(staff => staff.salaryType === 'Daily').length
  const present = staffList.value.filter(staff => staff.attendance === 'Present').length

  return [
    {
      title: 'Total Staff',
      value: total,
      description: `${active} active employees`,
      icon: 'solar:users-group-rounded-bold-duotone',
      color: 'green'
    },
    {
      title: 'Monthly Staff',
      value: monthly,
      description: 'Fixed monthly salary',
      icon: 'solar:wallet-money-bold-duotone',
      color: 'blue'
    },
    {
      title: 'Daily Staff',
      value: daily,
      description: 'Paid by daily rate',
      icon: 'solar:calendar-date-bold-duotone',
      color: 'orange'
    },
    {
      title: 'Present Today',
      value: present,
      description: 'Currently on duty',
      icon: 'solar:user-check-bold-duotone',
      color: 'green'
    }
  ]
})

const observeScrollItems = async () => {
  await nextTick()

  const animatedItems = document.querySelectorAll('.scroll-animate:not(.show)')

  animatedItems.forEach((item) => {
    if (observer) {
      observer.observe(item)
    }
  })
}

onMounted(async () => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 }
  )

  await fetchStaff()
})

watch(
  filteredStaff,
  async () => {
    await observeScrollItems()
  },
  { deep: true }
)

const openAddStaffModal = () => {
  showAddStaffModal.value = true
}

const closeAddStaffModal = () => {
  showAddStaffModal.value = false
}

const openEditStaffModal = (staff) => {
  editForm.value = {
    id: staff.id,
    name: staff.name,
    position: staff.position,
    phone: staff.phone,
    salaryType: staff.salaryType,
    monthlySalary: staff.monthlySalary || 0,
    dailyRate: staff.dailyRate || 0,
    status: staff.status,
    avatar: null
  }

  showEditStaffModal.value = true
}

const closeEditStaffModal = () => {
  showEditStaffModal.value = false

  editForm.value = {
    id: null,
    name: '',
    position: '',
    phone: '',
    salaryType: 'Monthly',
    monthlySalary: 0,
    dailyRate: 0,
    status: 'Active',
    avatar: null
  }
}

const addStaff = async (form) => {
  try {
    const payload = buildFormData(form)

    const res = await apiFetch('/staff', {
      method: 'POST',
      body: payload
    })

    staffList.value.unshift(normalizeStaff(res.data))
    closeAddStaffModal()
    toast.success(res.message)
  } catch (err) {
    console.error(err)
    toast.error(err?.data?.message || 'Failed to add staff.')
  }
}

const updateStaff = async () => {
  try {
    const payload = buildFormData(editForm.value)
    payload.append('_method', 'PUT')

    const res = await apiFetch(`/staff/${editForm.value.id}`, {
      method: 'POST',
      body: payload
    })

    const index = staffList.value.findIndex(staff => staff.id === editForm.value.id)

    if (index !== -1) {
      staffList.value[index] = normalizeStaff(res.data)
    }

    closeEditStaffModal()
    toast.success(res.message)
  } catch (err) {
    console.error(err)
    toast.error(err?.data?.message || 'Failed to update staff.')
  }
}

const updateStaffField = async (staff, payload) => {
  try {
    const res = await apiFetch(`/staff/${staff.id}`, {
      method: 'PATCH',
      body: payload
    })

    const index = staffList.value.findIndex(item => item.id === staff.id)

    if (index !== -1) {
      staffList.value[index] = normalizeStaff(res.data)
    }

    toast.success(res.message)
  } catch (err) {
    console.error(err)
    toast.error(err?.data?.message || 'Failed to update staff.')
  }
}

const markTimeIn = async (staff) => {
  await updateStaffField(staff, {
    attendance: 'Present'
  })
}

const markAbsent = async (staff) => {
  await updateStaffField(staff, {
    attendance: 'Absent'
  })
}

const toggleStatus = async (staff) => {
  const newStatus = staff.status === 'Active' ? 'Inactive' : 'Active'

  await updateStaffField(staff, {
    status: newStatus,
    attendance: newStatus === 'Inactive'
      ? 'Not Timed In'
      : staff.attendance
  })
}
</script>

<style scoped>
.staff-page {
  padding-bottom: 24px;
}

/* SCROLL ANIMATION */
.scroll-animate {
  opacity: 0;
  transform: translateY(32px) scale(0.98);
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.scroll-animate.show {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* SMOOTH FILTERED STAFF ANIMATION */
.staff-list-enter-active,
.staff-list-leave-active {
  transition: all 0.35s ease;
}

.staff-list-enter-from,
.staff-list-leave-to {
  opacity: 0;
  transform: translateY(18px) scale(0.96);
}

.staff-list-move {
  transition: transform 0.35s ease;
}

/* COMPONENT HOVER FEEL */
:deep(.card),
:deep(.analytics-card),
:deep(.staff-card) {
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

:deep(.card:hover),
:deep(.analytics-card:hover),
:deep(.staff-card:hover) {
  transform: translateY(-3px);
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
  transition: 0.25s ease;
}

.staff-search {
  padding-left: 50px;
}

.staff-search:focus,
.staff-select:focus {
  background: #f4f8f7;
  box-shadow: 0 0 0 3px rgba(20, 139, 128, 0.12);
  transform: translateY(-1px);
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
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

/* EDIT MODAL */
.custom-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.custom-modal-card {
  width: min(100%, 620px);
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24);
  animation: modalPop 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modalPop {
  0% {
    opacity: 0;
    transform: translateY(18px) scale(0.94);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header-custom {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.modal-close-btn {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 14px;
  background: #f4f8f7;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.25s ease;
}

.modal-close-btn:hover {
  transform: translateY(-2px);
  background: #e8f3f1;
  color: #148b80;
}

.modal-input {
  height: 50px;
  border: none;
  border-radius: 16px;
  background: #f4f8f7;
  transition: 0.25s ease;
}

.modal-input:focus {
  background: #f4f8f7;
  box-shadow: 0 0 0 3px rgba(20, 139, 128, 0.12);
  transform: translateY(-1px);
}

.form-label {
  color: #334155;
  font-size: 0.85rem;
  font-weight: 800;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn,
.save-btn {
  height: 46px;
  border-radius: 15px;
  padding: 0 18px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: 0.25s ease;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
}

.cancel-btn:hover {
  transform: translateY(-2px);
  background: #e2e8f0;
  color: #334155;
}

.save-btn {
  background: linear-gradient(180deg, #0b5b54, #148b80);
  color: white;
}

.save-btn:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(20, 139, 128, 0.25);
}

.save-btn:active,
.cancel-btn:active,
.modal-close-btn:active {
  transform: scale(0.97);
}

/* RESPONSIVE */
@media (max-width: 767px) {
  .staff-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .add-staff-btn {
    width: 100%;
    justify-content: center;
  }

  .modal-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
    justify-content: center;
  }
}

/* REDUCE MOTION */
@media (prefers-reduced-motion: reduce) {
  .scroll-animate,
  .custom-modal-card {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
    transition: none !important;
  }

  .staff-list-enter-active,
  .staff-list-leave-active,
  .staff-list-move,
  :deep(.card),
  :deep(.analytics-card),
  :deep(.staff-card),
  .staff-search,
  .staff-select,
  .modal-input,
  .modal-close-btn,
  .cancel-btn,
  .save-btn {
    transition: none !important;
  }

  :deep(.card:hover),
  :deep(.analytics-card:hover),
  :deep(.staff-card:hover),
  .staff-search:focus,
  .staff-select:focus,
  .modal-input:focus,
  .modal-close-btn:hover,
  .cancel-btn:hover,
  .save-btn:hover {
    transform: none !important;
  }
}
</style>