<template>
  <div class="px-5 sm:px-14 md:px-20 lg:px-32">
    <RecipePreview :recipe="recipe" :is-new="false" :loading="loading" />
    <div>
      <RecipeRating :recipe="recipe" :loading="false" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { fetchRecipeById, loading } = useRecipe();
const route = useRoute();

const recipe = ref({});

fetchRecipeById(route.params.id.toString()).then((res) => {
  recipe.value = res.recipe || [];
});
</script>
