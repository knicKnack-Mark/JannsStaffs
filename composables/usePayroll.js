import { ref } from 'vue'
import { useToast } from 'vue-toastification'

export const usePayroll = () => {
  const { apiFetch } = useApi()
  const toast = useToast()

  const payroll = ref([])
  const loading = ref(false)
  const saving = ref(false)

  const normalizePayroll = (item) => ({
    id: item.id,
    staffId: item.staffId,
    employeeId: item.employeeId,
    name: item.name,
    position: item.position,
    image: item.image || item.avatar || null,
    salary: Number(item.salary || 0),
    presentDays: Number(item.presentDays || 0),
    absentDays: Number(item.absentDays || 0),
    grossSalary: Number(item.grossSalary || 0),
    deductions: Number(item.deductions || 0),
    netSalary: Number(item.netSalary || 0),
    status: item.status || 'Pending',
    month: item.month || ''
  })

  const fetchPayroll = async (month) => {
    try {
      loading.value = true

      const response = await apiFetch('/payrolls', {
        query: { month }
      })

      payroll.value = (response.data || []).map(normalizePayroll)
    } catch (error) {
      console.error(error)
      toast.error(error?.data?.message || 'Failed to load payroll.')
    } finally {
      loading.value = false
    }
  }

  const generatePayroll = async (month) => {
    try {
      saving.value = true

      const response = await apiFetch('/payrolls/generate', {
        method: 'POST',
        body: { month }
      })

      payroll.value = (response.data || []).map(normalizePayroll)

      toast.success(response.message || 'Payroll generated successfully.')
    } catch (error) {
      console.error(error)
      toast.error(error?.data?.message || 'Failed to generate payroll.')
    } finally {
      saving.value = false
    }
  }

  const markPayrollAsPaid = async (id) => {
    try {
      saving.value = true

      const response = await apiFetch(`/payrolls/${id}/paid`, {
        method: 'PATCH'
      })

      if (response.data) {
        const updatedPayroll = normalizePayroll(response.data)

        const index = payroll.value.findIndex((item) => item.id === id)

        if (index !== -1) {
          payroll.value[index] = updatedPayroll
        }
      }

      toast.success(response.message || 'Payroll marked as paid.')
    } catch (error) {
      console.error(error)
      toast.error(error?.data?.message || 'Failed to mark payroll as paid.')
    } finally {
      saving.value = false
    }
  }

  return {
    payroll,
    loading,
    saving,
    fetchPayroll,
    generatePayroll,
    markPayrollAsPaid
  }
}