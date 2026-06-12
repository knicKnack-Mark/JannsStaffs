import { ref } from 'vue'
import toastification from 'vue-toastification'

export const usePayroll = () => {
  const { apiFetch } = useApi()
  const { useToast } = toastification

  const payroll = ref([])
  const loading = ref(false)
  const saving = ref(false)

  const fetchPayroll = async (month) => {
    try {
      loading.value = true

      const res = await apiFetch('/payrolls', {
        query: { month }
      })

      payroll.value = res.data || []
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || 'Failed to load payroll.')
    } finally {
      loading.value = false
    }
  }

  const generatePayroll = async (month) => {
    try {
      saving.value = true

      const res = await apiFetch('/payrolls/generate', {
        method: 'POST',
        body: {
          payroll_month: month,
          working_days: 26
        }
      })

      toast.success(res.message || 'Payroll generated successfully.')
      await fetchPayroll(month)
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || 'Failed to generate payroll.')
    } finally {
      saving.value = false
    }
  }

  const markPayrollAsPaid = async (id) => {
    try {
      const res = await apiFetch(`/payrolls/${id}/paid`, {
        method: 'PATCH'
      })

      const index = payroll.value.findIndex(item => item.id === id)

      if (index !== -1) {
        payroll.value[index] = res.data
      }

      toast.success(res.message || 'Payroll marked as paid.')
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || 'Failed to update payroll.')
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