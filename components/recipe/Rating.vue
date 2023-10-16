<template>
  <div>
    <div>
      <h2>Rate the recipe</h2>
    </div>
    <div>
      <div>
        <NuxtRating
          v-model="rating"
          :rating-value="rating"
          :rating-count="5"
          :read-only="false"
          :on-rating-selected="handleRatingSelected"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const { recipe, loading } = defineProps({
  recipe: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const rating = ref(0);

const handleRatingSelected = (rate: number) => {
  console.log(rate);
};
</script>
