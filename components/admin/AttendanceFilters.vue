<template>
  <section class="mb-4">
    <div class="attendance-filter-card">
      <div class="row g-3">
        <!-- DATE -->
        <div class="col-12 col-lg-4">
          <label class="form-label">
            Attendance Date
          </label>

          <div class="filter-input">
            <span class="filter-icon">
              <Icon
                name="solar:calendar-bold-duotone"
                size="20"
              />
            </span>

            <input
              :value="selectedDate"
              type="date"
              class="form-control"
              @input="$emit('update:selectedDate', $event.target.value)"
            >
          </div>
        </div>

        <!-- SEARCH -->
        <div class="col-12 col-lg-4">
          <label class="form-label">
            Search Staff
          </label>

          <div class="filter-input">
            <span class="filter-icon">
              <Icon
                name="solar:magnifer-bold-duotone"
                size="20"
              />
            </span>

            <input
              :value="search"
              type="text"
              class="form-control"
              placeholder="Search name, position, department..."
              @input="$emit('update:search', $event.target.value)"
            >
          </div>
        </div>

        <!-- STATUS -->
        <div class="col-12 col-lg-4">
          <label class="form-label">
            Status
          </label>

          <div class="filter-input">
            <span class="filter-icon">
              <Icon
                name="solar:filter-bold-duotone"
                size="20"
              />
            </span>

            <select
              :value="selectedStatus"
              class="form-select"
              @change="$emit('update:selectedStatus', $event.target.value)"
            >
              <option value="All">
                All Status
              </option>
              <option value="Pending">
                Pending
              </option>
              <option value="On Time">
                On Time
              </option>
              <option value="Late">
                Late
              </option>
              <option value="Undertime">
                Undertime
              </option>
              <option value="Half Day">
                Half Day
              </option>
              <option value="Absent">
                Absent
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  selectedDate: {
    type: String,
    default: ''
  },
  search: {
    type: String,
    default: ''
  },
  selectedStatus: {
    type: String,
    default: 'All'
  }
})

defineEmits([
  'update:selectedDate',
  'update:search',
  'update:selectedStatus'
])
</script>

<style scoped>
.attendance-filter-card {
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.form-label {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 800;
  color: #182230;
}

.filter-input {
  position: relative;
  width: 100%;
}

.filter-icon {
  position: absolute;
  top: 50%;
  left: 16px;
  z-index: 3;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  color: #667085;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.filter-input .form-control,
.filter-input .form-select {
  width: 100%;
  min-height: 52px;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding-left: 50px;
  padding-right: 18px;
  font-size: 15px;
  font-weight: 600;
  color: #182230;
  background-color: #ffffff;
}

.filter-input .form-select {
  cursor: pointer;
}

.filter-input .form-control::placeholder {
  color: #667085;
  font-weight: 500;
}

.filter-input .form-control:focus,
.filter-input .form-select:focus {
  border-color: #0f766e;
  box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.12);
}

@media (max-width: 991px) {
  .attendance-filter-card {
    padding: 18px;
  }
}
</style>