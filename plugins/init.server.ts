import { defineNuxtPlugin } from "#app";
import { NuxtApp } from "nuxt/schema";
import { useAuthStore } from "~/store/auth";
import { useUserStore } from "~/store/user";

export default defineNuxtPlugin(async (nuxtApp: any) => {
  const auth = useAuthStore();
  await auth.boot(nuxtApp.ssrContext.event);
  const user = useUserStore();
  await user.boot(nuxtApp.ssrContext.event);
});
