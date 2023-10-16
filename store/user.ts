import { H3Event, parseCookies } from "h3";
import jwtDecode from "jwt-decode";
import { User } from "~/types";
export const useUserStore = defineStore("user", {
  state: () => ({
    user: {} as User,
    isHydrating: false,
    notifications: [],
  }),
  getters: {
    getUser: (state) => state.user,
    getNotifications: (state) => state.notifications,
  },
  actions: {
    setUser(user: any) {
      this.user = user;
    },
    setNotifications(notifications: any) {
      this.notifications = notifications;
    },
    async boot(event: H3Event) {
      const cookies = parseCookies(event);
      const token = cookies["apollo:default.token"] || cookies["token"];
      try {
        if (token) {
          this.isHydrating = true;
          const payload: any = jwtDecode(token);
          const query = gql`
            query GetUser($id: uuid!) @cached {
              user_by_pk(id: $id) {
                id
                email
                first_name
                last_name
                profile_image
              }
            }
          `;
          const {
            data,
            error,
            status,
          }: { data: any; error: any; status: any } = await useAsyncQuery({
            query,
            variables: {
              id: payload["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
            },
          });

          if (status.value === "success") {
            this.setUser(data.value!.user_by_pk);
          }
          this.isHydrating = false;
        }
      } catch (error) {
        this.isHydrating = false;
      }
    },
  },
});
