// plugins/vue-toastification.client.js
import Toast, { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    position: 'top-right',
    timeout: 2000,
    closeOnClick: true,
    pauseOnHover: true,
    showCloseButtonOnHover: true
  })

  return {
    provide: {
      toast: useToast()
    }
  }
})