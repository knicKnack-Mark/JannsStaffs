<template>
  <div class="payroll-page page-animate" :class="`print-${printMode}`">
    <!-- SUMMARY CARDS -->
    <section class="mb-4 scroll-animate">
      <div class="row g-4">
        <div
          v-for="(card, index) in payrollCards"
          :key="card.title"
          class="col-xl-3 col-md-6 scroll-animate"
          :style="{ transitionDelay: `${index * 0.08}s` }"
        >
          <div class="summary-card h-100" :class="`summary-${card.color}`">
            <div class="summary-icon">
              <Icon :name="card.icon" size="28" />
            </div>

            <div>
              <p class="summary-title mb-1">{{ card.title }}</p>
              <h3 class="summary-value mb-1">{{ card.value }}</h3>
              <p class="summary-desc mb-0">{{ card.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FILTERS -->
    <section class="filter-card mb-4 scroll-animate">
      <div class="filter-header">
        <h5 class="filter-title">Search Staff</h5>

        <div class="filter-actions">
          <button
            class="btn action-btn action-btn-light"
            type="button"
            @click="printPayrollSummary"
          >
            <Icon name="solar:printer-bold-duotone" size="20" />
            <span>Print Payroll</span>
          </button>

          <button
            class="btn action-btn action-btn-primary"
            type="button"
            :disabled="saving"
            @click="generatePayroll(selectedMonth)"
          >
            <Icon name="solar:refresh-circle-bold-duotone" size="20" />
            <span>{{ saving ? 'Generating...' : 'Generate Payroll' }}</span>
          </button>
        </div>
      </div>

      <div class="row g-3 align-items-end">
        <div class="col-xl-4 col-lg-4 col-md-6">
          <label class="form-label">Search</label>

          <div class="search-box">
            <Icon name="solar:magnifer-bold-duotone" size="20" />

            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Search name, position, or employee ID..."
            />
          </div>
        </div>

        <div class="col-xl-3 col-lg-3 col-md-6">
          <label class="form-label">Month</label>

          <select v-model="selectedMonth" class="form-select">
            <option value="June 2026">June 2026</option>
            <option value="May 2026">May 2026</option>
            <option value="April 2026">April 2026</option>
            <option value="March 2026">March 2026</option>
            <option value="February 2026">February 2026</option>
            <option value="January 2026">January 2026</option>
          </select>
        </div>

        <div class="col-xl-2 col-lg-2 col-md-6">
          <label class="form-label">Status</label>

          <select v-model="selectedStatus" class="form-select">
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div class="col-xl-3 col-lg-3 col-md-6">
          <label class="form-label">Position</label>

          <select v-model="selectedPosition" class="form-select">
            <option value="All">All</option>

            <option
              v-for="position in positions"
              :key="position"
              :value="position"
            >
              {{ position }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <!-- PAYROLL TABLE -->
    <section class="table-card scroll-animate">
      <div class="table-card-header">
        <div>
          <h5 class="mb-1">Staff Payroll List</h5>
          <p class="mb-0">
            Showing payroll records for {{ selectedMonth }}
          </p>
        </div>

        <span class="record-count">
          {{ loading ? 'Loading...' : `${filteredPayroll.length} records` }}
        </span>
      </div>

      <div class="table-responsive">
        <table class="table align-middle payroll-table mb-0">
          <thead>
            <tr>
              <th>Staff</th>
              <th>Position</th>
              <th>Rate / Salary</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Gross Salary</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Status</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(staff, index) in filteredPayroll"
              :key="staff.id"
              class="table-row-animate"
              :style="{ animationDelay: `${index * 0.04}s` }"
            >
              <td>
                <div class="staff-info">
                  <div class="staff-avatar">
                    {{ getInitials(staff.name) }}
                  </div>

                  <div>
                    <h6 class="mb-0">{{ staff.name }}</h6>
                    <small>{{ staff.employeeId }}</small>
                  </div>
                </div>
              </td>

              <td>{{ staff.position }}</td>

              <td>
                <strong>{{ formatPeso(staff.salary) }}</strong>
              </td>

              <td>
                <span class="attendance present">
                  {{ staff.presentDays }} days
                </span>
              </td>

              <td>
                <span class="attendance absent">
                  {{ staff.absentDays }} days
                </span>
              </td>

              <td>{{ formatPeso(staff.grossSalary) }}</td>

              <td>
                <span class="deduction">
                  -{{ formatPeso(staff.deductions) }}
                </span>
              </td>

              <td>
                <strong class="net-salary">
                  {{ formatPeso(staff.netSalary) }}
                </strong>
              </td>

              <td>
                <span
                  class="status-badge"
                  :class="staff.status.toLowerCase()"
                >
                  {{ staff.status }}
                </span>
              </td>

              <td>
                <div class="action-buttons">
                  <button
                    class="btn btn-sm btn-light border"
                    title="View Payslip"
                    @click="openPayslip(staff)"
                  >
                    <Icon name="solar:eye-bold-duotone" size="18" />
                  </button>

                  <button
                    class="btn btn-sm btn-light border"
                    title="Print Payslip"
                    @click="printPayslip(staff)"
                  >
                    <Icon name="solar:printer-2-bold-duotone" size="18" />
                  </button>

                  <button
                    v-if="staff.status === 'Pending'"
                    class="btn btn-sm btn-success"
                    title="Mark as Paid"
                    @click="markAsPaid(staff.id)"
                  >
                    <Icon name="solar:check-circle-bold-duotone" size="18" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!loading && filteredPayroll.length === 0">
              <td colspan="10" class="text-center py-5">
                <Icon
                  name="solar:document-bold-duotone"
                  size="48"
                  class="empty-icon mb-2"
                />

                <h6 class="mb-1">No payroll records found</h6>

                <p class="mb-0 text-muted">
                  Click Generate Payroll or change your filters.
                </p>
              </td>
            </tr>

            <tr v-if="loading">
              <td colspan="10" class="text-center py-5">
                <h6 class="mb-0">Loading payroll records...</h6>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- PRINT PAYROLL SUMMARY -->
    <section class="print-payroll-summary">
      <div
        v-for="(group, groupIndex) in payrollPrintGroups"
        :key="groupIndex"
        class="print-page"
      >
        <div class="print-summary-header">
          <div>
            <h2>JANNS SPRING RESORT</h2>
            <p>Staff Payroll Summary</p>
          </div>

          <div class="print-summary-meta">
            <strong>{{ selectedMonth }}</strong>
            <span>{{ group.length }} staff record/s</span>
          </div>
        </div>

        <div class="print-summary-stats">
          <div>
            <span>Total Gross</span>
            <strong>{{ formatPeso(getGroupTotal(group, 'grossSalary')) }}</strong>
          </div>

          <div>
            <span>Total Deductions</span>
            <strong>{{ formatPeso(getGroupTotal(group, 'deductions')) }}</strong>
          </div>

          <div>
            <span>Total Net Payroll</span>
            <strong>{{ formatPeso(getGroupTotal(group, 'netSalary')) }}</strong>
          </div>
        </div>

        <div class="print-payroll-grid">
          <div
            v-for="staff in group"
            :key="staff.id"
            class="print-payroll-card"
          >
            <div class="print-card-top">
              <div class="print-avatar">
                {{ getInitials(staff.name) }}
              </div>

              <div>
                <h5>{{ staff.name }}</h5>
                <p>{{ staff.employeeId }}</p>
              </div>

              <span
                class="print-status"
                :class="staff.status.toLowerCase()"
              >
                {{ staff.status }}
              </span>
            </div>

            <div class="print-detail">
              <span>Position</span>
              <strong>{{ staff.position }}</strong>
            </div>

            <div class="print-detail">
              <span>Base Salary / Rate</span>
              <strong>{{ formatPeso(staff.salary) }}</strong>
            </div>

            <div class="print-attendance-row">
              <div>
                <span>Present</span>
                <strong>{{ staff.presentDays }} days</strong>
              </div>

              <div>
                <span>Absent</span>
                <strong>{{ staff.absentDays }} days</strong>
              </div>
            </div>

            <div class="print-money-row">
              <span>Gross Salary</span>
              <strong>{{ formatPeso(staff.grossSalary) }}</strong>
            </div>

            <div class="print-money-row deduction-text">
              <span>Deductions</span>
              <strong>-{{ formatPeso(staff.deductions) }}</strong>
            </div>

            <div class="print-net-row">
              <span>Net Salary</span>
              <strong>{{ formatPeso(staff.netSalary) }}</strong>
            </div>

            <div class="print-signature-row">
              <div>
                <span>Prepared by</span>
              </div>

              <div>
                <span>Received by</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PAYSLIP MODAL -->
    <div
      v-if="selectedStaff"
      class="modal fade show payroll-modal"
      tabindex="-1"
      style="display: block;"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-pop">
          <div class="modal-header">
            <div>
              <h5 class="modal-title">Payslip Details</h5>
              <small>{{ selectedMonth }}</small>
            </div>

            <button
              type="button"
              class="btn-close"
              @click="selectedStaff = null"
            />
          </div>

          <div class="modal-body">
            <div class="payslip-box">
              <div class="payslip-header">
                <div>
                  <h4 class="mb-1">JANNS SPRING RESORT</h4>
                  <p class="mb-0">Staff Payroll Summary</p>
                </div>

                <span
                  class="status-badge"
                  :class="selectedStaff.status.toLowerCase()"
                >
                  {{ selectedStaff.status }}
                </span>
              </div>

              <hr />

              <div class="row g-4">
                <div class="col-md-6">
                  <div class="detail-item">
                    <span>Employee Name</span>
                    <strong>{{ selectedStaff.name }}</strong>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="detail-item">
                    <span>Employee ID</span>
                    <strong>{{ selectedStaff.employeeId }}</strong>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="detail-item">
                    <span>Position</span>
                    <strong>{{ selectedStaff.position }}</strong>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="detail-item">
                    <span>Payroll Month</span>
                    <strong>{{ selectedMonth }}</strong>
                  </div>
                </div>
              </div>

              <div class="salary-breakdown mt-4">
                <h6 class="mb-3">Salary Breakdown</h6>

                <div class="breakdown-row">
                  <span>Base Salary / Rate</span>
                  <strong>{{ formatPeso(selectedStaff.salary) }}</strong>
                </div>

                <div class="breakdown-row">
                  <span>Days Present</span>
                  <strong>{{ selectedStaff.presentDays }} days</strong>
                </div>

                <div class="breakdown-row">
                  <span>Days Absent</span>
                  <strong>{{ selectedStaff.absentDays }} days</strong>
                </div>

                <div class="breakdown-row">
                  <span>Gross Salary</span>
                  <strong>{{ formatPeso(selectedStaff.grossSalary) }}</strong>
                </div>

                <div class="breakdown-row text-danger">
                  <span>Deductions</span>
                  <strong>-{{ formatPeso(selectedStaff.deductions) }}</strong>
                </div>

                <div class="breakdown-row total">
                  <span>Net Salary</span>
                  <strong>{{ formatPeso(selectedStaff.netSalary) }}</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              class="btn btn-light border"
              @click="selectedStaff = null"
            >
              Close
            </button>

            <button
              class="btn btn-success"
              @click="printPayslip(selectedStaff)"
            >
              <Icon name="solar:printer-2-bold-duotone" size="18" />
              Print Payslip
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="selectedStaff"
      class="modal-backdrop fade show"
      @click="selectedStaff = null"
    />
  </div>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

definePageMeta({
  title: 'Payroll Summary',
  subtitle: 'Monitor staff salary, attendance, deductions, and payroll status.'
})

const {
  payroll,
  loading,
  saving,
  fetchPayroll,
  generatePayroll,
  markPayrollAsPaid
} = usePayroll()

const search = ref('')
const selectedMonth = ref('June 2026')
const selectedStatus = ref('All')
const selectedPosition = ref('All')
const selectedStaff = ref(null)
const printMode = ref('none')

let observer = null

const payrollWithNet = computed(() => {
  return payroll.value.map((staff) => ({
    ...staff,
    salary: Number(staff.salary || 0),
    presentDays: Number(staff.presentDays || 0),
    absentDays: Number(staff.absentDays || 0),
    grossSalary: Number(staff.grossSalary || 0),
    deductions: Number(staff.deductions || 0),
    netSalary: Number(staff.netSalary ?? staff.grossSalary - staff.deductions)
  }))
})

const positions = computed(() => {
  return [...new Set(payroll.value.map((staff) => staff.position).filter(Boolean))]
})

const filteredPayroll = computed(() => {
  return payrollWithNet.value.filter((staff) => {
    const keyword = search.value.toLowerCase().trim()

    const matchesSearch =
      staff.name?.toLowerCase().includes(keyword) ||
      staff.position?.toLowerCase().includes(keyword) ||
      staff.employeeId?.toLowerCase().includes(keyword)

    const matchesStatus =
      selectedStatus.value === 'All' || staff.status === selectedStatus.value

    const matchesPosition =
      selectedPosition.value === 'All' ||
      staff.position === selectedPosition.value

    return matchesSearch && matchesStatus && matchesPosition
  })
})

const payrollPrintGroups = computed(() => {
  const groups = []

  for (let index = 0; index < filteredPayroll.value.length; index += 8) {
    groups.push(filteredPayroll.value.slice(index, index + 8))
  }

  return groups
})

const totalGrossSalary = computed(() => {
  return filteredPayroll.value.reduce((total, staff) => {
    return total + Number(staff.grossSalary || 0)
  }, 0)
})

const totalDeductions = computed(() => {
  return filteredPayroll.value.reduce((total, staff) => {
    return total + Number(staff.deductions || 0)
  }, 0)
})

const totalNetPayroll = computed(() => {
  return filteredPayroll.value.reduce((total, staff) => {
    return total + Number(staff.netSalary || 0)
  }, 0)
})

const totalPendingPayroll = computed(() => {
  return filteredPayroll.value
    .filter((staff) => staff.status === 'Pending')
    .reduce((total, staff) => {
      return total + Number(staff.netSalary || 0)
    }, 0)
})

const payrollCards = computed(() => [
  {
    title: 'Total Salary Expense',
    value: formatPeso(totalGrossSalary.value),
    description: 'Gross payroll amount',
    icon: 'solar:wallet-money-bold-duotone',
    color: 'green'
  },
  {
    title: 'Total Deductions',
    value: formatPeso(totalDeductions.value),
    description: 'Absences and deductions',
    icon: 'solar:bill-check-bold-duotone',
    color: 'orange'
  },
  {
    title: 'Net Payroll',
    value: formatPeso(totalNetPayroll.value),
    description: 'Total amount to release',
    icon: 'solar:money-bag-bold-duotone',
    color: 'blue'
  },
  {
    title: 'Pending Payroll',
    value: formatPeso(totalPendingPayroll.value),
    description: 'Not yet marked as paid',
    icon: 'solar:clock-circle-bold-duotone',
    color: 'red'
  }
])

const observeScrollItems = async () => {
  await nextTick()

  const animatedItems = document.querySelectorAll('.scroll-animate:not(.show)')

  animatedItems.forEach((item) => {
    if (observer) {
      observer.observe(item)
    }
  })
}

const formatPeso = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0
  }).format(Number(amount || 0))
}

