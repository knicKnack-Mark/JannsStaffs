<template>
  <section class="fade-slide-up delay-2">

    <AdminSettingsCard
      title="System Settings"
      description="Basic configuration for JANNS SPRING RESORT staff system."
      icon="solar:settings-bold-duotone"
    >

      <div class="row g-3">

        <AdminSettingsField
          v-model="system.name"
          label="System Name"
        />


        <AdminSettingsField
          v-model="system.type"
          label="System Type"
        />


        <AdminSettingsField
          v-model="system.currency"
          label="Default Currency"
          type="select"
          :options="currencyOptions"
        />


        <AdminSettingsField
          v-model="system.timezone"
          label="Timezone"
          type="select"
          :options="timezoneOptions"
        />


        <AdminSettingsField
          v-model="system.description"
          label="System Description"
          type="textarea"
          column-class="col-12"
        />

      </div>

    </AdminSettingsCard>

  </section>
</template>


<script setup>

import { computed } from 'vue'


const props = defineProps({

  modelValue: {
    type: Object,
    required: true
  }

})


const emit = defineEmits([
  'update:modelValue'
])


const system = computed({

  get() {
    return props.modelValue
  },

  set(value) {
    emit(
      'update:modelValue',
      value
    )
  }

})


const currencyOptions = [
  {
    label: 'PHP - Philippine Peso',
    value: 'PHP'
  },
  {
    label: 'USD - US Dollar',
    value: 'USD'
  }
]


const timezoneOptions = [
  {
    label: 'Asia/Manila',
    value: 'Asia/Manila'
  },
  {
    label: 'UTC',
    value: 'UTC'
  }
]


</script>