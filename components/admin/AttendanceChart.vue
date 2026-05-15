<template>
  <div class="dashboard-card">
    <div
      class="d-flex justify-content-between align-items-center mb-4"
    >
      <div>
        <h5 class="fw-bold mb-1">
          Attendance Overview
        </h5>

        <p class="text-muted mb-0">
          Weekly staff attendance performance
        </p>
      </div>

      <button class="view-btn">
        Weekly Report
      </button>
    </div>

    <div class="chart-container">
      <Line
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup>
import {
  Line
} from 'vue-chartjs'

const props = defineProps({
  attendanceChart: {
    type: Array,
    required: true
  }
})

const chartData = computed(() => ({
  labels: [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun'
  ],

  datasets: [
    {
      label: 'Attendance',

      data: props.attendanceChart,

      borderColor: '#148b80',

      backgroundColor: 'rgba(20,139,128,0.12)',

      fill: true,

      tension: 0.4,

      pointBackgroundColor: '#148b80',

      pointBorderColor: '#fff',

      pointBorderWidth: 3,

      pointRadius: 6,

      pointHoverRadius: 8
    }
  ]
}))

const chartOptions = {
  responsive: true,

  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false
    }
  },

  scales: {
    x: {
      grid: {
        display: false
      }
    },

    y: {
      beginAtZero: true,

      ticks: {
        stepSize: 20
      },

      grid: {
        color: '#eef3f2'
      }
    }
  }
}
</script>

<style scoped>
.dashboard-card {
  background: white;

  border-radius: 28px;

  padding: 28px;

  height: 100%;

  box-shadow:
    0 15px 35px rgba(0,0,0,0.06);
}

.chart-container {
  height: 320px;
}

.view-btn {
  border: none;

  background: rgba(20,139,128,0.1);

  color: #148b80;

  padding: 10px 18px;

  border-radius: 14px;

  font-weight: 600;
}
</style>