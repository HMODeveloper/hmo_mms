// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@pinia/nuxt", "nuxt-auth-utils"],
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  ui: {
    fonts: false,
  },
  runtimeConfig: {
    public: {
      apiUrl: "http://localhost:8080/api",
    },
  },
  compatibilityDate: "2025-07-15",
  nitro: {
    routeRules: {
      "/nitro-api/**": {
        proxy: {
          // eslint-disable-next-line node/prefer-global/process
          to: `${process.env.API_URL || ""}/**`,
        },
      },
    },
  },
})
