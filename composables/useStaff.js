import { computed, ref } from 'vue'

export const useStaff = () => {
  const search = ref('')
  const selectedStatus = ref('All')
  const selectedSalaryType = ref('All')
  const showAddStaffModal = ref(false)
  const showEditStaffModal = ref(false)

  const editForm = ref({
    id: null,
    name: '',
    position: '',
    phone: '',
    salaryType: 'Monthly',
    monthlySalary: 0,
    dailyRate: 0,
    status: 'Active',
    avatar: ''
  })

  const staffList = ref([
    {
      id: 1001,
      name: 'Maria Santos',
      position: 'Front Desk Officer',
      phone: '0917 123 4567',
      salaryType: 'Monthly',
      monthlySalary: 18000,
      dailyRate: null,
      status: 'Active',
      attendance: 'Present',
      avatar: 'https://i.pravatar.cc/300?img=32'
    },
    {
      id: 1002,
      name: 'Juan Dela Cruz',
      position: 'Pool Attendant',
      phone: '0918 234 5678',
      salaryType: 'Daily',
      monthlySalary: null,
      dailyRate: 600,
      status: 'Active',
      attendance: 'Not Timed In',
      avatar: 'https://i.pravatar.cc/300?img=12'
    },
    {
      id: 1003,
      name: 'Ana Reyes',
      position: 'Housekeeping Staff',
      phone: '0919 345 6789',
      salaryType: 'Daily',
      monthlySalary: null,
      dailyRate: 580,
      status: 'Active',
      attendance: 'Absent',
      avatar: 'https://i.pravatar.cc/300?img=45'
    },
    {
      id: 1004,
      name: 'Carlo Mendoza',
      position: 'Maintenance Worker',
      phone: '0920 456 7890',
      salaryType: 'Monthly',
      monthlySalary: 20000,
      dailyRate: null,
      status: 'Inactive',
      attendance: 'Not Timed In',
      avatar: 'https://i.pravatar.cc/300?img=15'
    },
    {
      id: 1005,
      name: 'Liza Aquino',
      position: 'Cashier',
      phone: '0921 567 8901',
      salaryType: 'Monthly',
      monthlySalary: 17000,
      dailyRate: null,
      status: 'Active',
      attendance: 'Present',
      avatar: 'https://i.pravatar.cc/300?img=26'
    },
    {
      id: 1006,
      name: 'Ramon Garcia',
      position: 'Security Guard',
      phone: '0922 678 9012',
      salaryType: 'Daily',
      monthlySalary: null,
      dailyRate: 750,
      status: 'Active',
      attendance: 'Not Timed In',
      avatar: 'https://i.pravatar.cc/300?img=53'
    }
  ])

  const filteredStaff = computed(() => {
    const keyword = search.value.toLowerCase().trim()

    return staffList.value.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(keyword) ||
        staff.position.toLowerCase().includes(keyword) ||
        staff.phone.toLowerCase().includes(keyword)

      const matchesStatus =
        selectedStatus.value === 'All' ||
        staff.status === selectedStatus.value

      const matchesSalaryType =
        selectedSalaryType.value === 'All' ||
        staff.salaryType === selectedSalaryType.value

      return matchesSearch && matchesStatus && matchesSalaryType
    })
  })

  const summaryCards = computed(() => {
    const total = staffList.value.length
    const active = staffList.value.filter(staff => staff.status === 'Active').length
    const monthly = staffList.value.filter(staff => staff.salaryType === 'Monthly').length
    const daily = staffList.value.filter(staff => staff.salaryType === 'Daily').length
    const present = staffList.value.filter(staff => staff.attendance === 'Present').length

    return [
      {
        title: 'Total Staff',
        value: total,
        description: `${active} active employees`,
        icon: 'solar:users-group-rounded-bold-duotone',
        color: 'green'
      },
      {
        title: 'Monthly Staff',
        value: monthly,
        description: 'Fixed monthly salary',
        icon: 'solar:wallet-money-bold-duotone',
        color: 'blue'
      },
      {
        title: 'Daily Staff',
        value: daily,
        description: 'Paid by daily rate',
        icon: 'solar:calendar-date-bold-duotone',
        color: 'orange'
      },
      {
        title: 'Present Today',
        value: present,
        description: 'Currently on duty',
        icon: 'solar:user-check-bold-duotone',
        color: 'green'
      }
    ]
  })

  const openAddStaffModal = () => {
    showAddStaffModal.value = true
  }

  const closeAddStaffModal = () => {
    showAddStaffModal.value = false
  }

  const resetEditForm = () => {
    editForm.value = {
      id: null,
      name: '',
      position: '',
      phone: '',
      salaryType: 'Monthly',
      monthlySalary: 0,
      dailyRate: 0,
      status: 'Active',
      avatar: ''
    }
  }

  const openEditStaffModal = (staff) => {
    editForm.value = {
      id: staff.id,
      name: staff.name,
      position: staff.position,
      phone: staff.phone,
      salaryType: staff.salaryType,
      monthlySalary: staff.monthlySalary || 0,
      dailyRate: staff.dailyRate || 0,
      status: staff.status,
      avatar: staff.avatar
    }

    showEditStaffModal.value = true
  }

  const closeEditStaffModal = () => {
    showEditStaffModal.value = false
    resetEditForm()
  }

  const addStaff = (form) => {
    const newId = staffList.value.length
      ? Math.max(...staffList.value.map(staff => staff.id)) + 1
      : 1001

    const newStaff = {
      id: newId,
      name: form.name,
      position: form.position,
      phone: form.phone,
      salaryType: form.salaryType,
      monthlySalary: form.salaryType === 'Monthly'
        ? Number(form.monthlySalary || 0)
        : null,
      dailyRate: form.salaryType === 'Daily'
        ? Number(form.dailyRate || 0)
        : null,
      status: form.status,
      attendance: 'Not Timed In',
      avatar: form.avatar
        ? `https://i.pravatar.cc/300?img=${form.avatar}`
        : 'https://i.pravatar.cc/300?img=10'
    }

    staffList.value.unshift(newStaff)
    closeAddStaffModal()
  }

  const updateStaff = () => {
    const index = staffList.value.findIndex(staff => staff.id === editForm.value.id)

    if (index === -1) return

    staffList.value[index] = {
      ...staffList.value[index],
      name: editForm.value.name,
      position: editForm.value.position,
      phone: editForm.value.phone,
      salaryType: editForm.value.salaryType,
      monthlySalary: editForm.value.salaryType === 'Monthly'
        ? Number(editForm.value.monthlySalary || 0)
        : null,
      dailyRate: editForm.value.salaryType === 'Daily'
        ? Number(editForm.value.dailyRate || 0)
        : null,
      status: editForm.value.status,
      avatar: editForm.value.avatar || staffList.value[index].avatar,
      attendance: editForm.value.status === 'Inactive'
        ? 'Not Timed In'
        : staffList.value[index].attendance
    }

    closeEditStaffModal()
  }

  const markTimeIn = (staff) => {
    if (staff.status === 'Inactive') return
    staff.attendance = 'Present'
  }

  const markAbsent = (staff) => {
    if (staff.status === 'Inactive') return
    staff.attendance = 'Absent'
  }

  const toggleStatus = (staff) => {
    staff.status = staff.status === 'Active' ? 'Inactive' : 'Active'

    if (staff.status === 'Inactive') {
      staff.attendance = 'Not Timed In'
    }
  }

  return {
    search,
    selectedStatus,
    selectedSalaryType,
    showAddStaffModal,
    showEditStaffModal,
    editForm,
    staffList,
    filteredStaff,
    summaryCards,
    openAddStaffModal,
    closeAddStaffModal,
    openEditStaffModal,
    closeEditStaffModal,
    addStaff,
    updateStaff,
    markTimeIn,
    markAbsent,
    toggleStatus
  }
}