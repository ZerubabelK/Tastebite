import jwtDecode from "jwt-decode";
import { toast } from "vue3-toastify";
import { useAuthStore } from "~/store/auth";
import { useUserStore } from "~/store/user";

export default function () {
  const { token } = useAuthStore();
  const isError = ref(false);
  const isSuccess = ref(false);
  const isPending = ref(false);
  const updateUserById = async (id: string, user: any) => {
    const query = gql`
      mutation UpdateUser($id: uuid!, $user: user_set_input!) {
        update_user_by_pk(pk_columns: { id: $id }, _set: $user) {
          id
          email
          username
          first_name
          last_name
          profile_image
        }
      }
    `;
    const { data, error, status }: { data: any; error: any; status: any } =
      await useAsyncQuery({
        query,
        variables: {
          id,
          user,
        },
      });
    if (status.value === "success") {
      toast.success("Profile updated successfully");
      useUserStore().setUser(data.value.update_user_by_pk);
      isSuccess.value = true;
    } else {
      isError.value = true;
    }
  };
  return {
    async updateProfileImage(base64: string, name: string) {
      isPending.value = true;
      const query = gql`
        mutation Update($arg: ProfileInput!) {
          updateProfilePicture(arg: $arg) {
            success
            error
            profile_image_url
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query,
          variables: {
            arg: {
              base64,
              name,
            },
          },
        });
      if (status.value === "success") {
        const payload: any = jwtDecode(token);
        console.log(data);
        updateUserById(
          payload["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
          {
            profile_image: data.value.updateProfilePicture.profile_image_url,
          }
        );
      } else {
        isError.value = true;
      }
      setTimeout(() => {
        isPending.value = false;
        isError.value = false;
        isSuccess.value = false;
      }, 1500);
    },

    async getUserNotifications(user_id: string) {
      const query = gql`
        subscription OnNotification($filter: notification_bool_exp!) {
          notification(where: $filter, order_by: { created_at: desc }) {
            id
            message
            is_read
            userByInitiatorId {
              profile_image
            }
            created_at
          }
        }
      `;
      const { onResult, onError } = useSubscription(
        query,
        {
          filter: {
            user_id: {
              _eq: user_id,
            },
            is_read: {
              _eq: false,
            },
          },
        },
        {
          fetchPolicy: "network-only",
        }
      );

      onResult((data: any) => {
        useUserStore().setNotifications(data.data.notification);
        console.log("notification", data.data.notification);
      });
      onError((error: any) => {
        console.log(error);
      });
    },
    async readNotification(id: string) {
      const query = gql`
        mutation ReadNotification($id: uuid!) {
          update_notification_by_pk(
            pk_columns: { id: $id }
            _set: { is_read: true }
          ) {
            id
            is_read
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query,
          variables: {
            id,
          },
        });
      console.log(data, error, status);
      if (status.value === "success") {
        return data.value.update_notification_by_pk;
      }
      return [];
    },

    isErrored() {
      return isError.value;
    },
    isSuccess() {
      return isSuccess.value;
    },
    isPending() {
      return isPending.value;
    },

    updateUserById,
  };
}
