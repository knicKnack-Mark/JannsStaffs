export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')

  const apiFetch = async (url, options = {}) => {
    try {
      return await $fetch(`${config.public.apiBase}${url}`, {
        ...options,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
          ...(options.headers || {})
        }
      })
    } catch (err) {

      // ✅ ONLY auto-logout if NOT login request
      if (err?.status === 401 && url !== '/login') {
        token.value = null
        useCookie('user').value = null

        return navigateTo('/admin/login')
      }

      // ✅ Let login page handle error
      throw err
    }
  }

  return {
    apiFetch
  }
}