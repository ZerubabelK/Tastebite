<template>
  <div>
    <form @submit.prevent className="space-y-5">
      <div className="grid grid-cols-3 items-center">
        <h2 className="font-semibold">First name</h2>
        <div className="border rounded-lg p-3 col-span-2">
          <input
            type="text"
            name="first_name"
            id="first_name"
            className="text-gray-500 w-full h-full outline-none"
            placeholder="First name"
            :value="user.first_name"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 items-center">
        <h2 className="font-semibold">Last name</h2>
        <div className="border rounded-lg p-3 col-span-2">
          <input
            type="text"
            name="last_name"
            id="last_name"
            className="text-gray-500 w-full h-full outline-none"
            placeholder="Last name"
            :value="user.last_name"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 items-center">
        <h2 className="font-semibold">Username</h2>
        <div className="border rounded-lg p-3 col-span-2">
          <input
            type="text"
            name="username"
            id="username"
            className="text-gray-500 w-full h-full outline-none"
            placeholder="Username"
            :value="user.username"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 items-center">
        <h2 className="font-semibold">Email</h2>
        <div className="border rounded-lg p-3 col-span-2">
          <input
            type="email"
            name="email"
            id="email"
            className="text-gray-500 w-full h-full outline-none"
            placeholder="Email"
            :value="user.email"
          />
        </div>
      </div>
      <div>
        <button
          v-if="isEditing"
          className="border-primary border px-5 py-2 rounded-lg text-black "
        >
          Edit
        </button>
        <button v-else className="bg-primary px-5 py-2 rounded-lg text-white ">
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { User } from "~/types";

defineProps<{
  user: User;
}>();

const isEditing = ref(false);
</script>
