<template>
  <nav class="space-y-4 w-screen left-0 bg-white grid grid-rows-5 absolute">
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
</template>

<script lang="ts" setup>
const path = useRoute().path;
</script>
