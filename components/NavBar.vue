<template>
  <div
    class="w-full sticky top-0 left-0 py-2 flex justify-between items-center px-5 sm:px-14 md:px-20 backdrop-blur-sm shadow-sm z-50 bg-[#ffffffb7]"
  >
    <NuxtLink to="/" class="flex gap-2 items-center">
      <img
        src="~/assets/img/logo.webp"
        alt="Tastebite logo"
        class="w-14 rounded-full"
      />
      <h1 class="text-xl font-bold">Tastebite</h1>
    </NuxtLink>
    <nav class="md:flex gap-8 relative hidden">
      <NuxtLink
        to="/"
        class="text-black text-base font-semibold"
        :class="
          'after:absolute after:w-full after:h-1 after:bg-primary after:left-0 after:bottom-0'
            ? path === '/'
            : ''
        "
        >Home</NuxtLink
      >
      <NuxtLink
        to="/recipe"
        class="text-black text-base font-semibold"
        :class="
          'after:absolute after:w-full after:h-1 after:bg-primary after:left-0 after:bottom-0'
            ? path === '/recipes'
            : ''
        "
        >Recipes</NuxtLink
      >
      <NuxtLink
        to="/about"
        class="text-black text-base font-semibold"
        :class="
          'after:absolute after:w-full after:h-1 after:bg-primary after:left-0 after:bottom-0'
            ? path === '/about'
            : ''
        "
        >About</NuxtLink
      >
      <NuxtLink
        to="/about"
        class="text-black text-base font-semibold"
        :class="
          'after:absolute after:w-full after:h-1 after:bg-primary after:left-0 after:bottom-0'
            ? path === '/contact'
            : ''
        "
        >Contact</NuxtLink
      >
    </nav>
    <div class="relative flex items-center gap-3">
      <div class="flex items-center gap-3" v-if="!isAuthenticated || error">
        <NuxtLink class="hidden md:block" href="/auth/login"
          ><button
            type="button"
            class="bg-primary hover:shadow-xl text-white py-2 px-5 shadow-lg font-semibold flex items-center justify-center gap-2 max-h-max text-center max-w-max rounded-full"
            tabindex="0"
          >
            Sign In<svg
              stroke="currentColor"
              fill="none"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg></button
        ></NuxtLink>
      </div>
      <div class="flex items-center gap-3" v-else>
        <Notification :user="user" />
        <DropdownMenu :user="user" class="hidden md:block" />
      </div>
      <div class="md:hidden relative">
        <Icon name="mingcute:menu-fill" size="28px" />
      </div>
    </div>
  </div>
  <div
    class="relative w-full py-2 mt-28 flex justify-between items-center px-5 sm:px-14 md:px-20 backdrop-blur-sm shadow-sm z-50 bg-[#ffffffb7]"
    v-if="openDropdown"
  >
    <DropDownNav v-if="openDropdown" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";
import { useUserStore } from "~/store/user";
const authStore = useAuthStore();
const openDropdown = ref(false);

const { isAuthenticated } = storeToRefs(authStore);
const { user, error } = storeToRefs(useUserStore());
const { path } = useRoute();
</script>
