<template>
  <div class="px-5 sm:px-14 md:px-20 lg:px-32">
    <div class="space-y-8">
      <div class="mt-16 space-y-3">
        <h2 class="font-bold text-2xl sm:text-3xl md:text-5xl text-center">
          Discover Flavorful Creations
        </h2>
        <p
          class="text-center text-sm text-neutral-600 md:text-base md:text-black"
        >
          Delight in a diverse collection of mouthwatering recipes, curated and
          shared by passionate food enthusiasts.
        </p>
      </div>
      <div class="mt-5 space-y-5">
        <div
          className="relative w-full flex items-center justify-between flex-nowrap "
        >
          <RecipeSearch @search="handleSearch" />

          <div class="flex items-center">
            <button @click="() => (filterOptionsOpen = !filterOptionsOpen)">
              Filter By
              <Icon
                name="carbon:chevron-down"
                size="16px"
                class="text-gray-600"
                :class="filterOptionsOpen ? 'transform rotate-180' : ''"
              />
            </button>
            <RecipeFilter v-if="filterOptionsOpen" @filter="handleFilter" />
          </div>
        </div>
      </div>
      <hr class="w-full border-gray-200 border my-5" />
      <RecipeList :recipes="recipes" :pending="loading" />
      <Pagination
        :total="totalRecipeCount"
        :perPage="limit"
        v-if="totalRecipeCount > 0"
        @paginate="handlePagination"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const limit = 3;
const page = ref(1);
const {
  fetchRecipes,
  recipes,
  loading,
  filterRecipes,
  getTotalRecipeCount,
  totalRecipeCount,
} = useRecipe();
fetchRecipes(limit);

getTotalRecipeCount().then((res) => {
  console.log("count", res.count);
});

const filterOptionsOpen = ref<boolean>(false);

const handleFilter = (fil: any) => {
  page.value = 1;
  const { categories, ingredients, prepTime } = fil;
  if (categories.length === 0 && ingredients.length === 0)
    return fetchRecipes(limit);
  const filter = {
    _or: [
      { recipe_categories: { category: { _in: categories } } },
      { ingredients: { name: { _in: ingredients } } },
    ],
  };
  filterRecipes(filter, limit, limit * (page.value - 1));
};

const handleSearch = (query: string) => {
  page.value = 1;
  if (query === "") return fetchRecipes(limit);
  const filter = {
    _or: [
      { title: { _ilike: `%${query}%` } },
      { user: { first_name: { _ilike: `%${query}%` } } },
      { user: { last_name: { _ilike: `%${query}%` } } },
    ],
  };
  filterRecipes(filter, limit, limit * (page.value - 1));
};

const handlePagination = (pg: number) => {
  fetchRecipes(limit, limit * (pg - 1));
  page.value = pg;
};
</script>
