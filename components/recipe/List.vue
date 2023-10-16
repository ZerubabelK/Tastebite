<template>
  <div>
    <div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
        v-if="!pending && recipes.length > 0"
      >
        <RecipeCard
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
          :from="from"
        />
      </div>
      <div v-else-if="!pending && recipes.length === 0">
        <div
          className="w-full flex flex-col items-center justify-center space-y-3 p-3"
        >
          <h2 className="text-text-header-2">No Recipes found.</h2>
          <p className="text-text-content">Get started by creating recipe.</p>
          <nuxt-link
            to="/recipe/create"
            className="bg-primary px-4 py-1 text-white rounded"
          >
            Post Recipe
          </nuxt-link>
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
  </div>
</template>

<script lang="ts" setup>
defineProps({
  recipes: {
    type: Array<any>,
    required: true,
  },
  from: {
    type: String,
    default: "home",
  },
  pending: {
    type: Boolean,
    default: false,
  },
});
</script>
