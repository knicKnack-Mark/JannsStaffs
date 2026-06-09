export const useDashboard = () => {
  const { apiFetch } = useApi()

  const loading = ref(false)

  const analytics = ref([
    {
      title: 'Total Staff',
      value: 0,
      icon: 'solar:users-group-rounded-bold-duotone',
      color: 'green',
      description: 'No data yet'
    },
    {
      title: 'Present Today',
      value: 0,
      icon: 'solar:user-check-bold-duotone',
      color: 'blue',
      description: 'No data yet'
    },
    {
      title: 'Absent Today',
      value: 0,
      icon: 'solar:user-cross-bold-duotone',
      color: 'red',
      description: 'No data yet'
    },
    {
      title: 'Salary Expenses',
      value: '₱0',
      icon: 'solar:wallet-money-bold-duotone',
      color: 'orange',
      description: 'No data yet'
    }
  ])

  const attendanceChart = ref({
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      present: [0, 0, 0, 0, 0, 0, 0],
      absent: [0, 0, 0, 0, 0, 0, 0]
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      present: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      absent: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    yearly: {
      labels: ['2025', '2026', '2027', '2028', '2029', '2030'],
      present: [0, 0, 0, 0, 0, 0],
      absent: [0, 0, 0, 0, 0, 0]
    }
  })

  const quickStats = ref([
    {
      title: 'Payroll Processed',
      value: '₱0',
      icon: 'solar:dollar-bold-duotone'
    },
    {
      title: 'Overtime Hours',
      value: '0 hrs',
      icon: 'solar:clock-circle-bold-duotone'
    },
    {
      title: 'On Leave',
      value: '0 Employees',
      icon: 'solar:calendar-bold-duotone'
    },
    {
      title: 'Maintenance Tasks',
      value: '0 Pending',
      icon: 'solar:settings-bold-duotone'
    }
  ])

  const activities = ref([])
  const notifications = ref([])
  const departments = ref([])

  const fetchDashboard = async () => {
    loading.value = true

    try {
      const response = await apiFetch('/admin/dashboard/stats')

      analytics.value = response.analytics || analytics.value
      attendanceChart.value = response.attendanceChart || attendanceChart.value
      quickStats.value = response.quickStats || quickStats.value
      activities.value = response.activities || []
      notifications.value = response.notifications || []
      departments.value = response.departments || []
    } catch (error) {
      console.error('Dashboard fetch error:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    analytics,
    attendanceChart,
    quickStats,
    activities,
    notifications,
    departments,
    fetchDashboard
  }
}