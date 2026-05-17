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

const attendanceChart = ref({
  weekly: {
    labels: [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun'
    ],
    present: [
      51,
      48,
      54,
      50,
      56,
      45,
      52
    ],
    absent: [
      7,
      10,
      4,
      8,
      2,
      13,
      6
    ]
  },

  monthly: {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    present: [
      1320,
      1280,
      1405,
      1388,
      1450,
      1422,
      1508,
      1490,
      1442,
      1510,
      1535,
      1580
    ],
    absent: [
      135,
      128,
      112,
      118,
      95,
      104,
      88,
      92,
      110,
      86,
      80,
      74
    ]
  },

  yearly: {
    labels: [
      '2025',
      '2026',
      '2027',
      '2028',
      '2029',
      '2030'
    ],
    present: [
      14520,
      15880,
      16440,
      17120,
      17890,
      18450
    ],
    absent: [
      1260,
      1040,
      980,
      920,
      860,
      790
    ]
  }
})

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