const getInitials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const getGroupTotal = (group, field) => {
  return group.reduce((total, staff) => {
    return total + Number(staff[field] || 0)
  }, 0)
}

const openPayslip = (staff) => {
  selectedStaff.value = staff
}

const markAsPaid = async (id) => {
  await markPayrollAsPaid(id)
}

const resetPrintMode = () => {
  printMode.value = 'none'

  if (process.client) {
    document.body.classList.remove('printing-payroll-summary')
    document.body.classList.remove('printing-payslip')
  }
}

const printPayrollSummary = async () => {
  selectedStaff.value = null
  printMode.value = 'summary'

  await nextTick()

  if (process.client) {
    document.body.classList.add('printing-payroll-summary')
  }

  setTimeout(() => {
    window.print()
  }, 150)
}

const printPayslip = async (staff) => {
  selectedStaff.value = staff
  printMode.value = 'payslip'

  await nextTick()

  if (process.client) {
    document.body.classList.add('printing-payslip')
  }

  setTimeout(() => {
    window.print()
  }, 150)
}

onMounted(async () => {
  window.addEventListener('afterprint', resetPrintMode)

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show')
        } else {
          entry.target.classList.remove('show')
        }
      })
    },
    {
      threshold: 0.12
    }
  )

  await fetchPayroll(selectedMonth.value)
  await observeScrollItems()
})

