<template>
  <div>
    <div>
      <div class="flex flex-col items-center mt-5">
        <h2 class="text-5xl font-semibold mt-6">Your Personal Recipe</h2>
        <p class="text-base text-neutral-600 mt-3">
          Welcome to your personal culinary treasury - a haven for your recipes!
        </p>
      </div>
      <section
        className="box flex flex-col items-center gap-6 px-5 sm:px-14 md:px-20 lg:px-32 mt-8"
      >
        <div className="w-full flex items-center">
          <div class="relative w-full max-w-xl mt-8">
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
        </div>
        <hr className="w-full" />
        <RecipeList :recipes="recipes" />
      </section>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  title: "My Recipes",
  description: "Your personal recipes",
  middleware: ["auth"],
});
const recipes = ref([
  {
    title: "Spaghetti Bolognese",
    description: "Classic Italian pasta dish with meat sauce",
    prep_time: 15,
    cook_time: 45,
    total_time: 60,

    thumnail: "/test.jpg",
    category_name: "Pasta",
  },
  {
    title: "Chicken Stir-Fry",
    description: "Quick and healthy chicken and vegetable stir-fry",
    prep_time: 10,
    cook_time: 15,
    total_time: 25,

    thumnail: "/test.jpg",
    category_name: "Chicken",
  },

  {
    title: "Beef Tacos",
    description: "Flavorful beef filling wrapped in tortillas",
    prep_time: 15,
    cook_time: 15,
    total_time: 30,

    thumnail: "/test.jpg",
    category_name: "Mexican",
  },
  {
    title: "Mushroom Risotto",
    description: "Creamy and delicious rice dish with mushrooms",
    prep_time: 10,
    cook_time: 30,
    total_time: 40,

    thumnail: "/test.jpg",
    category_name: "Rice",
  },
  {
    title: "Spinach and Feta Stuffed Chicken Breast",
    description: "Tender chicken breast filled with spinach and feta cheese",
    prep_time: 20,
    cook_time: 25,
    total_time: 45,

    thumnail: "/test.jpg",
    category_name: "Chicken",
  },
  {
    title: "Homemade Pizza",
    description: "Delicious pizza made from scratch",
    prep_time: 30,
    cook_time: 15,
    total_time: 45,

    thumnail: "/test.jpg",
    category_name: "Pizza",
  },
  {
    title: "Vegetable Curry",
    description: "Flavorful and spicy curry with mixed vegetables",
    prep_time: 15,
    cook_time: 30,
    total_time: 45,

    thumnail: "/test.jpg",
    category_name: "Curry",
  },
  {
    title: "Chocolate Chip Cookies",
    description: "Classic homemade cookies with chocolate chips",
    prep_time: 15,
    cook_time: 10,
    total_time: 25,

    thumnail: "/test.jpg",
    category_name: "Dessert",
  },
  {
    title: "Grilled Salmon",
    description: "Juicy and tender grilled salmon fillet",
    prep_time: 5,
    cook_time: 10,
    total_time: 15,

    thumnail: "/test.jpg",
    category_name: "Seafood",
  },
]);
</script>
