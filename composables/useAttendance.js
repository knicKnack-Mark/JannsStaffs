export const useAttendance = () => {
  const selectedDate = ref(new Date().toISOString().slice(0, 10))
  const search = ref('')
  const selectedStatus = ref('All')

  const defaultTimeIn = '08:00'
  const defaultTimeOut = '17:00'

  const attendance = ref([
    {
      id: 1,
      name: 'Juan Dela Cruz',
      position: 'Pool Attendant',
      department: 'Operations',
      timeIn: '',
      timeOut: '',
      status: 'Pending',
      remarks: '',
      shiftStart: defaultTimeIn,
      shiftEnd: defaultTimeOut
    },
    {
      id: 2,
      name: 'Maria Santos',
      position: 'Front Desk Staff',
      department: 'Reception',
      timeIn: '',
      timeOut: '',
      status: 'Pending',
      remarks: '',
      shiftStart: defaultTimeIn,
      shiftEnd: defaultTimeOut
    },
    {
      id: 3,
      name: 'Pedro Reyes',
      position: 'Housekeeping Staff',
      department: 'Housekeeping',
      timeIn: '',
      timeOut: '',
      status: 'Pending',
      remarks: '',
      shiftStart: defaultTimeIn,
      shiftEnd: defaultTimeOut
    },
    {
      id: 4,
      name: 'Ana Garcia',
      position: 'Cashier',
      department: 'Finance',
      timeIn: '',
      timeOut: '',
      status: 'Pending',
      remarks: '',
      shiftStart: defaultTimeIn,
      shiftEnd: defaultTimeOut
    },
    {
      id: 5,
      name: 'Mark Villanueva',
      position: 'Maintenance Staff',
      department: 'Maintenance',
      timeIn: '',
      timeOut: '',
      status: 'Pending',
      remarks: '',
      shiftStart: defaultTimeIn,
      shiftEnd: defaultTimeOut
    }
  ])

  const attendanceLogs = ref([])

  const formattedSelectedDate = computed(() => {
    return new Date(selectedDate.value).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  })

  const filteredAttendance = computed(() => {
    const keyword = search.value.toLowerCase().trim()

    return attendance.value.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(keyword) ||
        item.position.toLowerCase().includes(keyword) ||
        item.department.toLowerCase().includes(keyword)

      const matchesStatus =
        selectedStatus.value === 'All' ||
        item.status === selectedStatus.value

      return matchesSearch && matchesStatus
    })
  })

  const summaryCards = computed(() => {
    const totalStaff = attendance.value.length

    const present = attendance.value.filter((item) => {
      return ['On Time', 'Late', 'Undertime', 'Half Day'].includes(item.status)
    }).length

    const absent = attendance.value.filter((item) => item.status === 'Absent').length
    const late = attendance.value.filter((item) => item.status === 'Late').length

    return [
      {
        title: 'Total Staff',
        value: totalStaff,
        icon: 'solar:users-group-rounded-bold-duotone',
        description: 'Registered staff today',
        color: 'green'
      },
      {
        title: 'Present Today',
        value: present,
        icon: 'solar:user-check-bold-duotone',
        description: `${getPercentage(present, totalStaff)}% attendance rate`,
        color: 'blue'
      },
      {
        title: 'Absent Today',
        value: absent,
        icon: 'solar:user-cross-bold-duotone',
        description: absent > 0 ? 'Needs monitoring' : 'No absences today',
        color: 'red'
      },
      {
        title: 'Late Today',
        value: late,
        icon: 'solar:alarm-sleep-bold-duotone',
        description: late > 0 ? 'Late arrivals recorded' : 'No late records',
        color: 'orange'
      }
    ]
  })

  const getPercentage = (value, total) => {
    if (!total) return 0
    return Math.round((value / total) * 100)
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  const getCurrentTime = () => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
  }

  const formatTime = (time) => {
    if (!time) return '--'

    const [hours, minutes] = time.split(':')
    const date = new Date()
    date.setHours(Number(hours))
    date.setMinutes(Number(minutes))

    return date.toLocaleTimeString('en-PH', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const convertTimeToMinutes = (time) => {
    if (!time) return 0

    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const getRenderedHours = (item) => {
    if (!item.timeIn || !item.timeOut) return '0h 0m'

    const start = convertTimeToMinutes(item.timeIn)
    const end = convertTimeToMinutes(item.timeOut)
    const totalMinutes = Math.max(end - start, 0)

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${hours}h ${minutes}m`
  }

  const getLateMinutes = (item) => {
    if (!item.timeIn) return 0

    const timeIn = convertTimeToMinutes(item.timeIn)
    const shiftStart = convertTimeToMinutes(item.shiftStart)

    return Math.max(timeIn - shiftStart, 0)
  }

  const getUndertimeMinutes = (item) => {
    if (!item.timeOut) return 0

    const timeOut = convertTimeToMinutes(item.timeOut)
    const shiftEnd = convertTimeToMinutes(item.shiftEnd)

    return Math.max(shiftEnd - timeOut, 0)
  }

  const updateAutoStatus = (item) => {
    if (item.status === 'Absent') return

    const lateMinutes = getLateMinutes(item)
    const undertimeMinutes = getUndertimeMinutes(item)

    if (!item.timeIn) {
      item.status = 'Pending'
      return
    }

    if (item.timeIn && !item.timeOut) {
      item.status = lateMinutes > 0 ? 'Late' : 'On Time'
      return
    }

    const renderedMinutes =
      convertTimeToMinutes(item.timeOut) - convertTimeToMinutes(item.timeIn)

    if (renderedMinutes > 0 && renderedMinutes < 240) {
      item.status = 'Half Day'
      return
    }

    if (undertimeMinutes > 0) {
      item.status = 'Undertime'
      return
    }

    if (lateMinutes > 0) {
      item.status = 'Late'
      return
    }

    item.status = 'On Time'
  }

  const addLog = (message, type = 'info') => {
    attendanceLogs.value.unshift({
      id: Date.now(),
      message,
      type,
      time: new Date().toLocaleTimeString('en-PH', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    })
  }

  const timeIn = (item) => {
    if (isTimeInDisabled(item)) return

    item.timeIn = getCurrentTime()
    item.status = 'On Time'

    updateAutoStatus(item)

    const lateMinutes = getLateMinutes(item)

    if (lateMinutes > 0) {
      addLog(`${item.name} timed in late by ${lateMinutes} minute(s).`, 'warning')
    } else {
      addLog(`${item.name} timed in on time.`, 'success')
    }
  }

  const timeOut = (item) => {
    if (isTimeOutDisabled(item)) return

    item.timeOut = getCurrentTime()

    updateAutoStatus(item)

    const undertimeMinutes = getUndertimeMinutes(item)

    if (undertimeMinutes > 0) {
      addLog(`${item.name} timed out early by ${undertimeMinutes} minute(s).`, 'warning')
    } else {
      addLog(`${item.name} timed out successfully.`, 'success')
    }
  }

  const markAbsent = (item) => {
    if (isAbsentDisabled(item)) return

    item.timeIn = ''
    item.timeOut = ''
    item.status = 'Absent'
    item.remarks = item.remarks || 'Marked absent by admin'

    addLog(`${item.name} was marked as absent.`, 'danger')
  }

  const toggleStatus = (item) => {
    const statuses = ['Pending', 'On Time', 'Late', 'Undertime', 'Half Day', 'Absent']
    const currentIndex = statuses.indexOf(item.status)
    const nextIndex = (currentIndex + 1) % statuses.length

    item.status = statuses[nextIndex]

    if (item.status === 'Absent') {
      item.timeIn = ''
      item.timeOut = ''
    }

    addLog(`${item.name}'s status changed to ${item.status}.`, 'info')
  }

  const updateRemarks = ({ item, remarks }) => {
    item.remarks = remarks
    addLog(`${item.name}'s remarks were updated.`, 'info')
  }

  const markAllPresent = () => {
    attendance.value.forEach((item) => {
      if (item.status === 'Pending') {
        item.timeIn = item.shiftStart
        item.status = 'On Time'
      }
    })

    addLog('All pending staff were marked as present.', 'success')
  }

  const markAllAbsent = () => {
    attendance.value.forEach((item) => {
      if (item.status === 'Pending') {
        item.timeIn = ''
        item.timeOut = ''
        item.status = 'Absent'
        item.remarks = item.remarks || 'Bulk marked absent by admin'
      }
    })

    addLog('All pending staff were marked as absent.', 'danger')
  }

  const resetAttendance = () => {
    attendance.value.forEach((item) => {
      item.timeIn = ''
      item.timeOut = ''
      item.status = 'Pending'
      item.remarks = ''
    })

    attendanceLogs.value = []

    addLog('Attendance records were reset for the selected date.', 'warning')
  }

  const isTimeInDisabled = (item) => {
    return Boolean(item.timeIn) || item.status === 'Absent'
  }

  const isTimeOutDisabled = (item) => {
    return !item.timeIn || Boolean(item.timeOut) || item.status === 'Absent'
  }

  const isAbsentDisabled = (item) => {
    return item.status === 'Absent' || Boolean(item.timeIn)
  }

  const printAttendance = () => {
    window.print()
  }

  const exportReport = () => {
    const headers = [
      'Name',
      'Position',
      'Department',
      'Time In',
      'Time Out',
      'Rendered Hours',
      'Status',
      'Remarks'
    ]

    const rows = attendance.value.map((item) => [
      item.name,
      item.position,
      item.department,
      formatTime(item.timeIn),
      formatTime(item.timeOut),
      getRenderedHours(item),
      item.status,
      item.remarks || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `attendance-${selectedDate.value}.csv`
    link.click()

    URL.revokeObjectURL(url)

    addLog('Attendance report was exported.', 'success')
  }

  return {
    selectedDate,
    search,
    selectedStatus,
    attendanceLogs,
    filteredAttendance,
    summaryCards,
    formattedSelectedDate,
    getInitials,
    getRenderedHours,
    timeIn,
    timeOut,
    markAbsent,
    toggleStatus,
    updateRemarks,
    markAllPresent,
    markAllAbsent,
    resetAttendance,
    isTimeInDisabled,
    isTimeOutDisabled,
    isAbsentDisabled,
    printAttendance,
    exportReport
  }
}