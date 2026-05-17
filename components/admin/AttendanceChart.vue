<template>
  <div class="dashboard-card">
    <div class="attendance-header mb-4">
      <div class="attendance-title">
        <h5 class="fw-bold mb-1">
          Attendance Overview
        </h5>

        <p class="text-muted mb-0">
          {{ chartSubtitle }}
        </p>
      </div>

      <div class="attendance-actions">
        <!-- LEGENDS -->
        <div class="legend-wrapper">
          <div class="legend-item">
            <span class="legend-dot present"></span>
            <small>Present</small>
          </div>

          <div class="legend-item">
            <span class="legend-dot absent"></span>
            <small>Absent</small>
          </div>
        </div>

        <div class="select-wrapper">
          <!-- RANGE SELECT -->
          <select
            v-model="selectedRange"
            class="form-select control-select"
          >
            <option value="weekly">
              Weekly
            </option>

            <option value="monthly">
              Monthly
            </option>

            <option value="yearly">
              Yearly
            </option>
          </select>

          <!-- CHART TYPE SELECT -->
          <select
            v-model="selectedChartType"
            class="form-select control-select"
          >
            <option value="line">
              Line Graph
            </option>

            <option value="bar">
              Bar Graph
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="chart-container">
      <Transition
        name="chart-fade"
        mode="out-in"
      >
        <Line
          v-if="selectedChartType === 'line'"
          :key="chartRenderKey"
          :data="chartData"
          :options="chartOptions"
        />

        <Bar
          v-else
          :key="chartRenderKey"
          :data="chartData"
          :options="chartOptions"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Line, Bar } from 'vue-chartjs'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
  Legend
)

const props = defineProps({
  attendanceChart: {
    type: Object,
    required: true
  }
})

const selectedRange = ref('weekly')
const selectedChartType = ref('line')

const currentChart = computed(() => {
  return props.attendanceChart[selectedRange.value] || {
    labels: [],
    present: [],
    absent: []
  }
})

const chartRenderKey = computed(() => {
  return `${selectedRange.value}-${selectedChartType.value}`
})

const chartSubtitle = computed(() => {
  const rangeLabel = {
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly'
  }

  const typeLabel = selectedChartType.value === 'line'
    ? 'line graph'
    : 'bar graph'

  return `${rangeLabel[selectedRange.value]} staff attendance performance shown as ${typeLabel}`
})

const getAnimationDelay = (ctx) => {
  if (ctx.type !== 'data') {
    return 0
  }

  const baseDelay = selectedRange.value === 'yearly' ? 95 : 80
  const datasetDelay = ctx.datasetIndex * 120

  return ctx.dataIndex * baseDelay + datasetDelay
}

const chartData = computed(() => {
  const isLine = selectedChartType.value === 'line'

  return {
    labels: currentChart.value.labels,

    datasets: [
      {
        type: selectedChartType.value,
        label: 'Present',
        data: currentChart.value.present,
        borderColor: '#148b80',
        backgroundColor: isLine
          ? 'rgba(20,139,128,0.12)'
          : 'rgba(20,139,128,0.78)',
        fill: isLine,
        tension: isLine ? 0.45 : 0,
        borderWidth: isLine ? 4 : 0,
        pointBackgroundColor: '#148b80',
        pointBorderColor: '#ffffff',
        pointBorderWidth: isLine ? 3 : 0,
        pointRadius: isLine ? 6 : 0,
        pointHoverRadius: isLine ? 8 : 0,
        borderRadius: isLine ? 0 : 14,
        barThickness: selectedRange.value === 'weekly' ? 28 : 18,
        categoryPercentage: 0.72,
        barPercentage: 0.82
      },
      {
        type: selectedChartType.value,
        label: 'Absent',
        data: currentChart.value.absent,
        borderColor: '#ef4444',
        backgroundColor: isLine
          ? 'rgba(239,68,68,0.10)'
          : 'rgba(239,68,68,0.78)',
        fill: isLine,
        tension: isLine ? 0.45 : 0,
        borderWidth: isLine ? 4 : 0,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: isLine ? 3 : 0,
        pointRadius: isLine ? 6 : 0,
        pointHoverRadius: isLine ? 8 : 0,
        borderRadius: isLine ? 0 : 14,
        barThickness: selectedRange.value === 'weekly' ? 28 : 18,
        categoryPercentage: 0.72,
        barPercentage: 0.82
      }
    ]
  }
})

