<template>
  <div>
    <div v-for="rating in ratings" :key="rating.id">
      <div class="flex gap-4 items-center">
        <img
          :src="
            rating.user.profile_image ||
            'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8d29tYW4lMjBibHVlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=face&w=500&q=200'
          "
          alt="user profile"
        />
        <div class="flex items-center gap-3">
          <h1>{{ rating.user.first_name }} {{ rating.user.last_name }}</h1>
          <NuxtRating :rating-value="rating.value" :read-only="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NuxtRating } from "#build/components";

const { ratings } = defineProps({
  ratings: {
    type: Array as PropType<any>,
    required: true,
  },
});
console.log("rating", ratings);
</script>
