<template>
  <div
    class="w-screen min-h-screen grid md:grid-cols-2 grid-cols-1 items-center"
  >
    <div
      class="rounded-lg h-full flex justify-center md:items-center w-full px-10"
    >
      <div class="w-full max-w-[400px] mx-auto md:mt-0 mt-16">
        <button class="flex items-center gap-1" @click="goBack">
          <Icon
            name="solar:arrow-left-linear"
            size="26px"
            class="text-primary"
          />
          <span>Back</span>
        </button>
        <NuxtLink to="/" class="flex gap-2 items-center md:my-10 my-5 w-fit">
          <img
            src="~/assets/img/logo.webp"
            alt="Tastebite logo"
            class="w-14 rounded-full"
          />
          <h1 class="text-xl font-bold">Tastebite</h1>
        </NuxtLink>
        <h1 class="text-3xl font-bold text-fourth">Welcome back</h1>

        <form @submit.prevent="handleLogin" class="flex flex-col space-y-3">
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
                v-bind="username"
                class="px-3 pl-10 max-w-[400px] py-2 focus:outline-none rounded-lg w-full bg-slate-100"
              />
            </div>
            <p class="text-sm text-red-600">{{ errors.username }}</p>
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
                v-bind="password"
                class="px-3 pl-10 max-w-[400px] py-2 focus:outline-none rounded-lg w-full bg-slate-100"
              />
            </div>
            <p class="text-sm text-red-600">{{ errors.password }}</p>
          </div>
          <button
            type="submit"
            class="bg-primary px-3 text-white rounded-lg py-2 max-w-[400px]"
            :disabled="pending"
          >
            <processing v-if="pending" />
            <span v-else> Sign in </span>
          </button>
        </form>
        <div class="flex justify-center items-center mt-5">
          <span class="text-fourth">Don't have an account?</span>
          <NuxtLink to="/auth/register" class="text-primary ml-1">
            Sign up
          </NuxtLink>
        </div>
      </div>
    </div>
    <div
      class="basis-1/2 bg-[url('~/assets/img/auth-bg.jpeg')] w-full h-full bg-cover bg-no-repeat md:inline-block hidden transition-all duration-300 ease-in-out"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { toast } from "vue3-toastify";
import { ref, watch } from "vue";
import useAuth from "@/composables/useAuth";
import { useAuthStore } from "~/store/auth";
import { storeToRefs } from "pinia";

definePageMeta({
  title: "Login",
  description: "Login to your account",
  layout: "auth",
});

import { useForm } from "vee-validate";
import { loginSchema } from "@/utils/validation-schema";

const { errors, handleSubmit, defineInputBinds } = useForm({
  validationSchema: loginSchema,
});

// const userField = defineInputBinds("username");
// const passwordField = defineInputBinds("password");

const { login, errorMessage } = useAuth();
const username = defineInputBinds("username");
const password = defineInputBinds("password");
const pending = ref<boolean>(false);

const handleLogin = handleSubmit((values: any) => {
  pending.value = true;

  login(values.username, values.password)
    .then(() => {
      pending.value = false;
    })
    .catch(() => {
      pending.value = false;
    });
});

const authStore = useAuthStore();

const { isAuthenticated } = storeToRefs(authStore);

watch(isAuthenticated, (value) => {
  if (value) {
    pending.value = false;
    toast.success("Successfully signed in.", {
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
