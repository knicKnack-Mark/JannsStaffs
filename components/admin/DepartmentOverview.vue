<template>
  <div class="dashboard-card">
    <h5 class="fw-bold mb-4">
      Department Overview
    </h5>

    <div
      v-for="department in departments"
      :key="department.name"
      class="department-item"
    >
      <div class="d-flex justify-content-between mb-2">
        <span>{{ department.name }}</span>

        <strong>{{ department.staff }}</strong>
      </div>

      <div class="progress custom-progress">
        <div
          class="progress-bar"
          :style="{ width: department.percent + '%' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const departments = [
  {
    name: 'Housekeeping',
    staff: 12,
    percent: 85
  },

  {
    name: 'Kitchen',
    staff: 8,
    percent: 60
  },

  {
    name: 'Security',
    staff: 5,
    percent: 40
  },

  {
    name: 'Front Desk',
    staff: 9,
    percent: 72
  }
]
</script>

<style scoped>
.dashboard-card {
  background: white;
  border-radius: 28px;
  padding: 28px;
}

.department-item {
  margin-bottom: 24px;
}

.custom-progress {
  height: 12px;
  border-radius: 30px;

  background: #edf3f2;
}

.progress-bar {
  background: linear-gradient(
    to right,
    #148b80,
    #41d8c6
  );

  border-radius: 30px;
}
</style>