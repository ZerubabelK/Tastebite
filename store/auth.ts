import { H3Event, parseCookies } from "h3";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    loading: false,
    error: "",
  }),
  getters: {
    getToken: (state) => state.token,
    isAuthenticated: (state) => state.token !== "",
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setError(error: string) {
      this.error = error;
    },
    async boot(event: H3Event) {
      const cookies = parseCookies(event);
      const token = cookies["apollo:default.token"] || cookies["token"];
      if (token) {
        this.setToken(token);
      }
    },
  },
});
