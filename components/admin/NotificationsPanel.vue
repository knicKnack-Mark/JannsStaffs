<template>
  <div class="dashboard-card">
    <h5 class="fw-bold mb-4">
      Notifications
    </h5>

    <div
      v-for="item in notifications"
      :key="item.title"
      class="notification-card"
      :class="item.color"
    >
      <h6>
        {{ item.title }}
      </h6>

      <p>
        {{ item.description }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  notifications: Array
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

.notification-card {
  padding: 18px;

  border-radius: 18px;

  margin-bottom: 18px;
}

.warning {
  background: rgba(249,115,22,0.12);
}

.danger {
  background: rgba(239,68,68,0.12);
}

.success {
  background: rgba(22,163,74,0.12);
}
</style>