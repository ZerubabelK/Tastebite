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
        <NuxtLink to="/" class="flex gap-2 items-center my-5 w-fit">
          <img
            src="~/assets/img/logo.webp"
            alt="Tastebite logo"
            class="w-14 rounded-full"
          />
          <h1 class="text-xl font-bold">Tastebite</h1>
        </NuxtLink>

        <form
          @submit.prevent="handleRegister"
          class="flex flex-col space-y-1.5"
        >
          <div class="grid grid-cols-2 gap-x-3">
            <div class="space-y-1.5">
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
                  v-bind="first_name"
                  class="px-3 pl-10 py-2 focus:outline-none rounded-lg w-full bg-slate-100"
                />
              </div>
              <p class="text-sm text-red-600">{{ errors.first_name }}</p>
            </div>
            <div class="space-y-1.5">
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
                  v-bind="last_name"
                  class="px-3 pl-10 py-2 focus:outline-none rounded-lg w-full bg-slate-100"
                />
              </div>
              <p class="text-sm text-red-600">{{ errors.last_name }}</p>
            </div>
          </div>
          <div class="space-y-1.5">
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
                class="px-3 pl-10 min-w-[300px] py-2 focus:outline-none rounded-lg w-full bg-slate-100"
              />
            </div>
            <p class="text-sm text-red-600">{{ errors.username }}</p>
          </div>
          <div class="space-y-1.5">
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
                v-bind="email"
                class="px-3 pl-10 min-w-[300px] py-2 focus:outline-none rounded-lg w-full bg-slate-100"
              />
            </div>
            <p class="text-sm text-red-600">{{ errors.email }}</p>
          </div>
          <div class="space-y-1.5">
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
                name="password"
                class="px-3 pl-10 min-w-[300px] py-2 focus:outline-none rounded-lg w-full bg-slate-100"
              />
            </div>
            <p class="text-sm text-red-600">{{ errors.password }}</p>
          </div>
          <div class="space-y-1.5">
            <label for="password">Confirm Password</label>
            <div class="relative">
              <Icon
                name="mdi:password-outline"
                size="26"
                class="absolute left-2 top-2 text-primary font-light bg-white p-1"
              />
              <input
                type="password"
                placeholder="At least 6 characters long"
                v-bind="confirm_password"
                name="confirm_password"
                class="px-3 pl-10 min-w-[300px] py-2 focus:outline-none rounded-lg w-full bg-slate-100"
              />
            </div>
            <p class="text-sm text-red-600">{{ errors.confirm_password }}</p>
          </div>
          <button
            type="submit"
            class="bg-primary px-3 text-white rounded-lg py-2"
          >
            <processing v-if="pending" />
            <span v-else> Sign up </span>
          </button>
        </form>
        <div class="flex justify-center items-center mt-5">
          <span class="text-sm">Already have an account?</span>
          <NuxtLink to="/auth/login" class="text-primary ml-1">
            Login
          </NuxtLink>
        </div>
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

const { defineInputBinds, handleSubmit, errors } = useForm({
  validationSchema: registerSchema,
});

const first_name = defineInputBinds("first_name");
const last_name = defineInputBinds("last_name");
const email = defineInputBinds("email");
const username = defineInputBinds("username");
const password = defineInputBinds("password");
const confirm_password = defineInputBinds("confirm_password");

const pending = ref(false);

const handleRegister = handleSubmit((values) => {
  pending.value = true;
  register({
    email: values.email,
    password: values.password,
    first_name: values.first_name,
    last_name: values.last_name,
    username: values.username,
  })
    .then(() => {
      pending.value = false;
    })
    .catch((err) => {
      pending.value = false;
    });
});

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
