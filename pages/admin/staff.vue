<template>
  <div class="staff-page">
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
    <section class="staff-toolbar mb-4">
      <div>
        <h5 class="fw-bold mb-1">
          Staff Directory
        </h5>

        <p class="text-muted mb-0">
          View staff profiles, positions, salary type, and attendance status.
        </p>
      </div>

      <button
        class="btn add-staff-btn"
        type="button"
        @click="openAddStaffModal"
      >
        <Icon
          name="solar:user-plus-bold-duotone"
          size="20"
        />

        <span>Add Staff</span>
      </button>
    </section>

    <!-- FILTERS -->
    <section class="filter-card mb-4">
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
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
          <select
            v-model="selectedSalaryType"
            class="form-select staff-select"
          >
            <option value="All">
              All Salary Types
            </option>

            <option value="Monthly">
              Monthly
            </option>

            <option value="Daily">
              Daily
            </option>
          </select>
        </div>
      </div>
    </section>

    <!-- STAFF CARDS -->
    <section>
      <div class="row g-4">
        <div
          v-for="staff in filteredStaff"
          :key="staff.id"
          class="col-12 col-sm-6 col-xl-4 col-xxl-3"
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
          class="col-12"
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
      </div>
    </section>

    <!-- ADD STAFF MODAL COMPONENT -->
    <AdminStaffFormModal
      :show="showAddStaffModal"
      @close="closeAddStaffModal"
      @save="addStaff"
    />

    <!-- EDIT STAFF MODAL -->
    <Teleport to="body">
      <div
        v-if="showEditStaffModal"
        class="custom-modal-backdrop"
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
                  <option value="Monthly">
                    Monthly
                  </option>

                  <option value="Daily">
                    Daily
                  </option>
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
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label">Avatar URL</label>
                <input
                  v-model="editForm.avatar"
                  type="text"
                  class="form-control modal-input"
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
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

definePageMeta({
  title: 'Staff',
  subtitle: 'Manage staff attendance, records, and status'
})

const search = ref('')
const selectedStatus = ref('All')
const selectedSalaryType = ref('All')
const showAddStaffModal = ref(false)
const showEditStaffModal = ref(false)

const editForm = ref({
  id: null,
  name: '',
  position: '',
  phone: '',
  salaryType: 'Monthly',
  monthlySalary: 0,
  dailyRate: 0,
  status: 'Active',
  avatar: ''
})

const staffList = ref([
  {
    id: 1001,
    name: 'Maria Santos',
    position: 'Front Desk Officer',
    phone: '0917 123 4567',
    salaryType: 'Monthly',
    monthlySalary: 18000,
    dailyRate: null,
    status: 'Active',
    attendance: 'Present',
    avatar: 'https://i.pravatar.cc/300?img=32'
  },
  {
    id: 1002,
    name: 'Juan Dela Cruz',
    position: 'Pool Attendant',
    phone: '0918 234 5678',
    salaryType: 'Daily',
    monthlySalary: null,
    dailyRate: 600,
    status: 'Active',
    attendance: 'Not Timed In',
    avatar: 'https://i.pravatar.cc/300?img=12'
  },
  {
    id: 1003,
    name: 'Ana Reyes',
    position: 'Housekeeping Staff',
    phone: '0919 345 6789',
    salaryType: 'Daily',
    monthlySalary: null,
    dailyRate: 580,
    status: 'Active',
    attendance: 'Absent',
    avatar: 'https://i.pravatar.cc/300?img=45'
  },
  {
    id: 1004,
    name: 'Carlo Mendoza',
    position: 'Maintenance Worker',
    phone: '0920 456 7890',
    salaryType: 'Monthly',
    monthlySalary: 20000,
    dailyRate: null,
    status: 'Inactive',
    attendance: 'Not Timed In',
    avatar: 'https://i.pravatar.cc/300?img=15'
  },
  {
    id: 1005,
    name: 'Liza Aquino',
    position: 'Cashier',
    phone: '0921 567 8901',
    salaryType: 'Monthly',
    monthlySalary: 17000,
    dailyRate: null,
    status: 'Active',
    attendance: 'Present',
    avatar: 'https://i.pravatar.cc/300?img=26'
  },
  {
    id: 1006,
    name: 'Ramon Garcia',
    position: 'Security Guard',
    phone: '0922 678 9012',
    salaryType: 'Daily',
    monthlySalary: null,
    dailyRate: 750,
    status: 'Active',
    attendance: 'Not Timed In',
    avatar: 'https://i.pravatar.cc/300?img=53'
  }
])

