<template>
  <div className="w-full">
    <div className="w-full flex justify-between">
      <div className="flex">
        <div class="relative w-max h-max -mt-10">
          <img
            className="w-40 h-40 rounded-lg border-4 border-white"
            :src="isChanging ? new_profile_preview?.toString() : profile_image"
          />
          <Icon
            name="bx:image-add"
            size="40px"
            class="absolute -right-2 -bottom-2 z-10 text-primary bg-white rounded-full cursor-pointer hover:shadow-md p-1 border-gray-200 border"
            @click="handleEvent"
          />
        </div>
        <div className="px-5 space-y-2">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-gray-500">
            Update your photo and personal details
          </p>
          <div class="flex items-center gap-3">
            <button
              class="bg-primary px-3 py-1 text-white rounded-lg shadow hover:shadow-md"
              @click="handleSubmit"
              :disabled="isPending()"
            >
              <Processing v-if="isPending()" />
              <span v-else> Change photo </span>
            </button>
            <button
              v-if="isChanging"
              class="border border-neutral-200 px-3 py-1 text-black rounded-lg shadow hover:shadow-md"
              @click="handleCancel"
            >
              Cancel
            </button>
          </div>

          <input
            type="file"
            name="profile_image"
            id="profile_image"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
        </div>
      </div>
      <div className="self-center space-x-3">
        <nuxt-link
          to="/user/profile/setting"
          className="bg-primary text-white px-3 py-1 rounded-lg shadow hover:shadow-md"
        >
          Change password
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Processing from "../Processing.vue";

defineProps({
  profile_image: {
    type: String,
    required: true,
  },
});

const { updateProfileImage, isErrored, isSuccess, isPending } = useUser();
const isChanging = ref(false);

const new_profile_image = ref<String>("");
const new_profile_preview = ref<String>("");
const name = ref<String>("");

const handleEvent = () => {
  document.getElementById("profile_image")?.click();
};
const handleFileChange = (e: any) => {
  isChanging.value = true;
  const file = e.target.files[0];
  new_profile_preview.value = URL.createObjectURL(file);
  const reader = new FileReader();
  if (file) {
    name.value = file.name;
    reader.readAsBinaryString(file);
  }

  reader.onload = () => {
    new_profile_image.value = btoa(reader.result as string);
  };
};

const handleSubmit = () => {
  updateProfileImage(new_profile_image.value.toString(), name.value.toString());
};

const handleCancel = () => {
  isChanging.value = false;
  new_profile_image.value = "";
  new_profile_preview.value = "";
  name.value = "";
};
</script>
