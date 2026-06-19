<template>
  <section class="fade-slide-up delay-2">
    <div class="row g-4">

      <!-- LEFT CARD -->
      <div class="col-xl-4">
        <ProfileSidebarCard :profile="profile" />
      </div>

      <!-- RIGHT FORM -->
      <div class="col-xl-8">
        <ProfileSettingsForm :profile="profile" />
      </div>

    </div>
  </section>
</template>

<script setup>
import ProfileSidebarCard from './profile/ProfileSidebarCard.vue'
import ProfileSettingsForm from './profile/ProfileSettingsForm.vue'

defineProps({
  profile: Object
})
</script>