const filteredStaff = computed(() => {
  const keyword = search.value.toLowerCase()

  return staffList.value.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(keyword) ||
      staff.position.toLowerCase().includes(keyword) ||
      staff.phone.toLowerCase().includes(keyword)

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
    avatar: staff.avatar
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
    avatar: ''
  }
}

const addStaff = (form) => {
  const newId = staffList.value.length
    ? Math.max(...staffList.value.map(staff => staff.id)) + 1
    : 1001

  const newStaff = {
    id: newId,
    name: form.name,
    position: form.position,
    phone: form.phone,
    salaryType: form.salaryType,
    monthlySalary: form.salaryType === 'Monthly' ? Number(form.monthlySalary || 0) : null,
    dailyRate: form.salaryType === 'Daily' ? Number(form.dailyRate || 0) : null,
    status: form.status,
    attendance: 'Not Timed In',
    avatar: `https://i.pravatar.cc/300?img=${form.avatar}`
  }

  staffList.value.unshift(newStaff)
  closeAddStaffModal()
}

const updateStaff = () => {
  const index = staffList.value.findIndex(staff => staff.id === editForm.value.id)

  if (index === -1) {
    return
  }

  staffList.value[index] = {
    ...staffList.value[index],
    name: editForm.value.name,
    position: editForm.value.position,
    phone: editForm.value.phone,
    salaryType: editForm.value.salaryType,
    monthlySalary: editForm.value.salaryType === 'Monthly'
      ? Number(editForm.value.monthlySalary || 0)
      : null,
    dailyRate: editForm.value.salaryType === 'Daily'
      ? Number(editForm.value.dailyRate || 0)
      : null,
    status: editForm.value.status,
    avatar: editForm.value.avatar || staffList.value[index].avatar,
    attendance: editForm.value.status === 'Inactive'
      ? 'Not Timed In'
      : staffList.value[index].attendance
  }

  closeEditStaffModal()
}

const markTimeIn = (staff) => {
  staff.attendance = 'Present'
}

const markAbsent = (staff) => {
  staff.attendance = 'Absent'
}

const toggleStatus = (staff) => {
  staff.status = staff.status === 'Active' ? 'Inactive' : 'Active'

  if (staff.status === 'Inactive') {
    staff.attendance = 'Not Timed In'
  }
}
</script>

<style scoped>
.staff-page {
  padding-bottom: 24px;
}

/* TOOLBAR */
.staff-toolbar {
  background: white;

  border-radius: 26px;

  padding: 22px 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;

  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.add-staff-btn {
  height: 48px;

  border-radius: 16px;

  padding: 0 18px;

  background: linear-gradient(180deg, #0b5b54, #148b80);

  color: white;

  display: flex;
  align-items: center;
  gap: 8px;

  border: none;
}

.add-staff-btn:hover {
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
}

.custom-modal-card {
  width: min(100%, 620px);
  max-height: 90vh;
  overflow-y: auto;

  background: white;

  border-radius: 28px;

  padding: 24px;

  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24);
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
}

.modal-input {
  height: 50px;

  border: none;

  border-radius: 16px;

  background: #f4f8f7;
}

.modal-input:focus {
  background: #f4f8f7;
  box-shadow: 0 0 0 3px rgba(20, 139, 128, 0.12);
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
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
}

.save-btn {
  background: linear-gradient(180deg, #0b5b54, #148b80);
  color: white;
}

.save-btn:hover {
  color: white;
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
</style>