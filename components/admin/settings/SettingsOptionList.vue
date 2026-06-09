<template>
  <div class="settings-card">
    <div class="card-title-wrapper">
      <div>
        <h5>{{ title }}</h5>
        <p>{{ description }}</p>
      </div>

      <Icon :name="icon" size="34" />
    </div>

    <div class="add-row mb-3">
      <input
        v-model="newValue"
        type="text"
        class="form-control custom-input"
        :placeholder="placeholder"
        @keyup.enter="addItem"
      />

      <button
        type="button"
        class="btn btn-add"
        @click="addItem"
      >
        Add
      </button>
    </div>

    <div class="list-wrapper">
      <div
        v-for="item in items"
        :key="item"
        class="settings-list-item"
      >
        <span>{{ item }}</span>

        <button
          type="button"
          class="btn-icon danger"
          @click="$emit('remove', item)"
        >
          <Icon name="solar:trash-bin-trash-bold-duotone" size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newValue = ref('')

defineProps({
  items: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Add item'
  }
})

const emit = defineEmits(['add', 'remove'])

const addItem = () => {
  const value = newValue.value.trim()

  if (!value) return

  emit('add', value)
  newValue.value = ''
}
</script>

<style scoped>
.settings-card {
  background: white;
  border-radius: 26px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.card-title-wrapper {
  margin-bottom: 22px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  color: #0b5b54;
}

.card-title-wrapper h5 {
  margin-bottom: 4px;
  color: #143c3a;
  font-weight: 800;
}

.card-title-wrapper p {
  margin-bottom: 0;
  color: #7b8a8a;
}

.add-row {
  display: flex;
  gap: 10px;
}

.custom-input {
  height: 50px;
  border: none;
  border-radius: 16px;
  background: #f4f8f7;
  box-shadow: none;
}

.custom-input:focus {
  background: #f4f8f7;
  box-shadow: 0 0 0 3px rgba(20, 139, 128, 0.12);
}

.btn-add {
  height: 50px;
  padding: 0 20px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(180deg, #0b5b54, #148b80);
  color: white;
  font-weight: 800;
}

.btn-add:hover {
  color: white;
  transform: translateY(-1px);
}

.list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.settings-list-item {
  min-height: 58px;
  padding: 10px 14px;
  border-radius: 17px;
  background: #f4f8f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.settings-list-item span {
  color: #334155;
  font-weight: 800;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 14px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon.danger {
  color: #dc3545;
}

.btn-icon.danger:hover {
  background: rgba(220, 53, 69, 0.1);
}

@media (max-width: 767px) {
  .add-row {
    flex-direction: column;
  }

  .btn-add {
    width: 100%;
  }
}
</style>