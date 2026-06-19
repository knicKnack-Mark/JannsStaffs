<template>
  <div class="settings-card text-center">
    <div class="profile-avatar mx-auto mb-3">
      <Icon name="solar:user-bold-duotone" size="54" />
    </div>

    <h5 class="mb-1 fw-bold">
      {{ profile.name }}
    </h5>

    <p class="text-muted mb-3">
      Super Admin
    </p>

    <button type="button" class="btn btn-outline-main w-100">
      Change Photo
    </button>
  </div>
</template>

<script setup>
defineProps({
  profile: Object
})
</script>