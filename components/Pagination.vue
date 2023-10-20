<template>
  <div>
    <nav class="flex justify-center items-center gap-2">
      <button
        @click="
          () => {
            currentPage > 1 ? (currentPage = currentPage - 1) : null;
          }
        "
      >
        <Icon name="carbon:previous-filled" size="28px" class="text-gray-500" />
      </button>
      <ul class="flex gap-2 items-center">
        <li v-for="page in totalPages" :key="page">
          <button
            :class="
              isCurrentPage(page)
                ? 'bg-primary text-white'
                : 'bg-white text-black'
            "
            class="py-1 px-3 rounded-full transition-all duration-100 ease-in-out"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </li>
      </ul>
      <button
        @click="
          () => {
            currentPage < totalPages ? (currentPage = currentPage + 1) : null;
          }
        "
      >
        <Icon name="carbon:next-filled" size="28px" class="text-gray-500" />
      </button>
    </nav>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["paginate"]);
const { total, perPage } = defineProps({
  total: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    required: true,
  },
});

const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(total / perPage));

const pages = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

const isCurrentPage = (page: number) => {
  return page === currentPage.value;
};

watch(currentPage, (page) => {
  emit("paginate", page);
});
</script>
