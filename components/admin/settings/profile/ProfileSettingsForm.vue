<template>
  <AdminSettingsCard
    title="Admin Profile"
    description="Update the admin account information."
    icon="solar:user-id-bold-duotone"
  >
    <div class="row g-3">
      <AdminSettingsField v-model="profile.name" label="Admin Name" />
      <AdminSettingsField v-model="profile.username" label="Username" />
      <AdminSettingsField v-model="profile.email" label="Email Address" type="email" />
      <AdminSettingsField v-model="profile.contact" label="Contact Number" />
      <AdminSettingsField v-model="profile.password" label="New Password" type="password" />
      <AdminSettingsField v-model="profile.confirmPassword" label="Confirm Password" type="password" />
    </div>
  </AdminSettingsCard>
</template>

<script setup>
defineProps({
  profile: Object
})
</script>