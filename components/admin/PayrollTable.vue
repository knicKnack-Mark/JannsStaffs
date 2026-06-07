<template>
  <section class="table-card scroll-animate">
    <div class="table-card-header">
      <div>
        <h5 class="mb-1">Staff Payroll List</h5>
        <p class="mb-0">
          Showing payroll records for {{ selectedMonth }}
        </p>
      </div>

      <span class="record-count">
        {{ loading ? 'Loading...' : `${payroll.length} records` }}
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
            v-for="(staff, index) in payroll"
            :key="staff.id"
            class="table-row-animate"
            :style="{ animationDelay: `${index * 0.04}s` }"
          >
            <td>
              <div class="staff-info">
                <div class="staff-avatar">
                  <img
                    v-if="staff.image"
                    :src="staff.image"
                    :alt="staff.name"
                    class="staff-avatar-img"
                  >

                  <span v-else>
                    {{ getInitials(staff.name) }}
                  </span>
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
                  @click="$emit('viewPayslip', staff)"
                >
                  <Icon name="solar:eye-bold-duotone" size="18" />
                </button>

                <button
                  class="btn btn-sm btn-light border"
                  title="Print Payslip"
                  @click="$emit('printPayslip', staff)"
                >
                  <Icon name="solar:printer-2-bold-duotone" size="18" />
                </button>

                <button
                  v-if="staff.status === 'Pending'"
                  class="btn btn-sm btn-success"
                  title="Mark as Paid"
                  @click="$emit('markAsPaid', staff.id)"
                >
                  <Icon name="solar:check-circle-bold-duotone" size="18" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!loading && payroll.length === 0">
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
</template>

<script setup>
defineProps({
  payroll: {
    type: Array,
    default: () => []
  },
  selectedMonth: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  formatPeso: {
    type: Function,
    required: true
  },
  getInitials: {
    type: Function,
    required: true
  }
})

defineEmits([
  'viewPayslip',
  'printPayslip',
  'markAsPaid'
])
</script>

<style scoped>
.table-card {
  background: #fff;
  border-radius: 24px;
  border: 1px solid rgba(22, 32, 21, 0.08);
  box-shadow: 0 12px 35px rgba(22, 32, 21, 0.07);
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
  overflow: hidden;
  flex-shrink: 0;
}

.staff-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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
</style>