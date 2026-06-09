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
defineProps({
  stats: {
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