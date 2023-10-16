<template>
  <div class="px-5 sm:px-14 md:px-20 lg:px-32">
    <div>
      <div class="mt-16 space-y-3">
        <h2 class="font-bold text-5xl text-center">
          Discover Flavorful Creations
        </h2>
        <p class="text-center">
          Delight in a diverse collection of mouthwatering recipes, curated and
          shared by passionate food enthusiasts.
        </p>
      </div>
      <div class="my-5">
        <div className="w-full flex items-center justify-between">
          <div class="relative w-full max-w-xl">
            <Icon
              name="carbon:search"
              size="25px"
              class="absolute left-2 top-2.5 text-neutral-400"
            />
            <input
              type="text"
              name="search_query"
              id="search_query"
              placeholder="Search recipes"
              class="pl-10 px-3 py-2 border border-neutral-300 rounded-lg w-full focus:outline-none"
            />
          </div>
          <div class="flex items-center gap-5">
            <button>Filter</button>
            <nuxt-link
              to="/recipe/create"
              class="bg-primary text-white px-3 py-1 rounded-lg shadow hover:shadow-md"
            >
              Create Recipe
            </nuxt-link>
          </div>
        </div>
      </div>
      <RecipeList :recipes="recipes" :pending="loading" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { fetchRecipes, recipes, loading } = useRecipe();
fetchRecipes();

watch(recipes, (newRecipes) => {
  console.log(newRecipes);
});
</script>
