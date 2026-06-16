<template>
  <div class="staff-page">
    <AdminResortLoader :show="loading" />

    <!-- SUMMARY CARDS -->
    <section class="mb-4 scroll-animate">
      <div class="row g-4">
        <div
          v-for="(card, index) in safeSummaryCards"
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
          v-for="(staff, index) in safeFilteredStaff"
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
          v-if="!loading && safeFilteredStaff.length === 0"
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

    <!-- REUSABLE STAFF MODAL -->
    <AdminStaffFormModal
      :show="showStaffModal"
      :mode="staffModalMode"
      :staff="selectedStaffForModal"
      :loading="saving"
      @close="closeStaffModal"
      @save="handleSaveStaff"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue'

definePageMeta({
  title: 'Staff',
  subtitle: 'Manage staff attendance, records, and status'
})

const {
  loading,
  saving,
  search,
  selectedStatus,
  selectedSalaryType,
  filteredStaff,
  summaryCards,
  fetchStaff,
  addStaff,
  updateStaff,
  markTimeIn,
  markAbsent,
  toggleStatus
} = useStaff()

const safeFilteredStaff = computed(() => {
  if (Array.isArray(filteredStaff?.value)) {
    return filteredStaff.value
  }

  if (Array.isArray(filteredStaff)) {
    return filteredStaff
  }

  return []
})

const safeSummaryCards = computed(() => {
  if (Array.isArray(summaryCards?.value)) {
    return summaryCards.value
  }

  if (Array.isArray(summaryCards)) {
    return summaryCards
  }

  return []
})

const showStaffModal = ref(false)
const staffModalMode = ref('add')
const selectedStaffForModal = ref(null)

let observer = null

const observeScrollItems = async () => {
  await nextTick()

  if (!process.client) return

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
  await observeScrollItems()
})

watch(
  safeFilteredStaff,
  async () => {
    await observeScrollItems()
  },
  { deep: true }
)

const openAddStaffModal = () => {
  staffModalMode.value = 'add'
  selectedStaffForModal.value = null
  showStaffModal.value = true
}

const openEditStaffModal = (staff) => {
  staffModalMode.value = 'edit'
  selectedStaffForModal.value = staff
  showStaffModal.value = true
}

const closeStaffModal = () => {
  showStaffModal.value = false
  selectedStaffForModal.value = null
}

const handleSaveStaff = async (form) => {
  if (staffModalMode.value === 'edit') {
    await updateStaff(form, closeStaffModal)
    return
  }

  await addStaff(form, closeStaffModal)
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
}

/* REDUCE MOTION */
@media (prefers-reduced-motion: reduce) {
  .scroll-animate {
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
  .staff-select {
    transition: none !important;
  }

  :deep(.card:hover),
  :deep(.analytics-card:hover),
  :deep(.staff-card:hover),
  .staff-search:focus,
  .staff-select:focus {
    transform: none !important;
  }
}
</style>