watch(selectedMonth, async () => {
  await fetchPayroll(selectedMonth.value)
})

watch(
  filteredPayroll,
  async () => {
    await observeScrollItems()
  },
  { deep: true }
)

onBeforeUnmount(() => {
  window.removeEventListener('afterprint', resetPrintMode)

  if (observer) {
    observer.disconnect()
  }

  resetPrintMode()
})
</script>

<style scoped>
.payroll-page {
  padding-bottom: 24px;
}

.page-animate {
  animation: pageFadeSlide 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes pageFadeSlide {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scroll-animate {
  opacity: 0;
  transform: translateY(30px) scale(0.985);
  transition:
    opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.scroll-animate.show {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.table-row-animate {
  opacity: 0;
  animation: tableRowFade 0.45s ease forwards;
}

@keyframes tableRowFade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-pop {
  animation: modalPop 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes modalPop {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.summary-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  padding: 1.25rem;
  background: #fff;
  border: 1px solid rgba(22, 32, 21, 0.08);
  box-shadow: 0 12px 35px rgba(22, 32, 21, 0.08);
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: 0.25s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 45px rgba(22, 32, 21, 0.12);
}

.summary-card::after {
  content: '';
  position: absolute;
  right: -40px;
  top: -40px;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  opacity: 0.12;
}

.summary-icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.summary-title {
  color: #6c757d;
  font-weight: 700;
  font-size: 0.9rem;
}

.summary-value {
  font-weight: 900;
  color: #162015;
}

.summary-desc {
  color: #8a8f98;
  font-size: 0.85rem;
}

.summary-green .summary-icon,
.summary-green::after {
  background: #dff7e7;
  color: #198754;
}

.summary-blue .summary-icon,
.summary-blue::after {
  background: #e3f0ff;
  color: #0d6efd;
}

.summary-orange .summary-icon,
.summary-orange::after {
  background: #fff0dc;
  color: #fd7e14;
}

.summary-red .summary-icon,
.summary-red::after {
  background: #ffe5e8;
  color: #dc3545;
}

.filter-card,
.table-card {
  background: #fff;
  border-radius: 24px;
  border: 1px solid rgba(22, 32, 21, 0.08);
  box-shadow: 0 12px 35px rgba(22, 32, 21, 0.07);
}

.filter-card {
  padding: 1.5rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.filter-title {
  font-weight: 900;
  color: #162015;
  margin: 0;
}

.filter-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-btn {
  min-height: 46px;
  border-radius: 16px;
  padding: 0 18px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn:active {
  transform: scale(0.97);
}

.action-btn-light {
  background: #ffffff;
  color: #344054;
  border: 1px solid rgba(15, 23, 42, 0.12);
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
}

.action-btn-light:hover {
  background: #f8fafc;
  color: #101828;
}

.action-btn-primary {
  background: #198754;
  color: #ffffff;
  border: 1px solid #198754;
  box-shadow: 0 8px 22px rgba(25, 135, 84, 0.22);
}

.action-btn-primary:hover {
  background: #157347;
  border-color: #157347;
  color: #ffffff;
}

.form-label {
  font-weight: 800;
  font-size: 0.85rem;
  color: #3f493f;
}

.search-box {
  position: relative;
}

.search-box :deep(svg),
.search-box :deep(.iconify) {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 2;
  pointer-events: none;
}

.search-box .form-control {
  padding-left: 2.8rem;
}

.form-control,
.form-select {
  border-radius: 14px;
  min-height: 46px;
  border-color: rgba(22, 32, 21, 0.12);
  transition: 0.25s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #2f8f46;
  box-shadow: 0 0 0 0.2rem rgba(47, 143, 70, 0.13);
  transform: translateY(-1px);
}

.table-card {
  overflow: hidden;
}

.table-card-header {
  padding: 1.25rem;
  border-bottom: 1px solid rgba(22, 32, 21, 0.08);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.table-card-header h5 {
  font-weight: 900;
  color: #162015;
}

.table-card-header p {
  color: #6c757d;
  font-size: 0.9rem;
}

.record-count {
  background: #effaf2;
  color: #198754;
  font-weight: 800;
  border-radius: 999px;
  padding: 0.45rem 0.8rem;
  font-size: 0.85rem;
  white-space: nowrap;
}

.payroll-table thead th {
  background: #f8faf8;
  color: #536153;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 1rem;
  border-bottom: 1px solid rgba(22, 32, 21, 0.08);
  white-space: nowrap;
}

.payroll-table tbody td {
  padding: 1rem;
  color: #3f493f;
  border-bottom: 1px solid rgba(22, 32, 21, 0.06);
  white-space: nowrap;
}

.payroll-table tbody tr {
  transition: 0.25s ease;
}

.payroll-table tbody tr:hover {
  background: #fbfdfb;
}

.staff-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.staff-avatar {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(135deg, #198754, #8cc63f);
  color: #fff;
  font-weight: 900;
  display: grid;
  place-items: center;
}

.staff-info h6 {
  font-weight: 900;
  color: #162015;
}

.staff-info small {
  color: #8a8f98;
  font-weight: 700;
}

.attendance {
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  font-weight: 800;
  font-size: 0.8rem;
}

.attendance.present {
  background: #e7f8ed;
  color: #198754;
}

.attendance.absent {
  background: #ffe8e8;
  color: #dc3545;
}

.deduction {
  color: #dc3545;
  font-weight: 800;
}

.net-salary {
  color: #198754;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.38rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 900;
}

.status-badge.paid {
  background: #e7f8ed;
  color: #198754;
}

.status-badge.pending {
  background: #fff0dc;
  color: #fd7e14;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.45rem;
}

.action-buttons .btn {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  padding: 0;
  transition: 0.25s ease;
}

.action-buttons .btn:hover {
  transform: translateY(-2px);
}

.empty-icon {
  color: #adb5bd;
}

.payroll-modal {
  background: rgba(0, 0, 0, 0.15);
}

.modal-content {
  border: 0;
  border-radius: 24px;
  overflow: hidden;
}

.modal-header,
.modal-footer {
  border-color: rgba(22, 32, 21, 0.08);
}

.modal-title {
  font-weight: 900;
}

.payslip-box {
  border: 1px solid rgba(22, 32, 21, 0.08);
  border-radius: 20px;
  padding: 1.25rem;
  background: #fbfdfb;
}

.payslip-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.payslip-header h4 {
  font-weight: 900;
  color: #162015;
}

.payslip-header p {
  color: #6c757d;
}

.detail-item {
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid rgba(22, 32, 21, 0.06);
}

.detail-item span {
  display: block;
  color: #8a8f98;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.detail-item strong {
  color: #162015;
}

.salary-breakdown {
  background: #fff;
  border-radius: 18px;
  padding: 1rem;
  border: 1px solid rgba(22, 32, 21, 0.06);
}

.salary-breakdown h6 {
  font-weight: 900;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px dashed rgba(22, 32, 21, 0.12);
}

.breakdown-row:last-child {
  border-bottom: 0;
}

.breakdown-row.total {
  margin-top: 0.5rem;
  padding: 1rem;
  border-radius: 16px;
  background: #effaf2;
  color: #198754;
  font-size: 1.05rem;
  font-weight: 900;
}

.print-payroll-summary {
  display: none;
}

@media (max-width: 991px) {
  .filter-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-actions {
    width: 100%;
  }

  .filter-actions .btn {
    flex: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-animate,
  .scroll-animate,
  .scroll-animate.show,
  .table-row-animate,
  .modal-pop {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
    transition: none !important;
  }

  .summary-card,
  .action-btn,
  .form-control,
  .form-select,
  .payroll-table tbody tr,
  .action-buttons .btn {
    transition: none !important;
  }
}
</style>

<style>
@media print {
  @page {
    size: A4 portrait;
    margin: 8mm;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body.printing-payroll-summary * {
    visibility: hidden !important;
  }

  body.printing-payroll-summary .print-payroll-summary,
  body.printing-payroll-summary .print-payroll-summary * {
    visibility: visible !important;
  }

  body.printing-payroll-summary .print-payroll-summary {
    display: block !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    z-index: 999999 !important;
  }

  body.printing-payroll-summary .print-page {
    min-height: 277mm;
    page-break-after: always;
    background: #ffffff !important;
  }

  body.printing-payroll-summary .print-page:last-child {
    page-break-after: auto;
  }

  body.printing-payroll-summary .print-summary-header {
    display: flex !important;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 6px;
    border-bottom: 2px solid #198754;
    margin-bottom: 8px;
  }

  body.printing-payroll-summary .print-summary-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 900;
    color: #162015;
  }

  body.printing-payroll-summary .print-summary-header p {
    margin: 2px 0 0;
    font-size: 11px;
    color: #536153;
    font-weight: 700;
  }

  body.printing-payroll-summary .print-summary-meta {
    text-align: right;
  }

  body.printing-payroll-summary .print-summary-meta strong {
    display: block;
    font-size: 12px;
    color: #162015;
  }

  body.printing-payroll-summary .print-summary-meta span {
    display: block;
    font-size: 10px;
    color: #6c757d;
  }

  body.printing-payroll-summary .print-summary-stats {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin-bottom: 8px;
  }

  body.printing-payroll-summary .print-summary-stats div {
    border: 1px solid rgba(22, 32, 21, 0.12);
    border-radius: 9px;
    padding: 6px 8px;
    background: #f8faf8 !important;
  }

  body.printing-payroll-summary .print-summary-stats span {
    display: block;
    font-size: 8px;
    color: #6c757d;
    font-weight: 800;
    text-transform: uppercase;
  }

  body.printing-payroll-summary .print-summary-stats strong {
    display: block;
    font-size: 11px;
    color: #162015;
    margin-top: 2px;
  }

  body.printing-payroll-summary .print-payroll-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  body.printing-payroll-summary .print-payroll-card {
    min-height: 58mm;
    border: 1px solid rgba(22, 32, 21, 0.14);
    border-radius: 10px;
    padding: 8px;
    background: #ffffff !important;
    break-inside: avoid;
  }

  body.printing-payroll-summary .print-card-top {
    display: grid !important;
    grid-template-columns: 30px 1fr auto;
    gap: 6px;
    align-items: center;
    padding-bottom: 6px;
    border-bottom: 1px dashed rgba(22, 32, 21, 0.16);
    margin-bottom: 6px;
  }

  body.printing-payroll-summary .print-avatar {
    width: 30px;
    height: 30px;
    border-radius: 9px;
    background: linear-gradient(135deg, #198754, #8cc63f) !important;
    color: #ffffff !important;
    font-weight: 900;
    font-size: 10px;
    display: grid !important;
    place-items: center;
  }

  body.printing-payroll-summary .print-card-top h5 {
    margin: 0;
    color: #162015;
    font-size: 11px;
    font-weight: 900;
  }

  body.printing-payroll-summary .print-card-top p {
    margin: 1px 0 0;
    color: #6c757d;
    font-size: 8px;
    font-weight: 800;
  }

  body.printing-payroll-summary .print-status {
    border-radius: 999px;
    padding: 3px 6px;
    font-size: 7px;
    font-weight: 900;
  }

  body.printing-payroll-summary .print-status.paid {
    background: #e7f8ed !important;
    color: #198754 !important;
  }

  body.printing-payroll-summary .print-status.pending {
    background: #fff0dc !important;
    color: #fd7e14 !important;
  }

  body.printing-payroll-summary .print-detail,
  body.printing-payroll-summary .print-money-row,
  body.printing-payroll-summary .print-net-row {
    display: flex !important;
    justify-content: space-between;
    gap: 6px;
    padding: 3px 0;
    font-size: 9px;
  }

  body.printing-payroll-summary .print-detail span,
  body.printing-payroll-summary .print-money-row span,
  body.printing-payroll-summary .print-net-row span,
  body.printing-payroll-summary .print-attendance-row span {
    color: #6c757d;
    font-weight: 700;
  }

  body.printing-payroll-summary .print-detail strong,
  body.printing-payroll-summary .print-money-row strong,
  body.printing-payroll-summary .print-net-row strong,
  body.printing-payroll-summary .print-attendance-row strong {
    color: #162015;
    font-weight: 900;
  }

  body.printing-payroll-summary .print-attendance-row {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    margin: 4px 0;
  }

  body.printing-payroll-summary .print-attendance-row div {
    border-radius: 7px;
    background: #f8faf8 !important;
    padding: 4px;
  }

  body.printing-payroll-summary .print-attendance-row span,
  body.printing-payroll-summary .print-attendance-row strong {
    display: block;
    font-size: 8px;
  }

  body.printing-payroll-summary .deduction-text strong {
    color: #dc3545 !important;
  }

  body.printing-payroll-summary .print-net-row {
    margin-top: 4px;
    padding: 6px;
    border-radius: 8px;
    background: #effaf2 !important;
  }

  body.printing-payroll-summary .print-net-row span,
  body.printing-payroll-summary .print-net-row strong {
    color: #198754 !important;
    font-size: 10px;
  }

  body.printing-payroll-summary .print-signature-row {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-top: 9px;
  }

  body.printing-payroll-summary .print-signature-row div {
    border-top: 1px solid #162015;
    padding-top: 3px;
    text-align: center;
  }

  body.printing-payroll-summary .print-signature-row span {
    font-size: 7px;
    color: #6c757d;
    font-weight: 700;
  }

  body.printing-payslip * {
    visibility: hidden !important;
  }

  body.printing-payslip .payroll-modal,
  body.printing-payslip .payroll-modal * {
    visibility: visible !important;
  }

  body.printing-payslip .payroll-modal {
    position: absolute !important;
    display: block !important;
    background: transparent !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
  }

  body.printing-payslip .modal-dialog {
    max-width: 100% !important;
    margin: 0 !important;
  }

  body.printing-payslip .modal-content {
    box-shadow: none !important;
    border: 0 !important;
  }

  body.printing-payslip .modal-body {
    padding: 0 !important;
  }

  body.printing-payslip .modal-header,
  body.printing-payslip .modal-footer,
  body.printing-payslip .modal-backdrop {
    display: none !important;
  }

  body.printing-payslip .payslip-box {
    border: 0 !important;
  }
}
</style>