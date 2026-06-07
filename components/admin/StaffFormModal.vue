<template>
  <Transition name="modal-fade">
    <div
      v-if="show"
      class="custom-modal-backdrop"
      @click.self="closeModal"
    >
      <div class="custom-modal">
        <div class="modal-header-custom">
          <div>
            <h5 class="fw-bold mb-1">
              {{ isEdit ? 'Update Staff' : 'Add New Staff' }}
            </h5>

            <p class="text-muted mb-0">
              {{ isEdit ? 'Edit staff profile, salary, status, and photo.' : 'Create a new staff profile for JANNS SPRING RESORT.' }}
            </p>
          </div>

          <button
            class="modal-close-btn"
            type="button"
            :disabled="loading"
            @click="closeModal"
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
              <label class="form-label">Full Name</label>

              <input
                v-model="form.name"
                type="text"
                class="form-control modal-input"
                placeholder="Enter staff full name"
                :disabled="loading"
                required
              />
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label">Position</label>

              <input
                v-model="form.position"
                type="text"
                class="form-control modal-input"
                placeholder="Example: Housekeeping Staff"
                :disabled="loading"
                required
              />
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label">Phone</label>

              <input
                v-model="form.phone"
                type="text"
                class="form-control modal-input"
                placeholder="Example: 0917 123 4567"
                :disabled="loading"
                required
              />
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label">Salary Type</label>

              <select
                v-model="form.salaryType"
                class="form-select modal-input"
                :disabled="loading"
                required
              >
                <option value="Monthly">Monthly</option>
                <option value="Daily">Daily</option>
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
                :disabled="loading"
                required
              />

              <input
                v-else
                v-model.number="form.dailyRate"
                type="number"
                class="form-control modal-input"
                placeholder="Enter daily rate"
                min="0"
                :disabled="loading"
                required
              />
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label">Status</label>

              <select
                v-model="form.status"
                class="form-select modal-input"
                :disabled="loading"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label">Staff Photo</label>

              <label
                class="file-upload-box"
                :class="{ disabled: loading }"
              >
                <Icon name="solar:upload-bold-duotone" size="20" />

                <span>
                  {{ selectedPhotoName }}
                </span>

                <input
                  ref="fileInput"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  :disabled="loading"
                  @change="handleAvatarUpload"
                />
              </label>
            </div>

            <div
              v-if="photoPreview"
              class="col-12"
            >
              <div class="photo-preview-card">
                <img
                  :src="photoPreview"
                  alt="Staff photo preview"
                  class="photo-preview"
                />

                <div>
                  <p class="fw-bold mb-1">
                    {{ form.avatar ? 'Selected Photo' : 'Current Photo' }}
                  </p>

                  <p class="text-muted mb-0 small">
                    {{ form.avatar?.name || 'Existing staff photo' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-actions mt-4">
            <button
              class="btn cancel-btn"
              type="button"
              :disabled="loading"
              @click="closeModal"
            >
              Cancel
            </button>

            <button
              class="btn save-btn"
              type="submit"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm"
              ></span>

              <Icon
                v-else
                name="solar:diskette-bold-duotone"
                size="18"
              />

              <span>
                {{ loading ? loadingText : buttonText }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'add'
  },
  staff: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'close',
  'save'
])

const fileInput = ref(null)
const photoPreview = ref(null)

const isEdit = computed(() => props.mode === 'edit')

const buttonText = computed(() => isEdit.value ? 'Save Changes' : 'Save Staff')
const loadingText = computed(() => isEdit.value ? 'Saving Changes...' : 'Saving Staff...')
const selectedPhotoName = computed(() => {
  if (form.avatar?.name) return form.avatar.name
  if (isEdit.value && photoPreview.value) return 'Change photo'
  return 'Upload photo'
})

const getDefaultForm = () => ({
  id: null,
  name: '',
  position: '',
  phone: '',
  salaryType: 'Monthly',
  monthlySalary: '',
  dailyRate: '',
  status: 'Active',
  avatar: null,
  currentAvatar: null
})

const form = reactive(getDefaultForm())

const fillForm = () => {
  Object.assign(form, getDefaultForm())

  if (isEdit.value && props.staff) {
    Object.assign(form, {
      id: props.staff.id,
      name: props.staff.name || '',
      position: props.staff.position || '',
      phone: props.staff.phone || '',
      salaryType: props.staff.salaryType || 'Monthly',
      monthlySalary: props.staff.monthlySalary || '',
      dailyRate: props.staff.dailyRate || '',
      status: props.staff.status || 'Active',
      avatar: null,
      currentAvatar: props.staff.avatar || null
    })

    photoPreview.value = props.staff.avatar || null
  } else {
    photoPreview.value = null
  }

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleAvatarUpload = (event) => {
  const file = event.target.files?.[0]

  if (!file) {
    form.avatar = null
    photoPreview.value = form.currentAvatar || null
    return
  }

  form.avatar = file
  photoPreview.value = URL.createObjectURL(file)
}

const resetForm = () => {
  Object.assign(form, getDefaultForm())
  photoPreview.value = null

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const closeModal = () => {
  if (props.loading) return

  resetForm()
  emit('close')
}

const submitForm = () => {
  if (props.loading) return

  emit('save', { ...form })
}

const handleEscape = (event) => {
  if (event.key === 'Escape' && props.show && !props.loading) {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})

watch(
  () => props.show,
  (value) => {
    if (value) {
      fillForm()
    } else {
      resetForm()
    }
  }
)

watch(
  () => props.staff,
  () => {
    if (props.show && isEdit.value) {
      fillForm()
    }
  },
  { deep: true }
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

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .custom-modal,
.modal-fade-leave-active .custom-modal {
  transition:
    opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.modal-fade-enter-from .custom-modal,
.modal-fade-leave-to .custom-modal {
  opacity: 0;
  transform: translateY(24px) scale(0.94);
}

.modal-fade-enter-to .custom-modal,
.modal-fade-leave-from .custom-modal {
  opacity: 1;
  transform: translateY(0) scale(1);
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

.modal-close-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.photo-preview-card {
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 14px;

  border-radius: 18px;
  background: #f4f8f7;
}

.photo-preview {
  width: 58px;
  height: 58px;

  border-radius: 50%;

  object-fit: cover;
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

.cancel-btn:disabled,
.save-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
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

.file-upload-box {
  height: 52px;
  width: 100%;

  border-radius: 16px;
  background: #f4f8f7;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 0 16px;

  color: #64748b;
  font-weight: 700;

  cursor: pointer;
  transition: 0.25s ease;
}

.file-upload-box:hover {
  background: #edf5f3;
  color: #148b80;
}

.file-upload-box.disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.file-upload-box input {
  display: none;
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