const chartOptions = computed(() => {
  const isLine = selectedChartType.value === 'line'

  return {
    responsive: true,
    maintainAspectRatio: false,

    animation: {
      duration: 950,
      easing: 'easeOutCubic'
    },

    animations: {
      x: {
        type: 'number',
        easing: 'easeOutCubic',
        duration: 900,
        from(ctx) {
          if (isLine) {
            const chartArea = ctx.chart.chartArea

            if (!chartArea) {
              return undefined
            }

            return chartArea.left
          }

          return undefined
        },
        delay: getAnimationDelay
      },

      y: {
        type: 'number',
        easing: 'easeOutCubic',
        duration: 950,
        from(ctx) {
          if (ctx.type === 'data') {
            return ctx.chart.scales.y.getPixelForValue(0)
          }

          return undefined
        },
        delay: getAnimationDelay
      }
    },

    transitions: {
      show: {
        animations: {
          x: {
            from: 0
          },

          y: {
            from: 0
          }
        }
      },

      hide: {
        animations: {
          x: {
            to: 0
          },

          y: {
            to: 0
          }
        }
      }
    },

    interaction: {
      mode: 'index',
      intersect: false
    },

    plugins: {
      legend: {
        display: false
      },

      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        cornerRadius: 12,
        displayColors: true
      }
    },

    scales: {
      x: {
        grid: {
          display: false
        },

        ticks: {
          color: '#718096',
          font: {
            weight: 600
          }
        },

        border: {
          display: false
        }
      },

      y: {
        beginAtZero: true,

        ticks: {
          color: '#718096',
          font: {
            weight: 600
          }
        },

        grid: {
          color: '#eef3f2'
        },

        border: {
          display: false
        }
      }
    }
  }
})
</script>

<style scoped>
.dashboard-card {
  background: white;
  border-radius: 28px;
  padding: 28px;
  height: 100%;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
}

.attendance-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.attendance-title {
  flex: 1 1 auto;
  min-width: 220px;
}

.attendance-title p {
  max-width: 420px;
  line-height: 1.45;
}

.attendance-actions {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  margin-left: auto;
}

.legend-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
  white-space: nowrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 7px;
}

.legend-item small {
  color: #64748b;
  font-weight: 700;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
}

.legend-dot.present {
  background: #148b80;
}

.legend-dot.absent {
  background: #ef4444;
}

.select-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;
}

.control-select {
  width: 136px;
  height: 44px;
  border: none;
  border-radius: 14px;
  background-color: rgba(20, 139, 128, 0.1);
  color: #148b80;
  font-weight: 700;
  box-shadow: none;
  cursor: pointer;
}

.control-select:focus {
  background-color: rgba(20, 139, 128, 0.12);
  box-shadow: 0 0 0 3px rgba(20, 139, 128, 0.12);
}

.chart-container {
  height: 320px;
  position: relative;
}

.chart-fade-enter-active,
.chart-fade-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.chart-fade-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.985);
}

.chart-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.985);
}

/* This fixes the expanded sidebar layout */
@media (max-width: 1450px) {
  .attendance-header {
    flex-direction: column;
    align-items: stretch;
  }

  .attendance-actions {
    width: 100%;
    justify-content: space-between;
    margin-left: 0;
  }

  .select-wrapper {
    margin-left: auto;
  }
}

/* Tablet */
@media (max-width: 991px) {
  .attendance-actions {
    align-items: flex-start;
    flex-direction: column;
  }

  .select-wrapper {
    width: 100%;
    margin-left: 0;
  }

  .control-select {
    width: 100%;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .dashboard-card {
    padding: 22px;
  }

  .legend-wrapper {
    width: 100%;
  }

  .select-wrapper {
    flex-direction: column;
  }

  .chart-container {
    height: 280px;
  }
}
</style>