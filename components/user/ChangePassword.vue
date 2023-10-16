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
          />
        </div>
      </div>
      <div>
        <button className="bg-primary px-5 py-2 rounded-lg text-white ">
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
//   const { user } = defineProps(["user"]);
//   onMounted(() => {
//     console.log(user);
//   });
</script>
