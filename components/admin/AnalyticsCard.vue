<template>
  <div class="analytics-card">
    <div
      class="analytics-icon"
      :class="iconColorClass"
    >
      <Icon
        :name="icon || defaultIcon"
        size="34"
      />
    </div>

    <div>
      <small>
        {{ title || 'No title' }}
      </small>

      <h2>
        {{ value ?? 0 }}
      </h2>

      <span>
        {{ description || 'No description available' }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: 0
  },
  icon: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'green'
  }
})

const defaultIcon = 'solar:chart-2-bold-duotone'

const allowedColors = ['green', 'blue', 'red', 'orange']

const iconColorClass = computed(() => {
  return allowedColors.includes(props.color)
    ? `analytics-${props.color}`
    : 'analytics-green'
})
</script>

<style scoped>
.analytics-card {
  background: white;
  border-radius: 28px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.06);
  transition: 0.3s;
}

.analytics-card:hover {
  transform: translateY(-6px);
}

.analytics-icon {
  width: 70px;
  height: 70px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analytics-green {
  background: rgba(20,139,128,0.12);
  color: #148b80;
}

.analytics-blue {
  background: rgba(59,130,246,0.12);
  color: #3b82f6;
}

.analytics-red {
  background: rgba(239,68,68,0.12);
  color: #ef4444;
}

.analytics-orange {
  background: rgba(249,115,22,0.12);
  color: #f97316;
}

h2 {
  font-size: 2rem;
  font-weight: 800;
  margin: 4px 0;
}

small {
  color: #7b8794;
}

span {
  font-size: 13px;
  font-weight: 600;
}
</style>