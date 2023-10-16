import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return navigateTo("/auth/login");
  }
});
