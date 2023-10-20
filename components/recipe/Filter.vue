<template>
  <div
    class="absolute top-0 right-0 mt-12 p-4 border border-gray-300 shadow-lg space-y-3 min-w-[250px] bg-white rounded-lg z-20"
  >
    <div class="flex justify-between items-center rounded-lg z-20">
      <h3 class="text-sm">Filters</h3>
      <button class="text-sm" @click="handleClear">Clear all</button>
    </div>
    <div class="relative z-20">
      <input
        type="text"
        name="keyword"
        id="keyword"
        class="w-full border border-gray-200 focus:outline-none pl-6 py-1 pr-3 text-sm rounded-lg"
        placeholder="Search keywords..."
        v-model="keyword"
      />
      <Icon
        name="carbon:search"
        size="16px"
        class="absolute left-2 top-2 text-gray-400"
      />
    </div>
    <div class="z-20">
      <div class="max-h-[300px]">
        <p class="flex justify-between items-center text-sm">
          <span>Category</span>
          <Icon
            name="carbon:chevron-down"
            size="16px"
            class=""
            @click="handleCategoryToggle"
            :class="openCategoryOption ? 'transform rotate-180' : ''"
          />
        </p>
        <hr class="my-2" />
        <ul v-if="openCategoryOption">
          <li
            v-for="category in filteredCategories"
            :key="category.id"
            class="flex items-center gap-1 text-sm space-y-0.5"
          >
            <input
              type="checkbox"
              name=""
              id=""
              class="rounded-md border-gray-300 border w-3 h-3 cursor-pointer"
              @click="(ev) => handleCategoryOptionSelect(ev, category.name)"
              :checked="categories.includes(category.name)"
            />
            <label>{{ category.name }}</label>
            <span>({{ category.recipe_categories.length }})</span>
          </li>
          <hr class="my-2" />
        </ul>
      </div>
      <div>
        <p class="flex justify-between items-center text-sm">
          <span>Ingredients</span>
          <Icon
            name="carbon:chevron-down"
            size="16px"
            @click="handleIngredientToggle"
            :class="openIngredientOption ? 'transform rotate-180' : ''"
          />
        </p>
        <hr class="my-2" />
        <ul v-if="openIngredientOption">
          <li
            v-for="ingredient in filteredIngredients"
            :key="ingredient.id"
            class="flex items-center gap-1 text-sm space-y-0.5"
          >
            <input
              type="checkbox"
              name=""
              id=""
              class="rounded-md border-gray-300 border w-3 h-3 cursor-pointer"
              @click="(ev) => handleIngredientOptionSelect(ev, ingredient.name)"
              :checked="ingredients.includes(ingredient.name)"
            />
            <label for="">{{ ingredient.name }}</label>
          </li>
          <hr class="my-2" />
        </ul>
      </div>
      <div>
        <p class="flex justify-between items-center text-sm">
          <span>Preparation time</span>
          <Icon
            name="carbon:chevron-down"
            size="16px"
            @click="handlePrepTimeToggle"
            :class="openPrepTimeOption ? 'transform rotate-180' : ''"
          />
        </p>
        <div class="flex justify-between gap-5 mt-2" v-if="openPrepTimeOption">
          <div class="w-max">
            <input
              type="text"
              name="from"
              id="from"
              placeholder="From"
              class="w-20 focus:outline-none text-sm border border-gray-300 rounded-lg px-2 py-1"
            />
          </div>
          <div class="w-max">
            <input
              type="text"
              name="to"
              id="to"
              placeholder="To"
              class="w-20 focus:outline-none text-sm border border-gray-300 rounded-lg px-2 py-1"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { fetchCategories, filteredCategories, fetchIngredients } = useRecipe();
const emit = defineEmits(["filter"]);

const categories = ref<String[]>([]);
const ingredients = ref<String[]>([]);
const prepTime = ref<any>({ from: "", to: "" });

const keyword = ref<string>("");

const filteredIngredients = ref<any>([]);

const openCategoryOption = ref(false);
const openIngredientOption = ref(false);
const openPrepTimeOption = ref(false);

const handleCategoryToggle = () => {
  openCategoryOption.value = !openCategoryOption.value;
  openIngredientOption.value = false;
  openPrepTimeOption.value = false;

  if (openCategoryOption.value) {
    fetchCategories(keyword.value);
  }
};
const handleIngredientToggle = () => {
  openIngredientOption.value = !openIngredientOption.value;
  openCategoryOption.value = false;
  openPrepTimeOption.value = false;

  if (openIngredientOption.value) {
    fetchIngredients(keyword.value).then((data: any) => {
      if (!data.error && data.ingredients.length > 0)
        filteredIngredients.value = data.ingredients;
    });
  }
};

const handlePrepTimeToggle = () => {
  openPrepTimeOption.value = !openPrepTimeOption.value;
  openCategoryOption.value = false;
  openIngredientOption.value = false;
};

const handleCategoryOptionSelect = (ev: Event, category: string) => {
  const target = ev.target as HTMLInputElement;
  if (target.checked) {
    categories.value.push(category);
  } else {
    categories.value = categories.value.filter((cat) => cat !== category);
  }
  filterApply();
};

const handleIngredientOptionSelect = (ev: Event, ingredient: string) => {
  const target = ev.target as HTMLInputElement;
  if (target.checked) {
    ingredients.value.push(ingredient);
  } else {
    ingredients.value = ingredients.value.filter((ing) => ing !== ingredient);
  }
  filterApply();
};

const handleClear = () => {
  categories.value = [];
  ingredients.value = [];
  prepTime.value = { from: "", to: "" };
  keyword.value = "";
  filterApply();
};

const filterApply = () => {
  emit("filter", {
    categories: categories.value,
    ingredients: ingredients.value,
    prepTime: prepTime.value,
  });
};

watch(keyword, (value) => {
  if (keyword.value.length === 0) {
    return;
  }
  if (openCategoryOption.value) {
    fetchCategories(value);
  }
  if (openIngredientOption.value) {
    fetchIngredients(value).then((data: any) => {
      if (!data.error && data.ingredients.length > 0)
        filteredIngredients.value = data.ingredients;
    });
  }
});
</script>
