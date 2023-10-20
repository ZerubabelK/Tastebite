<template>
  <div>
    <div v-if="recipe" class="space-y-6">
      <div class="lg:col-span-2 space-y-2" v-if="isNew">
        <div class="mt-10">
          <img
            v-if="recipe.images.length > 0"
            :src="
              recipe.images.length > 0 &&
              recipe.images.filter((image) => image.is_thumbnail)[0].image_url
            "
            class="rounded-lg"
          />
        </div>
        <div>
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="(image, index) in recipe.images.filter(
                (image) => !image.is_thumbnail
              )"
              :key="index"
              class="relative"
            >
              <img
                v-if="image.image_url"
                :src="image.image_url"
                class="aspect-video object-cover rounded-lg"
              />
              <span
                class="w-full h-full bg-opacity-50 bg-neutral-700 absolute top-0 left-0 rounded-lg"
              ></span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="grid grid-cols-1 lg:grid-cols-5 lg:gap-x-6 lg:gap-y-0 gap-y-6"
      >
        <div class="lg:col-span-2 space-y-2" v-if="!isNew">
          <div class="mt-10">
            <img
              :src="
                recipe.images.length > 0 &&
                recipe.images.filter((image) => image.is_thumbnail)[0].image_url
              "
              alt="recipe cover image"
              class="rounded-lg"
            />
          </div>
          <div>
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="(image, index) in recipe.images.filter(
                  (image) => !image.is_thumbnail
                )"
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
        <div class="lg:col-span-3 space-y-3" :class="'lg:col-span-5'">
          <h2 class="lg:text-3xl text-xl font-bold">{{ recipe.title }}</h2>
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
            <div class="flex flex-row gap-2 bg-white" v-if="!isNew">
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
            <NuxtRating
              :read-only="true"
              :ratingValue="recipe.rating ? recipe.rating.length : 0"
              class="text-lg"
            />
          </div>
          <div>
            <p>
              {{ recipe.description }}
            </p>
          </div>
        </div>
      </div>
      <div
        class="grid grid-cols-1 lg:grid-cols-5 lg:gap-x-6 gap-y-6 lg:gap-y-0s"
      >
        <div class="col-span-2">
          <h3 class="font-bold text-xl">Ingredients</h3>
          <ul>
            <li
              v-for="(ingredient, index) in recipe.ingredients"
              :key="index"
              class="flex items-center gap-1"
            >
              <span><Icon name="tabler:point-filled" /></span>
              <span class="text-neutral-600">
                {{ ingredient.quantity }} {{ ingredient.unit }} of
                {{ ingredient.name }}
              </span>
            </li>
          </ul>
        </div>
        <div class="col-span-3">
          <h3 class="font-bold text-xl">Steps</h3>
          <ol>
            <li v-for="(step, index) in recipe.steps" :key="index">
              <span>Step {{ index + 1 }}. </span>
              {{ step.description }}
            </li>
          </ol>
        </div>
      </div>
    </div>
    <div v-else>
      <Loading />
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

if (recipe.likes && recipe.likes.length > 0) {
  recipe.likes.forEach((like: any) => {
    if (like.user_id === user.value.id) {
      is_liked.value = true;
    }
  });
}

const getLikeId = () => {
  let like_id = "";

  if (user && recipe.likes) {
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
