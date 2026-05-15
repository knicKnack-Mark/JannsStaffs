<template>
  <div class="dashboard-card">
    <h5 class="fw-bold mb-4">
      Quick Statistics
    </h5>

    <div
      v-for="item in stats"
      :key="item.title"
      class="quick-item"
    >
      <div>
        <small>
          {{ item.title }}
        </small>

        <h6>
          {{ item.value }}
        </h6>
      </div>

      <Icon
        :name="item.icon"
        size="24"
      />
    </div>
  </div>
</template>

<script setup>
const stats = [
  {
    title: 'Payroll Processed',
    value: '₱420,000',
    icon: 'solar:dollar-bold-duotone'
  },

  {
    title: 'Overtime Hours',
    value: '126 hrs',
    icon: 'solar:clock-circle-bold-duotone'
  },

  {
    title: 'On Leave',
    value: '4 Employees',
    icon: 'solar:calendar-bold-duotone'
  },

  {
    title: 'Maintenance Tasks',
    value: '12 Pending',
    icon: 'solar:settings-bold-duotone'
  }
]
</script>

<style scoped>
.dashboard-card {
  background: white;
  border-radius: 28px;
  padding: 28px;
}

.quick-item {
  background: #f8fbfa;

  padding: 18px;

  border-radius: 18px;

  margin-bottom: 18px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>