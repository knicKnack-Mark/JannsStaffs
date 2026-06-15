// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  ssr: false,

  devtools: {
    enabled: true
  },

  modules: [
    '@nuxt/icon'
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  },

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: false,
      failOnError: false
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit'
      ]
    }
  },

  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '@/assets/styles/global.css',
    '~/assets/scss/main.scss'
  ]
})