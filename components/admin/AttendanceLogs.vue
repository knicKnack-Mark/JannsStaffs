<template>
  <section>
    <div class="attendance-logs-card">
      <div class="logs-header">
        <div>
          <h5>Attendance Activity Logs</h5>
          <p>Latest actions made in today’s attendance.</p>
        </div>

        <span class="logs-count">
          {{ logs.length }} log(s)
        </span>
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
            :class="getLogClass(log.type)"
          >
            <Icon
              :name="getLogIcon(log.type)"
              size="20"
            />
          </div>

          <div>
            <h6>{{ log.message }}</h6>
            <span>{{ log.time }}</span>
          </div>
        </div>
      </div>

      <div
        v-else
        class="empty-logs"
      >
        <Icon
          name="solar:clipboard-list-bold-duotone"
          size="44"
        />
        <h6>No activity logs yet</h6>
        <p>Attendance actions will appear here.</p>
      </div>
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

const getLogClass = (type) => {
  const classes = {
    success: 'log-success',
    danger: 'log-danger',
    warning: 'log-warning',
    info: 'log-info'
  }

  return classes[type] || 'log-info'
}

const getLogIcon = (type) => {
  const icons = {
    success: 'solar:check-circle-bold-duotone',
    danger: 'solar:close-circle-bold-duotone',
    warning: 'solar:danger-triangle-bold-duotone',
    info: 'solar:info-circle-bold-duotone'
  }

  return icons[type] || 'solar:info-circle-bold-duotone'
}
</script>

<style scoped>
.attendance-logs-card {
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 22px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.logs-header h5 {
  font-weight: 800;
  margin-bottom: 4px;
  color: #182230;
}

.logs-header p {
  margin-bottom: 0;
  color: #667085;
  font-size: 14px;
}

.logs-count {
  background: #f2f4f7;
  color: #344054;
  font-weight: 800;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
}

.logs-list {
  display: grid;
  gap: 12px;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.log-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

.log-success {
  background: #dcfce7;
  color: #15803d;
}

.log-danger {
  background: #fee2e2;
  color: #b91c1c;
}

.log-warning {
  background: #fef3c7;
  color: #b45309;
}

.log-info {
  background: #dbeafe;
  color: #1d4ed8;
}

.log-item h6 {
  margin-bottom: 4px;
  font-weight: 800;
  color: #182230;
}

.log-item span {
  font-size: 13px;
  color: #667085;
}

.empty-logs {
  text-align: center;
  padding: 36px 20px;
  color: #98a2b3;
}

.empty-logs h6 {
  margin-top: 12px;
  font-weight: 800;
  color: #344054;
}

.empty-logs p {
  margin-bottom: 0;
  color: #667085;
}
</style>