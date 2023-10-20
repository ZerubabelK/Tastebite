// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  runtimeConfig: {
    public: {
      vueuse: {
        // enable/disable functions
        useWebNotification: true,
        // ...other functions
      },
    },
  },
  devServer: {
    port: 8000,
  },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.webp" }],
      title: "Tastbite",
    },
  },
  css: ["@/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    "@nuxtjs/apollo",
    "@pinia/nuxt",
    "nuxt-icon",
    "nuxt-rating",
    "@vee-validate/nuxt",
    "@vueuse/nuxt",
  ],
  apollo: {
    autoImports: true,
    authType: "Bearer",
    authHeader: "Authorization",
    tokenStorage: "cookie",
    proxyCookies: true,
    clients: {
      default: {
        wsEndpoint: "ws://localhost:8080/v1/graphql",
        httpEndpoint: "http://localhost:8080/v1/graphql",
        httpLinkOptions: {
          credentials: "include",
        },
      },
    },
  },
  pinia: {
    autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
  },
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },
});
