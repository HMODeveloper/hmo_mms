// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/color-mode", "@nuxt/eslint", "@nuxt/eslint-config", "@nuxt/ui"],
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  ui: {
    fonts: false,
  },
  compatibilityDate: "2025-07-15",
})
