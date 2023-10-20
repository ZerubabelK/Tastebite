<template>
  <form
    @submit.prevent
    class="flex flex-col items-center border-gray-200 border rounded-xl p-4 gap-4"
  >
    <div class="space-y-3">
      <h2 class="text-center text-xl font-semibold">Rate the recipe</h2>
      <p class="text-center max-w-[30ch] text-sm font-light">
        What do you think of this recipe, give us your honest opinion.
      </p>
    </div>
    <div class="flex flex-col items-center gap-4">
      <div class="self-start w-max px-16">
        <NuxtRating
          v-model="rating"
          :rating-value="rating"
          :rating-count="5"
          :read-only="false"
          @rating-selected="handleRatingSelected"
          class="text-lg"
        />
      </div>
      <div>
        <textarea
          class="w-full border-2 border-gray-200 rounded-lg p-2 focus:outline-none"
          name="comment"
          id="comment"
          cols="30"
          rows="5"
          v-model="comment"
        ></textarea>
      </div>
      <div>
        <button
          type="submit"
          class="rounded-lg text-sm bg-primary px-3 py-2 text-white"
          @click="handleSubmit"
        >
          <span v-if="!loading"> Submit </span>
          <span v-else>
            <div
              class="animate-spin rounded-full border-t-4 border-white border-opacity-75 h-4 w-4"
            ></div>
          </span>
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { useAuthStore } from "~/store/auth";
import { useUserStore } from "~/store/user";

const { recipe } = defineProps({
  recipe: {
    type: Object,
    required: true,
  },
});

const { user } = useUserStore();
const { isAuthenticated } = useAuthStore();
const { rateRecipe, loading } = useRecipe();

const rating = ref<number>(0);
const comment = ref<string>("");

const handleRatingSelected = (rate: number) => {
  rating.value = rate;
};

const handleSubmit = () => {
  if (!isAuthenticated) {
    toast.error("You need to login to rate this recipe", {
      autoClose: false,
    });
    return;
  }
  if (rating.value === 0) {
    toast.error("Please select a rating");
    return;
  }
  if (
    recipe.ratings.filter((rating: any) => rating.user.id === user.id).length >
    0
  ) {
    toast.error("You have already rated this recipe");
    return;
  }
  rateRecipe(recipe.id, user.id, rating.value!, comment.value).then((res) => {
    if (res.success) {
      toast.success("Recipe rated successfully");
    } else {
      toast.error("Something went wrong");
    }
    rating.value = 0;
    comment.value = "";
  });
};
</script>
