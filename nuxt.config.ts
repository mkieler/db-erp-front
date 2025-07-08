// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-auth-sanctum', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  

  sanctum: {
    redirect: {
        keepRequestedRoute: false,
        onAuthOnly: '/login',
        onGuestOnly: '/',
        onLogin: '/',
        onLogout: '/login',
    },
    globalMiddleware: {
        enabled: true,
    },
    endpoints: {
      user: '/user',
    }
  },
})