<template>
  <section class="logs-card mt-4">
    <div class="table-header">
      <div>
        <h5 class="fw-bold mb-1">
          Recent Attendance Activity
        </h5>

        <p class="text-muted mb-0">
          Latest attendance actions made today.
        </p>
      </div>

      <div class="logs-icon">
        <Icon
          name="solar:history-bold-duotone"
          size="24"
        />
      </div>
    </div>

    <div
      v-if="logs.length"
      class="logs-list"
    >
      <div
        v-for="log in logs"
        :key="log.id"
        class="log-item"
      >
        <div
          class="log-icon"
          :class="log.color"
        >
          <Icon
            :name="log.icon"
            size="22"
          />
        </div>

        <div>
          <h6 class="fw-bold mb-0">
            {{ log.title }}
          </h6>

          <small class="text-muted">
            {{ log.time }}
          </small>
        </div>
      </div>
    </div>

    <div
      v-else
      class="empty-logs"
    >
      No recent attendance activity yet.
    </div>
  </section>
</template>

<script setup>
defineProps({
  logs: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.logs-card {
  background: white;
  border-radius: 26px;
  overflow: hidden;
  padding-bottom: 6px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.table-header {
  padding: 22px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid #eef2f7;
}

.logs-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: rgba(20, 139, 128, 0.12);
  color: #148b80;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logs-list {
  padding: 0 24px 10px;
}

.log-item {
  padding: 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.log-item:last-child {
  border-bottom: none;
}

.log-icon {
  width: 44px;
  height: 44px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.log-icon.green {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.log-icon.blue {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

.log-icon.red {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.log-icon.orange {
  background: rgba(249, 115, 22, 0.12);
  color: #f97316;
}

.empty-logs {
  margin: 0 24px 20px;
  padding: 18px;
  border-radius: 18px;
  background: #f4f8f7;
  color: #64748b;
}

@media (max-width: 767px) {
  .table-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>