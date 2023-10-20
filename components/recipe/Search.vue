<template>
  <div class="relative w-64 md:w-96 z-20">
    <Icon
      name="carbon:search"
      size="25px"
      class="absolute left-2 top-2 md:top-2.5 text-neutral-400 md:text-base text-sm"
    />
    <input
      type="text"
      name="search_query"
      id="search_query"
      placeholder="Search recipes by title or author"
      v-model="query"
      class="pl-10 px-3 py-2 border border-neutral-300 rounded-lg w-full focus:outline-none md:text-base text-sm"
    />
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["search"]);

const query = ref<string>("");

watch(query, (val) => {
  emit("search", val);
});
</script>
