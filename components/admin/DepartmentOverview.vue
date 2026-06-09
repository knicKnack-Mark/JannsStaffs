<template>
  <div class="dashboard-card">
    <h5 class="fw-bold mb-4">
      Department Overview
    </h5>

    <div v-if="departments.length">
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
            :style="{ width: `${department.percent || 0}%` }"
          />
        </div>
      </div>
    </div>

    <div
      v-else
      class="empty-state"
    >
      No department data yet.
    </div>
  </div>
</template>

<script setup>
defineProps({
  departments: {
    type: Array,
    default: () => []
  }
})
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

.empty-state {
  padding: 18px;
  border-radius: 18px;
  background: #f8fbfa;
  color: #7b8794;
  font-size: 14px;
  font-weight: 600;
}
</style>