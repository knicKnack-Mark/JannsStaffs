<template>
  <section class="attendance-filters mb-4">
    <div class="filters-card">
<div class="filters-main">
  <!-- SEARCH -->
  <div class="filter-field search-field">
    <label>Search Staff</label>

    <div class="input-icon-wrap">
      <Icon
        name="solar:magnifer-bold-duotone"
        size="20"
        class="field-icon"
      />

      <input
        :value="search"
        type="text"
        class="form-control filter-control"
        placeholder="Search staff name..."
        @input="$emit('update:search', $event.target.value)"
      >
    </div>
  </div>

  <!-- DATE -->
  <div class="filter-field date-field">
    <label>Attendance Date</label>

    <div class="input-icon-wrap">
      <Icon
        name="solar:calendar-bold-duotone"
        size="20"
        class="field-icon"
      />

      <input
        :value="selectedDate"
        type="date"
        class="form-control filter-control"
        @input="$emit('update:selectedDate', $event.target.value)"
      >
    </div>
  </div>

  <!-- STATUS -->
  <div class="filter-field status-field">
    <label>Status</label>

    <div class="input-icon-wrap">
      <Icon
        name="solar:filter-bold-duotone"
        size="20"
        class="field-icon"
      />

      <select
        :value="selectedStatus"
        class="form-select filter-control"
        @change="$emit('update:selectedStatus', $event.target.value)"
      >
        <option value="All">All Status</option>
        <option value="Present">Present</option>
        <option value="Late">Late</option>
        <option value="Absent">Absent</option>
        <option value="Half Day">Half Day</option>
      </select>
    </div>
  </div>
</div>

      <!-- PRINT / EXPORT BUTTONS FROM attendance.vue -->
      <div class="filters-actions">
        <slot name="actions" />
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
.attendance-filters {
  width: 100%;
}

.filters-card {
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  padding: 18px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.filters-main {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(420px, 2fr) minmax(280px, 1.2fr) 220px;
  gap: 14px;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-field label {
  font-size: 13px;
  font-weight: 800;
  color: #475467;
}

.input-icon-wrap {
  position: relative;
}

.field-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
}

.filter-control {
  min-height: 46px;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding-left: 44px;
  font-weight: 700;
  color: #344054;
  box-shadow: none;
}

.filter-control:focus {
  border-color: rgba(15, 118, 110, 0.45);
  box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.08);
}

.filters-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.search-field {
  width: 100%;
}

.search-field .input-icon-wrap,
.search-field .filter-control {
  width: 100%;
}

/* RESPONSIVE */
@media (max-width: 1200px) {
  .filters-card {
    align-items: stretch;
    flex-direction: column;
  }

  .filters-main {
    grid-template-columns: repeat(3, 1fr);
  }

  .filters-actions {
    justify-content: flex-end;
  }
}

@media (max-width: 992px) {
  .filters-main {
    grid-template-columns: 1fr;
  }

  .filters-actions {
    width: 100%;
  }

  .filters-actions :deep(.btn) {
    flex: 1;
  }
}

@media (max-width: 576px) {
  .filters-card {
    border-radius: 20px;
    padding: 14px;
  }

  .filters-actions {
    flex-direction: column;
  }

  .filters-actions :deep(.btn) {
    width: 100%;
  }
}
</style>