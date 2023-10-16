<template>
  <div className="relative mx-auto px-5 sm:px-14 md:px-20 lg:px-32">
    <div
      className="w-full bg-gradient-to-r from-cyan-200 to-blue-200 min-h-[25vh] rounded-3xl mt-5"
    ></div>
    <div className="px-16 flex flex-col">
      <UserProfileHeader
        :profile_image="
          user.profile_image ||
          'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8d29tYW4lMjBibHVlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=face&w=500&q=200'
        "
      />
      <div class="grid grid-cols-3 mt-5 gap-10 pb-10">
        <UserProfileDetail class="col-span-2" :user="user" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useUserStore } from "~/store/user";
import { User } from "~/types";

definePageMeta({
  middleware: "auth",
  title: "Profile",
  description: "Profile page",
});

const { user }: { user: User } = useUserStore();
console.log(user);
</script>
