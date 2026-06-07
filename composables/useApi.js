export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')
  const user = useCookie('user')

  const apiFetch = async (url, options = {}) => {
    try {
      return await $fetch(`${config.public.apiBase}${url}`, {
        ...options,
        headers: {
          Accept: 'application/json',
          ...(options.body instanceof FormData
            ? {}
            : { 'Content-Type': 'application/json' }),
          ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
          ...(options.headers || {})
        }
      })
    } catch (err) {
      const status = err?.statusCode || err?.status

      if (status === 401 && url !== '/login') {
        token.value = null
        user.value = null

        return navigateTo('/admin/login')
      }

      throw err
    }
  }

  return {
    apiFetch
  }
}