<template>
  <div
    v-if="show"
    class="custom-modal-backdrop"
    @click.self="$emit('close')"
  >
    <div class="custom-modal">
      <div class="modal-header-custom">
        <div>
          <h5 class="fw-bold mb-1">
            Add New Staff
          </h5>

          <p class="text-muted mb-0">
            Create a new staff profile for JANNS SPRING RESORT.
          </p>
        </div>

        <button
          class="modal-close-btn"
          type="button"
          @click="$emit('close')"
        >
          <Icon
            name="solar:close-circle-bold-duotone"
            size="26"
          />
        </button>
      </div>

      <form @submit.prevent="submitForm">
        <div class="row g-3 mt-2">
          <div class="col-12">
            <label class="form-label">
              Full Name
            </label>

            <input
              v-model="form.name"
              type="text"
              class="form-control modal-input"
              placeholder="Enter staff full name"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label">
              Position
            </label>

            <input
              v-model="form.position"
              type="text"
              class="form-control modal-input"
              placeholder="Example: Housekeeping Staff"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label">
              Phone
            </label>

            <input
              v-model="form.phone"
              type="text"
              class="form-control modal-input"
              placeholder="Example: 0917 123 4567"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label">
              Salary Type
            </label>

            <select
              v-model="form.salaryType"
              class="form-select modal-input"
              required
            >
              <option value="Monthly">
                Monthly
              </option>

              <option value="Daily">
                Daily
              </option>
            </select>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label">
              {{ form.salaryType === 'Monthly' ? 'Monthly Salary' : 'Daily Rate' }}
            </label>

            <input
              v-if="form.salaryType === 'Monthly'"
              v-model.number="form.monthlySalary"
              type="number"
              class="form-control modal-input"
              placeholder="Enter monthly salary"
              min="0"
              required
            />

            <input
              v-else
              v-model.number="form.dailyRate"
              type="number"
              class="form-control modal-input"
              placeholder="Enter daily rate"
              min="0"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label">
              Status
            </label>

            <select
              v-model="form.status"
              class="form-select modal-input"
              required
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label">
              Avatar
            </label>

            <select
              v-model="form.avatar"
              class="form-select modal-input"
            >
              <option
                v-for="avatar in avatarOptions"
                :key="avatar"
                :value="avatar"
              >
                Avatar {{ avatar }}
              </option>
            </select>
          </div>
        </div>

        <div class="modal-actions mt-4">
          <button
            class="btn cancel-btn"
            type="button"
            @click="$emit('close')"
          >
            Cancel
          </button>

          <button
            class="btn save-btn"
            type="submit"
          >
            <Icon
              name="solar:diskette-bold-duotone"
              size="18"
            />

            <span>Save Staff</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'close',
  'save'
])

const avatarOptions = [5, 8, 12, 15, 26, 32, 45, 53]

const getDefaultForm = () => ({
  name: '',
  position: '',
  phone: '',
  salaryType: 'Monthly',
  monthlySalary: 0,
  dailyRate: 0,
  status: 'Active',
  avatar: 5
})

const form = reactive(getDefaultForm())

const resetForm = () => {
  Object.assign(form, getDefaultForm())
}

const submitForm = () => {
  emit('save', { ...form })
  resetForm()
}

watch(
  () => props.show,
  (value) => {
    if (!value) {
      resetForm()
    }
  }
)
</script>

<style scoped>
.custom-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;

  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(5px);

  padding: 18px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-modal {
  width: 100%;
  max-width: 760px;
  max-height: 92vh;

  overflow-y: auto;

  background: white;

  border-radius: 30px;

  padding: 26px;

  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.28);
}

.modal-header-custom {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.modal-close-btn {
  width: 44px;
  height: 44px;

  border: none;

  border-radius: 16px;

  background: #f4f8f7;
  color: #148b80;

  display: flex;
  align-items: center;
  justify-content: center;
}

.form-label {
  color: #374151;

  font-size: 0.85rem;
  font-weight: 700;
}

.modal-input {
  height: 52px;

  border: none;

  border-radius: 16px;

  background: #f4f8f7;

  box-shadow: none;
}

.modal-input:focus {
  background: #f4f8f7;
  box-shadow: 0 0 0 3px rgba(20, 139, 128, 0.12);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn,
.save-btn {
  height: 48px;

  border-radius: 16px;

  padding: 0 18px;

  border: none;

  font-weight: 700;
}

.cancel-btn {
  background: #f4f8f7;
  color: #64748b;
}

.save-btn {
  background: linear-gradient(180deg, #0b5b54, #148b80);
  color: white;

  display: flex;
  align-items: center;
  gap: 8px;
}

.save-btn:hover {
  color: white;
}

@media (max-width: 767px) {
  .custom-modal {
    padding: 22px;
    border-radius: 24px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>