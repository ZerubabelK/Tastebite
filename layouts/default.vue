<template>
  <main>
    <NavBar />
    <div>
      <slot />
    </div>
    <Footer />
    <div
      v-if="isScrolled"
      class="fixed bottom-8 right-6 block transition-all duration-300 ease-in-out"
      @click="goToTop"
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 24 24"
        class="animate-bounce text-5xl bg-primary rounded-full shadow shadow-primaryLight cursor-pointer text-white p-3"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
      </svg>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "~/store/user";

const scrollY = ref(0);
const scrollHandler = () => {
  scrollY.value = window.scrollY;
};
onMounted(() => {
  window.addEventListener("scroll", scrollHandler);
});

onUnmounted(() => {
  window.removeEventListener("scroll", scrollHandler);
});

const isScrolled = computed(() => scrollY.value > 100);

const goToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>
