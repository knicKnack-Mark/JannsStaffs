<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'btn rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2',
      buttonClass
    ]"
  >
    <span
      v-if="loading"
      class="spinner-border spinner-border-sm"
    ></span>

    <Icon
      v-if="icon && !loading"
      :name="icon"
      size="20"
    />

    <span>
      {{ loading ? loadingText : text }}
    </span>
  </button>
</template>

<script setup>
defineProps({
  text: String,
  loadingText: String,
  loading: Boolean,
  disabled: Boolean,
  icon: String,
  type: {
    type: String,
    default: 'button'
  },
  buttonClass: {
    type: String,
    default: 'btn-primary w-100 py-3'
  }
})
</script>