<template>
  <div class="mt-10">
    <div v-if="recipe">
      <div class="grid grid-cols-1 lg:grid-cols-5 lg:gap-x-6">
        <div class="lg:col-span-2 space-y-2">
          <div class="mt-10">
            <img
              :src="recipe.images && recipe.images[0].image_url"
              alt="recipe cover image"
              class="rounded-lg"
            />
          </div>
          <div>
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="(image, index) in recipe.images.slice(1)"
                :key="index"
                class="relative"
              >
                <img
                  :src="image.image_url"
                  alt="recipe cover image"
                  class="aspect-video object-cover rounded-lg"
                />
                <span
                  class="w-full h-full bg-opacity-50 bg-neutral-700 absolute top-0 left-0 rounded-lg"
                ></span>
              </div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-3 space-y-3">
          <h2 class="lg:text-3xl font-bold">{{ recipe.title }}</h2>
          <div class="flex justify-between">
            <div class="flex items-center gap-3">
              <Icon
                name="solar:chef-hat-outline"
                size="20px"
                class="text-primary"
              />
              <p v-if="isNew" class="text-lg">
                {{ user.first_name }} {{ user.last_name }}
              </p>
              <p v-else class="font-semibold text-lg">
                {{
                  recipe.user &&
                  recipe.user.first_name + " " + recipe.user.last_name
                }}
              </p>
            </div>
            <div class="flex flex-row gap-2 bg-white">
              <span class="relative">
                <Icon
                  v-if="is_liked"
                  name="mdi:heart"
                  size="25px"
                  class="text-red-600 cursor-pointer"
                  @click="() => unlike()"
                />
                <Icon
                  v-else
                  name="mdi:heart-outline"
                  size="25px"
                  class="text-red-600 cursor-pointer"
                  @click="() => like(recipe.id)"
                />
                <span
                  class="absolute -top-1 -right-1 bg-primary w-[14px] h-[14px] text-xs p-1 aspect-square rounded-full text-white flex items-center justify-center border border-white"
                  >{{ recipe?.likes.length }}</span
                >
              </span>
              <span class="relative">
                <Icon
                  v-if="!is_bookmarked"
                  name="material-symbols:bookmark-outline"
                  size="25px"
                  class="text-primary cursor-pointer"
                  @click="() => bookmark(recipe.id)"
                />
                <Icon
                  v-else
                  name="material-symbols:bookmark"
                  size="25px"
                  class="text-primary cursor-pointer"
                  @click="() => unbookmark()"
                />
              </span>
            </div>
          </div>
          <div>
            <NuxtRating :read-only="true" :ratingValue="3" class="text-lg" />
          </div>
          <div>
            <p>
              Donuts, also known as doughnuts, are a popular type of fried or
              baked pastry. They are typically round with a hole in the center,
              though there are various shapes and flavors available. The dough
              is made from ingredients like flour, sugar, yeast, and often eggs
              and milk, resulting in a soft and slightly sweet texture. Donuts
              are commonly enjoyed as a breakfast treat or a snack, and they
              have become a beloved staple of many cuisines around the world.
            </p>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-5 lg:gap-x-6">
        <div class="col-span-2">
          <h3>Ingredients</h3>
          <ul>
            <li
              v-for="(ingredient, index) in recipe.ingredients"
              :key="index"
              class="flex items-center gap-1"
            >
              <span><Icon name="tabler:point-filled" /></span>
              <span>{{ ingredient.unit && ingredient.unit + " of " }}</span>
              <span>{{ ingredient.quantity }}</span>
              {{ ingredient.name }}
            </li>
          </ul>
        </div>
        <div class="col-span-3">
          <h3>Steps</h3>
          <ol>
            <li v-for="(step, index) in recipe.instructions" :key="index">
              <span>Step {{ index + 1 }}. </span>
              {{ step }}
            </li>
          </ol>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="animate-pulse">
        <div
          class="bg-gray-300 h-[300px] w-full rounded-lg"
          style="height: 300px"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "~/store/user";
const { likeRecipe, unlikeRecipe, bookmarkRecipe, unbookmarkRecipe } =
  useRecipe();

const is_liked = ref(false);
const is_bookmarked = ref(false);

const { recipe } = defineProps({
  recipe: {
    type: Object,
    required: true,
  },
  isNew: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const { user } = storeToRefs(useUserStore());

if (recipe.bookmarks && recipe.bookmarks.length > 0) {
  recipe.bookmarks.forEach((bookmark: any) => {
    if (bookmark.user_id === user.value.id) {
      is_bookmarked.value = true;
    }
  });
}

if (recipe.likes.length > 0) {
  recipe.likes.forEach((like: any) => {
    if (like.user_id === user.value.id) {
      is_liked.value = true;
    }
  });
}

const getLikeId = () => {
  let like_id = "";

  if (user) {
    recipe.likes.forEach((like: any) => {
      if (like.user_id === user.value.id) {
        like_id = like.id;
      }
    });
  }

  return like_id;
};

const getBookmarkId = () => {
  let bookmark_id = "";

  if (user) {
    recipe.bookmarks.forEach((bookmark: any) => {
      if (bookmark.user_id === user.value.id) {
        bookmark_id = bookmark.id;
      }
    });
  }

  return bookmark_id;
};

const like = async (recipe_id: String) => {
  is_liked.value = true;
  likeRecipe(recipe_id, user.value.id);
};

const unlike = async () => {
  is_liked.value = false;
  unlikeRecipe(getLikeId());
};

const bookmark = async (recipe_id: String) => {
  is_bookmarked.value = true;
  bookmarkRecipe(recipe_id, user.value.id);
};

const unbookmark = async () => {
  is_bookmarked.value = false;

  unbookmarkRecipe(getBookmarkId());
};
</script>
