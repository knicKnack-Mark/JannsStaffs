import { computed, ref } from 'vue'

export const useAttendance = () => {
  const selectedDate = ref(new Date().toISOString().slice(0, 10))
  const search = ref('')
  const selectedStatus = ref('All')

  const attendanceList = ref([
    {
      id: 1001,
      employeeId: 'JNS-001',
      name: 'Maria Santos',
      position: 'Front Desk Officer',
      timeIn: '08:00 AM',
      timeOut: '05:00 PM',
      status: 'Present',
      isActive: true
    },
    {
      id: 1002,
      employeeId: 'JNS-002',
      name: 'Juan Dela Cruz',
      position: 'Pool Attendant',
      timeIn: '08:20 AM',
      timeOut: '',
      status: 'No Time Out',
      isActive: true
    },
    {
      id: 1003,
      employeeId: 'JNS-003',
      name: 'Ana Reyes',
      position: 'Housekeeping Staff',
      timeIn: '',
      timeOut: '',
      status: 'Absent',
      isActive: true
    },
    {
      id: 1004,
      employeeId: 'JNS-004',
      name: 'Carlo Mendoza',
      position: 'Maintenance Worker',
      timeIn: '',
      timeOut: '',
      status: 'Inactive',
      isActive: false
    },
    {
      id: 1005,
      employeeId: 'JNS-005',
      name: 'Liza Aquino',
      position: 'Cashier',
      timeIn: '09:15 AM',
      timeOut: '',
      status: 'Late',
      isActive: true
    },
    {
      id: 1006,
      employeeId: 'JNS-006',
      name: 'Ramon Garcia',
      position: 'Security Guard',
      timeIn: '',
      timeOut: '',
      status: 'Absent',
      isActive: true
    }
  ])

  const attendanceLogs = ref([
    {
      id: 1,
      title: 'Maria Santos completed attendance',
      time: 'Today',
      icon: 'solar:user-check-bold-duotone',
      color: 'green'
    },
    {
      id: 2,
      title: 'Ana Reyes was marked absent',
      time: 'Today',
      icon: 'solar:user-cross-bold-duotone',
      color: 'red'
    },
    {
      id: 3,
      title: 'Juan Dela Cruz timed in at 08:20 AM',
      time: 'Today',
      icon: 'solar:login-3-bold-duotone',
      color: 'blue'
    }
  ])

  const filteredAttendance = computed(() => {
    const keyword = search.value.toLowerCase().trim()

    return attendanceList.value.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(keyword) ||
        staff.position.toLowerCase().includes(keyword) ||
        staff.employeeId.toLowerCase().includes(keyword)

      const matchesStatus =
        selectedStatus.value === 'All' ||
        staff.status === selectedStatus.value

      return matchesSearch && matchesStatus
    })
  })

  const summaryCards = computed(() => {
    const present = attendanceList.value.filter(staff => staff.status === 'Present').length
    const noTimeOut = attendanceList.value.filter(staff => staff.status === 'No Time Out').length
    const absent = attendanceList.value.filter(staff => staff.status === 'Absent').length
    const late = attendanceList.value.filter(staff => staff.status === 'Late').length

    return [
      {
        title: 'Present Today',
        value: present,
        description: 'Completed attendance',
        icon: 'solar:user-check-bold-duotone',
        color: 'green'
      },
      {
        title: 'No Time Out',
        value: noTimeOut,
        description: 'Currently on duty',
        icon: 'solar:logout-3-bold-duotone',
        color: 'blue'
      },
      {
        title: 'Absent Today',
        value: absent,
        description: 'Marked as absent',
        icon: 'solar:user-cross-bold-duotone',
        color: 'red'
      },
      {
        title: 'Late Today',
        value: late,
        description: 'Timed in late',
        icon: 'solar:alarm-bold-duotone',
        color: 'orange'
      }
    ]
  })

  const formattedSelectedDate = computed(() => {
    if (!selectedDate.value) return 'Today'

    return new Date(selectedDate.value).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  })

  const getInitials = (name) => {
    if (!name) return 'NA'

    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  const convertToDate = (time) => {
    if (!time) return null

    const today = new Date().toDateString()
    return new Date(`${today} ${time}`)
  }

  const getRenderedHours = (staff) => {
    if (!staff.timeIn || !staff.timeOut) return '--'

    const timeIn = convertToDate(staff.timeIn)
    const timeOut = convertToDate(staff.timeOut)

    if (!timeIn || !timeOut || timeOut <= timeIn) return '--'

    const diffMs = timeOut - timeIn
    const hours = Math.floor(diffMs / 1000 / 60 / 60)
    const minutes = Math.floor((diffMs / 1000 / 60) % 60)

    return `${hours}h ${minutes}m`
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const addLog = (title, icon, color) => {
    attendanceLogs.value.unshift({
      id: Date.now(),
      title,
      time: 'Just now',
      icon,
      color
    })
  }

  const timeIn = (staff) => {
    const currentTime = getCurrentTime()

    staff.timeIn = currentTime
    staff.timeOut = ''

    const lateLimit = convertToDate('08:30 AM')
    const current = convertToDate(currentTime)

    staff.status = current > lateLimit ? 'Late' : 'No Time Out'

    addLog(
      `${staff.name} timed in at ${currentTime}`,
      'solar:login-3-bold-duotone',
      'blue'
    )
  }

  const timeOut = (staff) => {
    const currentTime = getCurrentTime()

    staff.timeOut = currentTime
    staff.status = 'Present'

    addLog(
      `${staff.name} timed out at ${currentTime}`,
      'solar:logout-3-bold-duotone',
      'green'
    )
  }

  const markAbsent = (staff) => {
    staff.timeIn = ''
    staff.timeOut = ''
    staff.status = 'Absent'

    addLog(
      `${staff.name} was marked absent`,
      'solar:user-cross-bold-duotone',
      'red'
    )
  }

  const toggleStatus = (staff) => {
    staff.isActive = !staff.isActive

    if (!staff.isActive) {
      staff.timeIn = ''
      staff.timeOut = ''
      staff.status = 'Inactive'

      addLog(
        `${staff.name} was set as inactive`,
        'solar:user-block-bold-duotone',
        'orange'
      )

      return
    }

    staff.status = 'Absent'

    addLog(
      `${staff.name} was set as active`,
      'solar:user-check-bold-duotone',
      'green'
    )
  }

  const isTimeInDisabled = (staff) => {
    return (
      !staff.isActive ||
      staff.status === 'Absent' ||
      staff.status === 'Inactive' ||
      !!staff.timeIn
    )
  }

  const isTimeOutDisabled = (staff) => {
    return (
      !staff.isActive ||
      staff.status === 'Absent' ||
      staff.status === 'Inactive' ||
      !staff.timeIn ||
      !!staff.timeOut
    )
  }

  const isAbsentDisabled = (staff) => {
    return (
      !staff.isActive ||
      staff.status === 'Inactive' ||
      !!staff.timeIn ||
      staff.status === 'Present' ||
      staff.status === 'Late' ||
      staff.status === 'No Time Out'
    )
  }

  return {
    selectedDate,
    search,
    selectedStatus,
    attendanceList,
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
    isTimeInDisabled,
    isTimeOutDisabled,
    isAbsentDisabled
  }
}