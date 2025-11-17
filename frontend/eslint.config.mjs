// @ts-check
import { createConfigForNuxt } from "@nuxt/eslint-config/flat"

export default createConfigForNuxt({
  modules: ["@nuxt/eslint"],
  features: {
    stylistic: {
      semi: false,
      indent: 2,
      quotes: "double",
    },
    formatters: {
      css: "prettier",
      markdown: "prettier",
    },
  },
})
