<template>
  <div class="px-5 sm:px-14 md:px-20 lg:px-32">
    <div>
      <div class="flex flex-col items-center mt-5">
        <h2 class="text-5xl font-semibold mt-6">Your Favorite Recipe</h2>
        <p class="text-base text-neutral-600 mt-3">
          Welcome to your personal culinary treasury - a haven for your recipes!
        </p>
      </div>
      <section className="box flex flex-col items-center gap-6">
        <div className="w-full flex items-center ">
          <h1 class="font-semibold text-xl font-playfair">Favorite recipes</h1>
        </div>
        <hr className="w-full my-5" />
        <RecipeList :recipes="recipes" from="saved" :pending="loading" />
      </section>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user";

definePageMeta({
  title: "Saved Recipes",
  description: "Your favorite recipes",
  middleware: ["auth"],
});
const { getBookmarks, loading } = useRecipe();
const { user } = useUserStore();

const recipes = ref([]);

getBookmarks(user.id).then((data) => {
  if (!data.error)
    recipes.value = data.bookmarks.map((bookmark: any) => bookmark.recipe);
});
</script>
