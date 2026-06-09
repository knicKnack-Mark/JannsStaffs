<!-- SettingsField.vue -->
<template>
  <div :class="columnClass">
    <label class="form-label">
      {{ label }}
    </label>

    <input
      v-if="type !== 'select' && type !== 'textarea'"
      :value="modelValue"
      :type="type"
      class="form-control custom-input"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', castValue($event.target.value))"
    />

    <select
      v-else-if="type === 'select'"
      :value="modelValue"
      class="form-select custom-input"
      @change="$emit('update:modelValue', castValue($event.target.value))"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <textarea
      v-else
      :value="modelValue"
      class="form-control custom-textarea"
      :rows="rows"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number, Boolean],
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  options: {
    type: Array,
    default: () => []
  },
  rows: {
    type: Number,
    default: 4
  },
  columnClass: {
    type: String,
    default: 'col-md-6'
  },
  number: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const castValue = (value) => {
  if (value === 'true') return true
  if (value === 'false') return false
  if (props.number) return Number(value)

  return value
}
</script>