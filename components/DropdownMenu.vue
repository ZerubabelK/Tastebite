<template>
  <div class="flex justify-center items-center">
    <div class="relative inline-block">
      <button
        class="relative z-10 flex items-center p-2 text-sm text-white bg-inherit rounded-md"
        @click="toggleMenu"
      >
        <img
          class="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9"
          :src="
            user.profile_image ||
            'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8d29tYW4lMjBibHVlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=face&w=500&q=200'
          "
          :alt="user.first_name + ' ' + user.last_name"
        />
        <svg
          class="w-5 h-5 mx-0.5 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>
      <div
        v-if="openMenu"
        class="absolute right-0 z-20 w-56 py-2 mt-2 overflow-hidden bg-white rounded-md shadow-xl"
      >
        <NuxtLink
          to="/user/profile/information"
          class="flex items-center p-3 -mt-2 text-sm text-white transition-colors duration-200 transform hover:bg-gray-100"
          @click="toggleMenu"
        >
          <img
            class="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9"
            :src="
              user.profile_image ||
              'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8d29tYW4lMjBibHVlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=face&w=500&q=200'
            "
            alt="jane avatar"
          />
          <div class="mx-1">
            <h1 class="text-sm font-semibold text-gray-700">
              {{ user.first_name }} {{ user.last_name }}
            </h1>
            <p class="text-sm text-gray-500">
              {{ user.email }}
            </p>
          </div>
        </NuxtLink>

        <hr class="border-neutral-100" />

        <nuxt-link
          to="/user/profile/information"
          class="block px-4 py-3 text-sm text-neutral-600 capitalize transition-colors duration-200 transform hover:bg-gray-100"
          @click="toggleMenu"
        >
          view profile
        </nuxt-link>

        <nuxt-link
          to="/recipe/saved"
          class="block px-4 py-3 text-sm text-neutral-600 capitalize transition-colors duration-200 transform hover:bg-gray-100"
          @click="toggleMenu"
        >
          Saved Recipe
        </nuxt-link>
        <nuxt-link
          to="/user/recipes"
          class="block px-4 py-3 text-sm text-neutral-600 capitalize transition-colors duration-200 transform hover:bg-gray-100"
          @click="toggleMenu"
        >
          My Recipes
        </nuxt-link>

        <!-- <nuxt-link
          to="/user/profile/setting"
          class="block px-4 py-3 text-sm text-neutral-600 capitalize transition-colors duration-200 transform hover:bg-gray-100"
        >
          Settings
        </nuxt-link> -->

        <hr class="border-neutral-100 dark:border-gray-700" />

        <button
          @click="
            () => {
              logout();
              toggleMenu();
            }
          "
          class="block text-left w-full px-4 py-3 text-sm text-neutral-600 capitalize transition-colors duration-200 transform hover:bg-gray-100"
        >
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { User } from "~/types";
const { user } = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
});

const { logout } = useAuth();

const openMenu = ref(false);

const toggleMenu = () => {
  openMenu.value = !openMenu.value;
};
</script>
