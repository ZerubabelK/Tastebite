<template>
  <section
    className="box flex flex-col items-center gap-6 px-5 sm:px-14 md:px-20 lg:px-32 mt-16"
  >
    <div className="w-full flex justify-between items-center">
      <h2 className="md:text-3xl text-xl font-bold capitalize">
        Latest Recipes
      </h2>
      <NuxtLink to="/recipe">
        <button
          class="rounded-lg text-sm bg-primary px-3 md:py-2 py-1 text-white"
        >
          View More <Icon name="cil:arrow-top" size="20px" class="rotate-45" />
        </button>
      </NuxtLink>
    </div>
    <hr className="w-full" />
    <div>
      <RecipeList :recipes="recipes" :pending="loading" />
    </div>
  </section>
</template>

<script lang="ts" setup>
const { fetchRecipes, recipes, loading } = useRecipe();
fetchRecipes(8);
console.log(recipes);
</script>
