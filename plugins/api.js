export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    onRequest({ options }) {
      const token = process.client ? localStorage.getItem('token') : null;

      options.headers = {
        ...options.headers,
        Accept: 'application/json', // ✅ VERY IMPORTANT
      };

      if (token) {
        options.headers.Authorization = `Bearer ${token}`;
      }
    },

    onResponseError({ response }) {
      console.error('API ERROR:', response);

      if (response.status === 401) {
        console.error("Unauthorized");
      }
    }
  });

  return {
    provide: {
      api,
    },
  };
});