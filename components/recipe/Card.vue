<template>
  <div
    class="flex flex-col gap-1 justify-between shadow hover:shadow-lg rounded"
  >
    <div class="relative">
      <img
        :src="cover_image || '/test.jpg'"
        :alt="recipe?.title"
        class="object-cover w-full rounded-t aspect-video h-44 md:h-52"
      />
      <div
        class="absolute top-2 right-0 flex flex-col gap-2 p-2 bg-white rounded-l-lg z-10"
      >
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
            >{{ likeCount }}</span
          >
        </span>
        <span class="relative" v-if="isAuthenticated">
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
      <div
        class="absolute bottom-0 left-0 w-full backdrop-blur-sm bg-[#fffcf5b8] p-4 flex justify-between"
      >
        <h2 class="font-bold">
          {{ recipe.user.first_name }} {{ recipe.user.last_name }}
        </h2>
        <p class="text-sm">Aug 9, 2023</p>
      </div>
    </div>
    <div class="bg-white flex flex-col gap-3 p-4 justify-between aspect-video">
      <h2 class="font-bold text-lg">
        {{ recipe?.title }}
      </h2>
      <p class="text-sm">{{ description }}</p>
      <NuxtRating
        :read-only="true"
        :ratingValue="totalRating"
        class="text-lg"
      />
    </div>
    <div class="flex justify-between items-center">
      <nuxt-link
        class="flex gap-1 items-center p-4 mt-4 max-w-max hover:border-primary hover:text-primary"
        :to="`/recipe/${recipe.id}`"
        >Read more<svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 16 16"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"
          ></path></svg
      ></nuxt-link>
      <nuxt-link
        v-if="from === 'my-recipes'"
        :href="`/recipe/edit/${recipe.id}`"
        class="flex gap-1 items-center p-4 mt-4 max-w-max text-neutral-600 hover:border-primary hover:text-primary"
      >
        Edit
        <Icon name="akar-icons:edit" size="22px" />
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toast } from "vue3-toastify";
import { useAuthStore } from "~/store/auth";
import { useUserStore } from "~/store/user";
const { likeRecipe, unlikeRecipe, bookmarkRecipe, unbookmarkRecipe } =
  useRecipe();

const { isAuthenticated } = useAuthStore();

const props = defineProps(["recipe", "from"]);
const { user } = useUserStore();
const description = ref("");
const cover_image = ref("");
const is_liked = ref(false);
const is_bookmarked = ref(false);
const likeCount = ref(0);

if (props.recipe.description.length > 100)
  description.value = props.recipe.description.substring(0, 100) + "...";
else description.value = props.recipe.description;

if (props.recipe.likes.length > 0) {
  likeCount.value = props.recipe.likes.length;
}

if (props.recipe.images.length > 0) {
  props.recipe.images.forEach((image: any) => {
    if (image.is_thumbnail) {
      cover_image.value = image.image_url;
    }
  });
}

if (user.bookmarks && user.bookmarks.length > 0) {
  user.bookmarks.forEach((bookmark: any) => {
    if (bookmark.recipe.id === props.recipe.id) {
      is_bookmarked.value = true;
    }
  });
}

if (props.recipe.likes.length > 0) {
  props.recipe.likes.forEach((like: any) => {
    if (like.user_id === user.id) {
      is_liked.value = true;
    }
  });
}

const getLikeId = () => {
  let like_id = "";

  if (user) {
    props.recipe.likes.forEach((like: any) => {
      if (like.user_id === user.id) {
        like_id = like.id;
      }
    });
  }

  return like_id;
};

const getBookmarkId = () => {
  let bookmark_id = "";

  if (user) {
    user.bookmarks.forEach((bookmark: any) => {
      if (bookmark.user_id === user.id) {
        bookmark_id = bookmark.id;
      }
    });
  }

  return bookmark_id;
};

const like = async (recipe_id: String) => {
  if (!isAuthenticated) {
    toast.info("Please login to like this recipe");
    return;
  }
  is_liked.value = true;
  likeCount.value += 1;
  likeRecipe(recipe_id, user.id);
};

const unlike = async () => {
  if (!isAuthenticated) {
    toast.info("Please login to like this recipe");
    return;
  }
  is_liked.value = false;
  likeCount.value -= 1;
  unlikeRecipe(getLikeId());
};

const bookmark = async (recipe_id: String) => {
  is_bookmarked.value = true;
  bookmarkRecipe(recipe_id, user.id);
};

const unbookmark = async () => {
  if (props.from === "saved") {
    window.location.reload();
  } else {
    is_bookmarked.value = false;
  }
  unbookmarkRecipe(getBookmarkId());
};
const totalRating = ref(0);

if (props.recipe.ratings && props.recipe.ratings.length > 0) {
  console.log("total", props.recipe.ratings);
  let total = 0;
  props.recipe.ratings.forEach((rating: any) => {
    total += rating.value;
  });
  totalRating.value = total / props.recipe.ratings.length;
}
</script>
