<template>
  <div class="mb-4">
    <label class="form-label fw-semibold">
      {{ label }}
    </label>

    <div class="input-group">
      <span class="input-group-text bg-white">
        <Icon
          :name="icon"
          size="20"
        />
      </span>

      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="type"
        :placeholder="placeholder"
        class="form-control"
      />

      <button
        v-if="passwordToggle"
        type="button"
        class="btn btn-outline-secondary"
        @click="$emit('toggle')"
      >
        <Icon
          :name="showPassword
            ? 'mdi:eye-off-outline'
            : 'mdi:eye-outline'"
          size="20"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  icon: String,
  type: String,
  placeholder: String,
  passwordToggle: Boolean,
  showPassword: Boolean
})

defineEmits([
  'update:modelValue',
  'toggle'
])
</script>