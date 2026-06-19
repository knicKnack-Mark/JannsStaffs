<template>
  <section class="fade-slide-up delay-2">

    <div class="row g-4">

      <div class="col-xl-6">
        <AdminSettingsOptionList
          title="Departments"
          description="Manage staff department options."
          icon="solar:buildings-2-bold-duotone"
          placeholder="Add department"
          :items="departments"
          @add="addDepartment"
          @remove="removeDepartment"
        />
      </div>


      <div class="col-xl-6">
        <AdminSettingsOptionList
          title="Positions"
          description="Manage staff position options."
          icon="solar:user-id-bold-duotone"
          placeholder="Add position"
          :items="positions"
          @add="addPosition"
          @remove="removePosition"
        />
      </div>


    </div>

  </section>
</template>


<script setup>

const props = defineProps({

  departments: {
    type: Array,
    default: () => []
  },

  positions: {
    type: Array,
    default: () => []
  }

})


const emit = defineEmits([
  'update:departments',
  'update:positions'
])


const addDepartment = (value) => {

  if (!value) return

  if (!props.departments.includes(value)) {

    emit(
      'update:departments',
      [
        ...props.departments,
        value
      ]
    )

  }

}


const removeDepartment = (value) => {

  emit(
    'update:departments',
    props.departments.filter(
      item => item !== value
    )
  )

}



const addPosition = (value) => {

  if (!value) return

  if (!props.positions.includes(value)) {

    emit(
      'update:positions',
      [
        ...props.positions,
        value
      ]
    )

  }

}


const removePosition = (value) => {

  emit(
    'update:positions',
    props.positions.filter(
      item => item !== value
    )
  )

}

</script>