<template>
  <div
    class="w-full sticky top-0 left-0 py-2 flex justify-between items-center px-5 sm:px-14 md:px-20 backdrop-blur-sm shadow-sm z-20 bg-[#ffffffb7]"
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
    <div class="md:flex relative hidden">
      <div class="flex items-center gap-3" v-if="!isAuthenticated">
        <NuxtLink class="text-black font-semibold text-base" to="/auth/login"
          >Login</NuxtLink
        >
        <NuxtLink
          class="text-white font-semibold text-base bg-primary px-4 py-2 rounded-md"
          to="/auth/register"
          >Register</NuxtLink
        >
      </div>
      <div class="flex items-center gap-3" v-else>
        <Notification :user="user" />
        <DropdownMenu :user="user" />
      </div>
    </div>
    <div class="md:hidden">
      <Icon name="mingcute:menu-fill" size="28px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";
import { useUserStore } from "~/store/user";
const authStore = useAuthStore();

const { isAuthenticated } = storeToRefs(authStore);
const { user } = storeToRefs(useUserStore());

const { path } = useRoute();
</script>
