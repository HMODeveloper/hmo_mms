// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/color-mode",
    "@nuxt/eslint",
    "@nuxt/eslint-config",
    "@nuxt/ui",
    "@pinia/nuxt",
  ],
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
          to: `${process.env.API_URL || ""}/**`,
        },
      },
    },
  },
})
