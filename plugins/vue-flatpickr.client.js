
import Flatpickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    nuxtApp.vueApp.component('Flatpickr', Flatpickr)
  }
})