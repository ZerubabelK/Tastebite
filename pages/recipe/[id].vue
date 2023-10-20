<template>
  <div class="px-5 sm:px-14 md:px-20 lg:px-32">
    <div v-if="!loading" class="space-y-6 lg:mt-10">
      <RecipePreview :recipe="recipe" :is-new="false" :loading="loading" />
      <div class="flex justify-center items-center">
        <div>
          <RecipeRating :recipe="recipe" />
        </div>
      </div>

      <div class="flex justify-center items-center">
        <div class="w-full md:w-1/2">
          <div class="space-y-10">
            <div v-for="rating in recipe.ratings" :key="rating.id">
              <div class="flex gap-4 items-center">
                <img
                  :src="
                    rating.user.profile_image ||
                    'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8d29tYW4lMjBibHVlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=face&w=500&q=200'
                  "
                  alt="user profile"
                  class="w-16 h-16 object-cover rounded-full"
                />
                <div class="items-center gap-3">
                  <h1>
                    {{ rating.user.first_name }} {{ rating.user.last_name }}
                  </h1>
                  <NuxtRating :rating-value="rating.value" :read-only="true" />
                </div>
              </div>
              <div>
                <p>{{ rating.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div className="flex justify-center items-center h-[400px]">
        <div
          className="animate-spin rounded-full border-t-4 border-primary border-opacity-75 h-12 w-12"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { fetchRecipeById } = useRecipe();
const route = useRoute();

const recipe = ref<any>({});
const loading = ref<boolean>(true);

fetchRecipeById(route.params.id.toString())
  .then((res) => {
    loading.value = false;
    recipe.value = res.recipe || [];
  })
  .catch((err) => {
    loading.value = false;
  });

console.log("single", recipe);
</script>
