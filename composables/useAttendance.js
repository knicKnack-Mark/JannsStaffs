import { computed, nextTick, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'

export const useAttendance = () => {
  const { apiFetch } = useApi()
  const toast = useToast()

  const {
    startPageLoading,
    stopPageLoading
  } = usePageLoader()

  const selectedDate = ref(new Date().toISOString().slice(0, 10))
  const search = ref('')
  const selectedStatus = ref('All')

  const attendance = ref([])
  const attendanceLogs = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const hasLoaded = ref(false)

  const defaultTimeIn = '08:00'
  const defaultTimeOut = '17:00'

  let fetchId = 0

  const normalizeAttendance = (item) => ({
    id: item.id,
    staffId: item.staffId,
    employeeId: item.employeeId,
    name: item.name,
    position: item.position,
    department: item.department || 'Operations',
    image: item.image || item.avatar || null,
    date: item.date,
    timeIn: item.timeIn || '',
    timeOut: item.timeOut || '',
    renderedHours: Number(item.renderedHours || 0),
    status: item.status || 'Pending',
    remarks: item.remarks || '',
    shiftStart: item.shiftStart || defaultTimeIn,
    shiftEnd: item.shiftEnd || defaultTimeOut
  })

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
        item.name?.toLowerCase().includes(keyword) ||
        item.position?.toLowerCase().includes(keyword) ||
        item.department?.toLowerCase().includes(keyword) ||
        item.employeeId?.toLowerCase().includes(keyword)

      const matchesStatus =
        selectedStatus.value === 'All' ||
        item.status === selectedStatus.value

      return matchesSearch && matchesStatus
    })
  })

  const getPercentage = (value, total) => {
    if (!total) return 0
    return Math.round((value / total) * 100)
  }

  const summaryCards = computed(() => {
    const totalStaff = attendance.value.length

    const present = attendance.value.filter((item) => {
      return ['Present', 'On Time', 'Late', 'Undertime', 'Half Day'].includes(item.status)
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

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase()
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
    if (item.renderedHours && Number(item.renderedHours) > 0) {
      const totalMinutes = Math.round(Number(item.renderedHours) * 60)
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60

      return `${hours}h ${minutes}m`
    }

    if (!item.timeIn || !item.timeOut) {
      return '0h 0m'
    }

    const start = convertTimeToMinutes(item.timeIn)
    const end = convertTimeToMinutes(item.timeOut)
    const totalMinutes = Math.max(end - start, 0)

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${hours}h ${minutes}m`
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

  const replaceAttendanceRecord = (updatedRecord) => {
    const normalized = normalizeAttendance(updatedRecord)

    const index = attendance.value.findIndex((item) => {
      return item.id === normalized.id
    })

    if (index !== -1) {
      attendance.value[index] = normalized
    }
  }

  const waitForPagePaint = async () => {
    await nextTick()

    if (process.client) {
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve)
        })
      })
    }
  }

  const fetchAttendance = async () => {
    const currentFetchId = ++fetchId

    try {
      loading.value = true
      hasLoaded.value = false
      startPageLoading()

      const res = await apiFetch('/staff-attendance', {
        query: {
          date: selectedDate.value
        }
      })

      if (currentFetchId !== fetchId) return

      attendance.value = (res.data || []).map(normalizeAttendance)

      await waitForPagePaint()

      hasLoaded.value = true

      await waitForPagePaint()

      stopPageLoading(1000)
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || 'Failed to load attendance.')

      hasLoaded.value = true
      stopPageLoading(1000)
    } finally {
      if (currentFetchId === fetchId) {
        loading.value = false
      }
    }
  }

  const timeIn = async (item) => {
    if (isTimeInDisabled(item)) return

    try {
      saving.value = true

      const res = await apiFetch(`/staff-attendance/${item.id}/time-in`, {
        method: 'PATCH'
      })

      replaceAttendanceRecord(res.data)
      addLog(`${item.name} timed in successfully.`, 'success')
      toast.success(res.message || 'Time in recorded successfully.')
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || 'Failed to record time in.')
    } finally {
      saving.value = false
    }
  }

  const timeOut = async (item) => {
    if (isTimeOutDisabled(item)) return

    try {
      saving.value = true

      const res = await apiFetch(`/staff-attendance/${item.id}/time-out`, {
        method: 'PATCH'
      })

      replaceAttendanceRecord(res.data)
      addLog(`${item.name} timed out successfully.`, 'success')
      toast.success(res.message || 'Time out recorded successfully.')
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || 'Failed to record time out.')
    } finally {
      saving.value = false
    }
  }

  const markAbsent = async (item) => {
    if (isAbsentDisabled(item)) return

    try {
      saving.value = true

      const res = await apiFetch(`/staff-attendance/${item.id}/absent`, {
        method: 'PATCH'
      })

      replaceAttendanceRecord(res.data)
      addLog(`${item.name} was marked as absent.`, 'danger')
      toast.success(res.message || 'Staff marked as absent.')
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || 'Failed to mark absent.')
    } finally {
      saving.value = false
    }
  }

  const toggleStatus = async (item) => {
    const statuses = ['Pending', 'Present', 'Absent']
    const currentIndex = statuses.indexOf(item.status)
    const nextIndex = (currentIndex + 1) % statuses.length
    const nextStatus = statuses[nextIndex]

    if (nextStatus === 'Present') {
      await timeIn(item)
      return
    }

    if (nextStatus === 'Absent') {
      await markAbsent(item)
      return
    }

    addLog(`${item.name}'s status cannot be reset from here.`, 'warning')
    toast.info('Use date refresh if you need to reset attendance.')
  }

  const updateRemarks = async ({ item, remarks }) => {
    try {
      saving.value = true

      const res = await apiFetch(`/staff-attendance/${item.id}/remarks`, {
        method: 'PATCH',
        body: {
          remarks
        }
      })

      replaceAttendanceRecord(res.data)
      addLog(`${item.name}'s remarks were updated.`, 'info')
      toast.success(res.message || 'Remarks updated successfully.')
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || 'Failed to update remarks.')
    } finally {
      saving.value = false
    }
  }

  const markAllPresent = async () => {
    for (const item of attendance.value) {
      if (!isTimeInDisabled(item)) {
        await timeIn(item)
      }
    }

    addLog('All available pending staff were marked as present.', 'success')
  }

  const markAllAbsent = async () => {
    for (const item of attendance.value) {
      if (!isAbsentDisabled(item)) {
        await markAbsent(item)
      }
    }

    addLog('All available pending staff were marked as absent.', 'danger')
  }

  const resetAttendance = async () => {
    await fetchAttendance()
    attendanceLogs.value = []
    addLog('Attendance records were refreshed for the selected date.', 'warning')
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
      'Employee ID',
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
      item.employeeId,
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
      ...rows.map((row) => {
        return row.map((cell) => `"${cell}"`).join(',')
      })
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
    toast.success('Attendance report exported successfully.')
  }

  watch(selectedDate, async () => {
    await fetchAttendance()
  })

  fetchAttendance()

  return {
    selectedDate,
    search,
    selectedStatus,

    attendance,
    attendanceLogs,
    loading,
    saving,
    hasLoaded,

    filteredAttendance,
    summaryCards,
    formattedSelectedDate,

    getInitials,
    getRenderedHours,

    fetchAttendance,
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