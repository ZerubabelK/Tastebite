<template>
  <div class="relative">
    <div class="relative">
      <Icon
        v-if="notifications?.length > 0"
        name="tdesign:notification-filled"
        size="25px"
        class="text-primary cursor-pointer"
        @click="(_) => (showNotification = !showNotification)"
      />
      <Icon
        v-else
        name="tdesign:notification"
        size="25px"
        class="text-primary cursor-pointer"
      />
      <span
        class="absolute -top-1 -right-1 bg-red-600 w-[14px] h-[14px] text-xs p-1 aspect-square rounded-full text-white flex items-center justify-center border border-white"
        >{{ notifications?.length }}</span
      >
    </div>
    <div
      v-if="showNotification"
      class="absolute right-0 z-20 mt-1 bg-white rounded-md shadow-xl w-80"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        @click="handleNotifcationRead(notification.id)"
      >
        <hr class="border-neutral-100" />

        <button
          class="flex items-center gap-2 text-left w-full px-4 py-3 text-sm text-neutral-600 capitalize transition-colors duration-200 transform hover:bg-gray-100"
        >
          <img
            :src="notification.userByInitiatorId?.profile_image"
            alt="profile"
            class="w-9 h-9 rounded-full"
          />
          {{ notification.message }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "~/store/user";
import { User } from "~/types";

const { readNotification, getUserNotifications } = useUser();

const showNotification = ref(false);

const { notifications } = storeToRefs(useUserStore());
const { user } = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
});

const handleNotifcationRead = (id: string) => {
  readNotification(id);
};

if (user) getUserNotifications(user.id.toString());
</script>
