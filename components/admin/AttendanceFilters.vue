<template>
  <section class="filter-card mb-4">
    <div class="row g-3 align-items-center">
      <div class="col-12 col-lg-4">
        <label class="form-label">Attendance Date</label>

        <input
          :value="selectedDate"
          type="date"
          class="form-control staff-select"
          @input="$emit('update:selectedDate', $event.target.value)"
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
            :value="search"
            type="text"
            class="form-control staff-search"
            placeholder="Search staff name or position..."
            @input="$emit('update:search', $event.target.value)"
          />
        </div>
      </div>

      <div class="col-12 col-lg-3">
        <label class="form-label">Status</label>

        <select
          :value="selectedStatus"
          class="form-select staff-select"
          @change="$emit('update:selectedStatus', $event.target.value)"
        >
          <option value="All">All Status</option>
          <option value="Present">Present</option>
          <option value="No Time Out">No Time Out</option>
          <option value="Late">Late</option>
          <option value="Absent">Absent</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  selectedDate: String,
  search: String,
  selectedStatus: String
})

defineEmits([
  'update:selectedDate',
  'update:search',
  'update:selectedStatus'
])
</script>

<style scoped>
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
</style>