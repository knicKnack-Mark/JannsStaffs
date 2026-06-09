<!-- SettingsCard.vue -->
<template>
  <div class="settings-card">
    <div class="card-title-wrapper">
      <div>
        <h5>{{ title }}</h5>
        <p>{{ description }}</p>
      </div>

      <Icon :name="icon" size="34" />
    </div>

    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  icon: String
})
</script>