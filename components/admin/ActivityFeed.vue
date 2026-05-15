<template>
  <div class="dashboard-card">
    <h5 class="fw-bold mb-4">
      Recent Activities
    </h5>

    <div
      v-for="activity in activities"
      :key="activity.title"
      class="activity-item"
    >
      <div
        class="activity-icon"
        :class="activity.color"
      >
        <Icon
          :name="activity.icon"
          size="18"
        />
      </div>

      <div>
        <h6>
          {{ activity.title }}
        </h6>

        <small>
          {{ activity.time }}
        </small>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activities: Array
})
</script>

<style scoped>
.dashboard-card {
  background: white;

  border-radius: 28px;

  padding: 28px;

  box-shadow:
    0 15px 35px rgba(0,0,0,0.06);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 16px;

  border-radius: 18px;

  background: #f8fbfa;

  margin-bottom: 16px;
}

.activity-icon {
  width: 46px;
  height: 46px;

  border-radius: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
}

.green {
  background: #16a34a;
}

.blue {
  background: #3b82f6;
}

.red {
  background: #ef4444;
}
</style>