import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'

export const useStaff = () => {
  const { apiFetch } = useApi()
  const toast = useToast()

  const staffList = ref([])
  const loading = ref(false)
  const saving = ref(false)

  const search = ref('')
  const selectedStatus = ref('All')
  const selectedSalaryType = ref('All')

  const normalizeStaff = (staff) => ({
    id: staff.id,
    name: staff.name,
    position: staff.position,
    phone: staff.phone,
    salaryType: staff.salary_type,
    monthlySalary: staff.monthly_salary,
    dailyRate: staff.daily_rate,
    status: staff.status,
    attendance: staff.attendance,
    avatar: staff.avatar
  })

  const buildFormData = (form) => {
    const formData = new FormData()

    formData.append('name', form.name)
    formData.append('position', form.position)
    formData.append('phone', form.phone || '')
    formData.append('salary_type', form.salaryType)
    formData.append('status', form.status)

    if (form.salaryType === 'Monthly') {
      formData.append('monthly_salary', form.monthlySalary || 0)
      formData.append('daily_rate', '')
    } else {
      formData.append('daily_rate', form.dailyRate || 0)
      formData.append('monthly_salary', '')
    }

    if (form.avatar instanceof File) {
      formData.append('avatar', form.avatar)
    }

    return formData
  }

  const fetchStaff = async () => {
    try {
      loading.value = true

      const res = await apiFetch('/staff')
      staffList.value = (res.data || []).map(normalizeStaff)
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || 'Failed to load staff.')
    } finally {
      loading.value = false
    }
  }

  const addStaff = async (form, onSuccess = null) => {
    try {
      saving.value = true

      const payload = buildFormData(form)

      const res = await apiFetch('/staff', {
        method: 'POST',
        body: payload
      })

      staffList.value.unshift(normalizeStaff(res.data))
      toast.success(res.message)

      if (onSuccess) onSuccess()
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || 'Failed to add staff.')
    } finally {
      saving.value = false
    }
  }

  const updateStaff = async (form, onSuccess = null) => {
    try {
      saving.value = true

      const payload = buildFormData(form)
      payload.append('_method', 'PUT')

      const res = await apiFetch(`/staff/${form.id}`, {
        method: 'POST',
        body: payload
      })

      const index = staffList.value.findIndex(staff => staff.id === form.id)

      if (index !== -1) {
        staffList.value[index] = normalizeStaff(res.data)
      }

      toast.success(res.message)

      if (onSuccess) onSuccess()
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || 'Failed to update staff.')
    } finally {
      saving.value = false
    }
  }

  const updateStaffField = async (staff, payload) => {
    try {
      const res = await apiFetch(`/staff/${staff.id}`, {
        method: 'PATCH',
        body: payload
      })

      const index = staffList.value.findIndex(item => item.id === staff.id)

      if (index !== -1) {
        staffList.value[index] = normalizeStaff(res.data)
      }

      toast.success(res.message)
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || 'Failed to update staff.')
    }
  }

  const markTimeIn = async (staff) => {
    await updateStaffField(staff, {
      attendance: 'Present'
    })
  }

  const markAbsent = async (staff) => {
    await updateStaffField(staff, {
      attendance: 'Absent'
    })
  }

  const toggleStatus = async (staff) => {
    const newStatus = staff.status === 'Active' ? 'Inactive' : 'Active'

    await updateStaffField(staff, {
      status: newStatus,
      attendance: newStatus === 'Inactive'
        ? 'Not Timed In'
        : staff.attendance
    })
  }

  const filteredStaff = computed(() => {
    const keyword = search.value.toLowerCase().trim()

    return staffList.value.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(keyword) ||
        staff.position.toLowerCase().includes(keyword) ||
        staff.phone?.toLowerCase().includes(keyword)

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

  return {
    staffList,
    loading,
    saving,

    search,
    selectedStatus,
    selectedSalaryType,

    filteredStaff,
    summaryCards,

    fetchStaff,
    addStaff,
    updateStaff,
    updateStaffField,
    markTimeIn,
    markAbsent,
    toggleStatus
  }
}