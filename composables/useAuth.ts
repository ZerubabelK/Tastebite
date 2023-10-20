import { useUserStore } from "~/store/user";
import { useAuthStore } from "../store/auth";
import { toast } from "vue3-toastify";
import jwtDecode from "jwt-decode";
export default function () {
  const store = useAuthStore();
  const { setUser } = useUserStore();
  const { onLogin, onLogout } = useApollo();
  const errorMessage = ref("");
  return {
    login: async (username: string, password: string) => {
      const mutation = gql`
        mutation Login($credential: LoginInput!) {
          login(credential: $credential) {
            success
            accessToken
            error
          }
        }
      `;

      const {
        data: dt,
        error,
        status,
      }: { data: any; error: any; status: any } = await useAsyncQuery({
        query: mutation,
        variables: { credential: { username, password } },
      });
      console.log(dt, error);
      if (status.value === "success") {
        const query = gql`
          query GetUser($id: uuid!) @cached {
            user_by_pk(id: $id) {
              id
              username
              email
              first_name
              last_name
              profile_image
            }
          }
        `;
        const payload: any = jwtDecode(dt!.value!.login.accessToken);

        const { data, error, status }: { data: any; error: any; status: any } =
          await useAsyncQuery({
            query,
            variables: {
              id: payload["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
            },
            cache: true,
          });
        if (status.value === "success") {
          store.setToken(dt!.value!.login.accessToken);
          setUser(data.value!.user_by_pk);
          onLogin(dt!.value!.login.accessToken);
        }
      } else {
        toast.error("Invalid email or password");
      }
    },

    logout: () => {
      onLogout();
      window.location.reload();
    },

    errorMessage,

    register: async (userData: any) => {
      const mutation = gql`
        mutation Register($user: RegisterInput!) {
          createUser(user: $user) {
            success
            accessToken
            error
          }
        }
      `;

      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query: mutation,
          variables: { user: userData },
        });

      if (status.value === "success") {
        const token = data!.value!.createUser.accessToken;
        const query = gql`
          query GetUser($id: uuid!) @cached {
            user_by_pk(id: $id) {
              id
              username
              email
              first_name
              last_name
              profile_image
            }
          }
        `;
        const payload: any = jwtDecode(token);

        const {
          data: dt,
          error,
          status,
        }: { data: any; error: any; status: any } = await useAsyncQuery({
          query,
          variables: {
            id: payload["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
          },
          cache: true,
        });
        console.log(dt, error);
        if (status.value === "success") {
          store.setToken(token);
          setUser(dt.value!.user_by_pk);
          onLogin(token);
        }
      } else {
        toast.error("Username or email already exists");
      }
    },
  };
}
