<template>
  <div class="px-5 sm:px-14 md:px-20 lg:px-32">
    <div>
      <div class="flex flex-col items-center my-5">
        <h2 class="text-5xl font-semibold mt-6">Your Recipes</h2>
        <p class="text-base text-neutral-600 mt-3">
          Welcome to your personal culinary treasury - a haven for your recipes!
        </p>
      </div>
      <section className="box flex flex-col items-center gap-6">
        <div className="w-full flex items-center justify-between">
          <h1 class="font-semibold text-xl font-playfair">Recipes</h1>
          <NuxtLink
            href="/recipe/create"
            class="bg-primary px-3 py-1 text-white shadow-lg rounded-lg"
          >
            Create Recipe
          </NuxtLink>
        </div>
        <RecipeList :recipes="recipes" from="my-recipes" :pending="loading" />
      </section>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user";

definePageMeta({
  title: "User Recipes",
  description: "Your recipes",
  middleware: ["auth"],
});
const { getUserRecipes, loading } = useRecipe();
const { user } = useUserStore();

const recipes = ref([]);

getUserRecipes(user.id).then((data) => {
  if (!data.error) recipes.value = data.recipes;
});
</script>
