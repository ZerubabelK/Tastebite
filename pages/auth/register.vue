<template>
  <div
    class="w-screen min-h-screen grid md:grid-cols-2 grid-cols-1 items-center"
  >
    <div
      class="rounded-lg h-full flex justify-center items-center w-full px-10"
    >
      <div class="w-full max-w-[400px] mx-auto">
        <button class="flex items-center gap-1" @click="goBack">
          <Icon
            name="solar:arrow-left-linear"
            size="26px"
            class="text-primary"
          />
          <span>Back</span>
        </button>
        <NuxtLink to="/" class="flex gap-2 items-center my-10 w-fit">
          <img
            src="~/assets/img/logo.webp"
            alt="Tastebite logo"
            class="w-14 rounded-full"
          />
          <h1 class="text-xl font-bold">Tastebite</h1>
        </NuxtLink>
        <h1 class="text-3xl font-bold text-fourth">Create an account</h1>
        <p class="text-sm">
          Already have an account?
          <NuxtLink to="/auth/login" class="text-primary text-lg"
            >Sign in</NuxtLink
          >
        </p>
        <form @submit.prevent="handleRegister" class="flex flex-col space-y-3">
          <div class="space-y-3">
            <label for="first_name">First name</label>
            <div class="relative">
              <Icon
                name="fluent:person-28-regular"
                size="26px"
                class="absolute left-2 top-2 text-primary font-bold bg-white p-1"
              />
              <input
                type="text"
                placeholder="John"
                id="first_name"
                name="first_name"
                v-model="first_name"
                class="px-3 pl-10 min-w-[300px] py-2 focus:outline-none rounded-lg w-full bg-slate-100"
              />
            </div>
          </div>
          <div class="space-y-3">
            <label for="last_name">Last name</label>
            <div class="relative">
              <Icon
                name="fluent:person-28-regular"
                size="26px"
                class="absolute left-2 top-2 text-primary font-bold bg-white p-1"
              />
              <input
                type="text"
                placeholder="Doe"
                id="last_name"
                name="last_name"
                v-model="last_name"
                class="px-3 pl-10 min-w-[300px] py-2 focus:outline-none rounded-lg w-full bg-slate-100"
              />
            </div>
          </div>
          <div class="space-y-3">
            <label for="username">Username</label>
            <div class="relative">
              <Icon
                name="tabler:brand-auth0"
                size="26px"
                class="absolute left-2 top-2 text-primary font-bold bg-white p-1"
              />
              <input
                type="text"
                placeholder="Username"
                id="username"
                name="username"
                v-model="username"
                class="px-3 pl-10 min-w-[300px] py-2 focus:outline-none rounded-lg w-full bg-slate-100"
              />
            </div>
          </div>
          <div class="space-y-3">
            <label for="username">Email</label>
            <div class="relative">
              <Icon
                name="tabler:brand-auth0"
                size="26px"
                class="absolute left-2 top-2 text-primary font-bold bg-white p-1"
              />
              <input
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                v-model="email"
                class="px-3 pl-10 min-w-[300px] py-2 focus:outline-none rounded-lg w-full bg-slate-100"
              />
            </div>
          </div>
          <div class="space-y-3">
            <label for="password">Password</label>
            <div class="relative">
              <Icon
                name="mdi:password-outline"
                size="26"
                class="absolute left-2 top-2 text-primary font-light bg-white p-1"
              />
              <input
                type="password"
                placeholder="At least 6 characters long"
                v-model="password"
                class="px-3 pl-10 min-w-[300px] py-2 focus:outline-none rounded-lg w-full bg-slate-100"
              />
            </div>
          </div>
          <button
            type="submit"
            class="bg-primary px-3 text-white rounded-lg py-2"
          >
            <processing v-if="pending" />
            <span v-else> Sign up </span>
          </button>
        </form>
      </div>
    </div>
    <div
      class="basis-1/2 bg-[url('~/assets/img/auth-bg.jpeg')] w-full h-full bg-cover bg-no-repeat md:inline-block hidden"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import useAuth from "@/composables/useAuth";
import { useAuthStore } from "~/store/auth";
import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";

definePageMeta({
  title: "Register",
  description: "Create an account",
  layout: "auth",
});

const { register } = useAuth();
const first_name = ref("");
const last_name = ref("");
const email = ref("");
const username = ref("");
const password = ref("");

const pending = ref(false);

const handleRegister = () => {
  pending.value = true;
  register({
    email: email.value,
    password: password.value,
    first_name: first_name.value,
    last_name: last_name.value,
    username: username.value,
  })
    .then(() => {
      pending.value = false;
    })
    .catch(() => {
      pending.value = false;
    });
};

const authStore = useAuthStore();

const { isAuthenticated } = storeToRefs(authStore);

watch(isAuthenticated, (value) => {
  if (value) {
    pending.value = false;
    toast.success("Successfully signed up.", {
      position: "top-right",
    });
    setTimeout(() => {
      navigateTo("/", { replace: true });
    }, 2000);
  } else {
    pending.value = false;
  }
});

const router = useRouter();
const goBack = () => {
  router.back();
};
</script>
