<template>
  <NuxtLayout>
    <div class="flex flex-col justify-center items-center w-screen">
      <h1>Oops!</h1>
      <p>
        <strong>{{ error.message }}</strong>
      </p>
      <p>Something went wrong.</p>
      <p>We apologize for the inconvenience.</p>
      <button @click="handleError" class="bg-primary px-4 py-2 text-white">
        Go back home
      </button>
    </div>
  </NuxtLayout>
</template>

<script setup>
const props = defineProps({
  error: Object,
});

const handleError = () => clearError({ redirect: "/" });
</script>
