export const useDashboard = () => {
  const analytics = ref([
    {
      title: 'Total Staff',
      value: 58,
      icon: 'solar:users-group-rounded-bold-duotone',
      color: 'green',
      description: '+8 new employees'
    },

    {
      title: 'Present Today',
      value: 51,
      icon: 'solar:user-check-bold-duotone',
      color: 'blue',
      description: '92% attendance'
    },

    {
      title: 'Absent Today',
      value: 7,
      icon: 'solar:user-cross-bold-duotone',
      color: 'red',
      description: 'Needs monitoring'
    },

    {
      title: 'Salary Expenses',
      value: '₱145K',
      icon: 'solar:wallet-money-bold-duotone',
      color: 'orange',
      description: 'Monthly payroll'
    }
  ])

  const attendanceChart = ref([
    85,
    60,
    92,
    74,
    98,
    80,
    95
  ])

  const activities = ref([
    {
      title: 'John Dela Cruz timed in',
      time: '2 minutes ago',
      icon: 'solar:user-check-bold',
      color: 'green'
    },

    {
      title: 'Payroll processed successfully',
      time: '20 minutes ago',
      icon: 'solar:wallet-money-bold',
      color: 'blue'
    },

    {
      title: 'Inventory stock is running low',
      time: '1 hour ago',
      icon: 'solar:danger-bold',
      color: 'red'
    }
  ])

  const notifications = ref([
    {
      title: 'Payroll Deadline',
      description: 'Payroll processing due tomorrow.',
      color: 'warning'
    },

    {
      title: 'Low Inventory',
      description: 'Resort supplies are below threshold.',
      color: 'danger'
    },

    {
      title: 'Attendance Improved',
      description: 'Staff attendance increased by 12%',
      color: 'success'
    }
  ])

  return {
    analytics,
    attendanceChart,
    activities,
    notifications
  }
}