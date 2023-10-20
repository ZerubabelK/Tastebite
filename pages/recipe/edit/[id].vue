<template>
  <div class="px-5 sm:px-14 md:px-20 lg:px-32">
    <div>
      <div class="mt-5 space-y-3">
        <h2 class="font-bold text-3xl text-center">Share Your Recipe</h2>
        <p class="text-center">
          Share your recipe with our community of food enthusiasts. We are
          excited to see what you have to offer!
        </p>
      </div>
      <div class="mt-5" v-if="!loading">
        <VeeForm
          schema
          @submit.prevent
          class="mt-5"
          :validation-schema="createRecipeSchema"
        >
          <div class="grid lg:grid-cols-2 grid-cols-1">
            <div class="lg:border-r lg:border-neutral-400 lg:pr-5">
              <h2 class="capitalize text-2xl font-semibold">Recipe Form</h2>
              <div class="gap-6 mt-5">
                <div class="space-y-5">
                  <div class="space-y-2">
                    <label class="text-base" for="title">Title</label>
                    <VeeField
                      type="text"
                      name="title"
                      id="title"
                      placeholder="Enter recipe title"
                      class="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none"
                      v-model="title"
                    />
                    <VeeErrorMessage
                      name="title"
                      class="text-red-400 text-sm"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="text-base" for="prep_time"
                        >Preparation time</label
                      >
                      <VeeField
                        type="text"
                        name="prep_time"
                        id="prep_time"
                        placeholder="Enter preparation time"
                        class="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none"
                        v-model="prep_time"
                      />
                      <VeeErrorMessage
                        name="prep_time"
                        class="text-red-400 text-sm"
                      />
                    </div>
                    <div class="relative space-y-2">
                      <label class="text-base" for="cook_time"
                        >Categories</label
                      >
                      <div class="relative">
                        <input
                          type="text"
                          name="categories"
                          id="categories"
                          placeholder="Enter recipe categories"
                          class="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none"
                          v-model="category"
                        />
                        <Icon
                          name="carbon:chevron-down"
                          size="16px"
                          class="absolute top-3.5 right-2 cursor-pointer"
                          @click="handleCategoryToggle"
                          :class="
                            openCategoryOption ? 'transform rotate-180' : ''
                          "
                        />
                      </div>
                      <p
                        v-if="checkError('categories')"
                        class="text-red-400 text-sm"
                      >
                        {{
                          errors.filter(
                            (error) => error.field === "categories"
                          )[0].message
                        }}
                      </p>
                      <div class="flex gap-2 flex-wrap">
                        <div
                          v-for="category in categories"
                          :key="category.toString()"
                        >
                          <div
                            class="bg-opacity-70 bg-slate-100 text-black w-fit px-2 py-1 rounded-xl"
                          >
                            <p class="flex items-center">
                              <span class="text-neutral-600">
                                {{ category.category }}
                              </span>
                              <span class="ml-2 cursor-pointer">
                                <Icon
                                  name="carbon:close-filled"
                                  size="18px"
                                  class="text-primary bg-white transform hover:scale-150 transition-all h-max w-max rounded-full"
                                  @click="
                                    (e) =>
                                      handleCategoryRemove(e, category.category)
                                  "
                                />
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="openCategoryOption"
                        class="absolute right-0 z-20 mt-1 overflow-hidden bg-white rounded-md shadow-xl w-full"
                      >
                        <div
                          v-for="category in filteredCategories"
                          :key="category.name"
                        >
                          <hr class="border-neutral-100" />

                          <button
                            type="button"
                            class="block text-left w-full px-4 py-3 text-sm text-neutral-600 capitalize transition-colors duration-200 transform hover:bg-gray-100"
                            @click="handleCategoryOptionSelect(category.name)"
                          >
                            {{ category.name }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="h-full">
                  <div class="h-full space-y-2">
                    <label class="text-base" for="description"
                      >Description</label
                    >
                    <textarea
                      name="description"
                      id="description"
                      placeholder="Enter recipe description"
                      class="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none h-full max-h-32"
                      rows="10"
                      v-model="description"
                    ></textarea>
                    <p
                      v-if="checkError('description')"
                      class="text-red-400 text-sm"
                    >
                      {{
                        errors.filter(
                          (error) => error.field === "description"
                        )[0].message
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <hr class="my-5" />
              <div>
                <div class="gap-6">
                  <div>
                    <div>
                      <div>
                        <h3 class="text-xl">Images</h3>
                        <p class="text-neutral-400 text-sm">
                          Select multiple images for your recipe
                        </p>
                        <p
                          v-if="checkError('images')"
                          class="text-red-400 text-sm"
                        >
                          {{
                            errors.filter(
                              (error) => error.field === "images"
                            )[0].message
                          }}
                        </p>
                      </div>
                    </div>
                    <div
                      v-if="images.length === 0"
                      class="flex items-center justify-center"
                      @drop.prevent="handleFileSelect"
                    >
                      <div
                        @click="handleFileEvent"
                        class="flex basis-1/4 items-center justify-center flex-col space-y-8 w-full mt-3"
                      >
                        <label
                          class="flex flex-col items-center justify-center w-full h-32 p-3 border-4 border-dashed rounded-lg hover:bg-gray-100 hover:border-gray-300"
                        >
                          <div
                            class="flex flex-col items-center justify-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clip-rule="evenodd"
                              />
                            </svg>
                            <p
                              class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600 text-center"
                            >
                              Select multiple images
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div v-else class="grid grid-cols-5 gap-3">
                      <div
                        v-for="image in images"
                        :key="image.image_url.toString()"
                        class="relative h-max cursor-pointer"
                      >
                        <img
                          :src="image.image_url.toString()"
                          alt="recipe image"
                          class="aspect-video object-cover w-32 rounded-lg"
                          @click="handleThumbnailChange(image.image_url)"
                        />
                        <span
                          v-if="thumbnail?.image_url === image.image_url"
                          class="bg-opacity-50 bg-black absolute w-full h-full z-10 top-0 left-0 rounded-lg flex items-center justify-center"
                        >
                          <Icon
                            name="carbon:checkmark-filled"
                            size="35px"
                            class="text-white"
                          />
                        </span>
                        <button
                          type="button"
                          class="absolute -top-3 -right-1 transform hover:scale-150 transition-all h-max w-max rounded-full z-10"
                          @click="
                            (e) => removeSelectedImage(e, image.image_url)
                          "
                        >
                          <Icon
                            name="carbon:close-filled"
                            size="18px"
                            class="text-primary bg-white rounded-full"
                          />
                        </button>
                      </div>
                      <div
                        class="flex flex-col items-center justify-center"
                        @click="handleFileEvent"
                      >
                        <h4>Add Image</h4>
                        <Icon
                          name="carbon:add-filled"
                          size="35px"
                          class="text-neutral-400"
                        />
                        <input
                          class="hidden w-60"
                          ref="file"
                          type="file"
                          accept="image/*"
                          multiple
                          name="image"
                          id=""
                          @change="handleFileSelect"
                        />
                      </div>
                    </div>
                    <input
                      class="hidden w-60"
                      ref="file"
                      type="file"
                      accept="image/*"
                      multiple
                      name="image"
                      id="file_input"
                      @change="handleFileSelect"
                    />
                  </div>
                  <hr class="my-5" />
                  <div class="space-y-5">
                    <div>
                      <div>
                        <h3 class="text-xl">Ingredients</h3>
                        <p class="text-neutral-400 text-sm">
                          Add multiple ingredients for your recipe and their
                          amount in the fields below.
                        </p>
                        <p
                          v-if="checkError('ingredients')"
                          class="text-red-400 text-sm"
                        >
                          {{
                            errors.filter(
                              (error) => error.field === "ingredients"
                            )[0].message
                          }}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div class="grid grid-cols-5 gap-3">
                        <div class="space-y-2 col-span-2">
                          <label class="text-base" for="ingredient_name"
                            >Ingredient Name</label
                          >
                          <input
                            type="text"
                            name="ingredient_name"
                            id="ingredient_name"
                            placeholder="Enter ingredient name"
                            class="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none"
                            v-model="ingredient_name"
                          />
                        </div>
                        <div class="space-y-2">
                          <label class="text-base" for="amount">Amount</label>
                          <input
                            type="text"
                            name="amount"
                            id="amount"
                            placeholder="Enter amount"
                            class="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none"
                            v-model="amount"
                          />
                        </div>
                        <div class="relative space-y-2">
                          <label class="text-base" for="ingredient_name"
                            >Unit</label
                          >
                          <input
                            type="text"
                            name="unit"
                            id="unit"
                            placeholder="Enter unit"
                            class="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none"
                            v-model="unit"
                          />
                          <div
                            v-if="openUnitOption"
                            class="absolute right-0 z-20 mt-1 overflow-hidden bg-white rounded-md shadow-xl w-full"
                          >
                            <div v-for="unit in filteredUnits" :key="unit">
                              <hr class="border-neutral-100" />

                              <button
                                type="button"
                                class="block text-left w-full px-4 py-3 text-sm text-neutral-600 capitalize transition-colors duration-200 transform hover:bg-gray-100"
                                @click="handleUnitSelect(unit)"
                              >
                                {{ unit }}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div class="flex flex-col justify-end">
                          <button
                            type="button"
                            class="bg-primary px-3 py-1 text-white rounded-lg h-[41px]"
                            @click="handleAddIngredient"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="flex gap-2 flex-wrap">
                      <div
                        v-for="ingredient in ingredients"
                        :key="ingredient.ingredient_name.toString()"
                      >
                        <div
                          class="bg-opacity-70 bg-slate-100 text-black w-fit px-2 py-1 rounded-xl"
                        >
                          <p class="flex items-center">
                            <span class="text-neutral-600">
                              {{ ingredient.amount }} {{ ingredient.unit }} of
                              {{ ingredient.ingredient_name }}
                            </span>
                            <span
                              class="ml-2 cursor-pointer"
                              @click="
                                (e) => handleIngredientRemove(e, ingredient)
                              "
                            >
                              <Icon
                                name="carbon:close-filled"
                                size="18px"
                                class="text-primary bg-white transform hover:scale-110 transition-all h-max w-max rounded-full"
                              />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="my-5" />
              <div class="gap-8 pb-20">
                <div class="space-y-5">
                  <div>
                    <div class="space-y-2">
                      <h3 class="text-xl">Steps</h3>
                      <p class="text-neutral-400 text-sm">
                        Specify the steps to prepare your recipe.
                      </p>
                      <p
                        v-if="checkError('instructions')"
                        class="text-red-400 text-sm"
                      >
                        {{
                          errors.filter(
                            (error) => error.field === "instructions"
                          )[0].message
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-5 gap-3">
                    <div class="col-span-4">
                      <div class="space-y-2">
                        <label class="text-base" for="instruction"
                          >Detail</label
                        >
                        <input
                          type="text"
                          name="instruction"
                          id="instruction"
                          placeholder="Enter ingredient name"
                          class="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none"
                          v-model="instruction"
                        />
                      </div>
                    </div>
                    <div class="flex items-end">
                      <button
                        type="button"
                        class="bg-primary px-3 py-1 text-white rounded-lg h-[41px] w-full"
                        @click="handleAddInstruction"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <div
                      v-for="(instruction, index) in instructions"
                      :key="instruction.toString()"
                      class="mt-3"
                    >
                      <p
                        class="text-base flex gap-1 items-center justify-between bg-opacity-70 rounded-lg px-2 py-1 bg-slate-100"
                      >
                        <span class="text-neutral-600 capitalize"
                          >{{ index + 1 }}. {{ instruction.description }}</span
                        >
                        <span>
                          <Icon
                            name="carbon:close-filled"
                            size="18px"
                            class="text-primary bg-white transform hover:scale-110 transition-all h-max w-max rounded-full cursor-pointer"
                            @click="
                              (e) =>
                                handleInstructionRemove(
                                  e,
                                  instruction.description
                                )
                            "
                          />
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="my-5" />
              <div class="flex justify-center pb-16">
                <button
                  class="bg-primary px-3 py-1 text-white rounded-lg"
                  @click="handleSubmit"
                >
                  Submit
                </button>
              </div>
            </div>
            <div class="lg:pl-5 hidden lg:block">
              <div>
                <h2 class="capitalize text-2xl font-semibold">Preview</h2>
              </div>
              <div>
                <RecipePreview
                  :recipe="{
                    title,
                    description,
                    prep_time,
                    images,
                    ingredients,
                    instructions,
                  }"
                  :isNew="false"
                />
              </div>
            </div>
          </div>
        </VeeForm>
      </div>
      <div class="flex items-center justify-center" v-else>
        <Loading />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "~/store/user";

definePageMeta({
  middleware: ["auth"],
});

const { user } = useUserStore();
const {
  fetchCategories,
  filteredCategories,
  updateRecipe,
  fetchRecipeById,
  loading,
} = useRecipe();

const { errors, validate } = useValidate();

const handleCategoryFilter = (ev: Event) => {
  const target = ev.target as HTMLInputElement;
  const { value } = target;
  fetchCategories(value).then(() => {
    console.log(filteredCategories.value);
  });
};

const openCategoryOption = ref(false);
const category = ref<String>("");

const title = ref("");
const description = ref("");
const prep_time = ref<number>();

const categories = ref<{ category: String; id?: String }[]>([]);

const ingredient_name = ref("");
const amount = ref("");
const unit = ref("");
const ingredients = ref<
  {
    id?: String;
    ingredient_name: String;
    amount: String;
    unit: String;
  }[]
>([]);

const instruction = ref<String>("");
const instructions = ref<{ description: String; id?: String }[]>([]);

const thumbnail = ref<{ image_url: String; id?: String }>();

const images = ref<{ image_url: String; id?: String }[]>([]);

const id = useRoute().params.id;

fetchRecipeById(id.toString()).then((data) => {
  if (!data.error) {
    if (data.recipe.user.id !== user.id) {
      navigateTo("/error");
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized access",
      });
    }
    title.value = data.recipe.title;
    description.value = data.recipe.description;
    prep_time.value = data.recipe.prep_time;
    ingredients.value = data.recipe.ingredients.map((ing: any) => {
      return {
        id: ing.id,
        ingredient_name: ing.name,
        amount: ing.quantity,
        unit: ing.unit,
      };
    });
    instructions.value = data.recipe.steps.map((step: any) => {
      return { description: step.description, id: step.id };
    });
    categories.value = data.recipe.recipe_categories.map((cat: any) => {
      return { category: cat.category, id: cat.id };
    });
    thumbnail.value =
      data.recipe.images.length > 0
        ? data.recipe.images.filter((img: any) => img.is_thumbnail)[0]
        : { image_url: "" };
    images.value = data.recipe.images.map((img: any) => {
      return {
        id: img.id,
        image_url: img.image_url,
      };
    });
  } else {
    throw new Error("An error occurred while fetching recipe");
  }
});

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target?.result;
        if (dataURL) {
          let flag = false;
          images.value.forEach((img) => {
            if (img.image_url === dataURL.toString()) {
              flag = true;
              return;
            }
          });
          if (!flag) {
            images.value.push({ image_url: dataURL.toString() });
          }
          if (thumbnail.value?.image_url === "") {
            thumbnail.value = { image_url: dataURL.toString() };
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }
};

const handleFileEvent = () => {
  document.getElementById("file_input")?.click();
};

const handleThumbnailChange = (image: String) => {
  thumbnail.value!.image_url = image;
};

const removeSelectedImage = (e: Event, image: String) => {
  e.stopPropagation();
  images.value = images.value.filter((img) => img.image_url !== image);
  if (thumbnail.value!.image_url === image) {
    thumbnail.value!.image_url = images.value[0].image_url;
  }
};

const handleAddIngredient = () => {
  validate({
    ingredient_name: ingredient_name.value,
    ingredient_quantity: amount.value,
    ingredient_unit: unit.value,
  });
  ingredients.value.push({
    ingredient_name: ingredient_name.value,
    amount: amount.value,
    unit: unit.value,
  });
  ingredient_name.value = "";
  amount.value = "";
  unit.value = "";
};

const handleIngredientRemove = (
  e: Event,
  ingredient: { ingredient_name: any; amount: any }
) => {
  e.stopPropagation();
  ingredients.value = ingredients.value.filter(
    (ing) => ing.ingredient_name !== ingredient.ingredient_name
  );
};

const handleCategoryRemove = (e: Event, cat: String) => {
  e.stopPropagation();
  categories.value = categories.value.filter((c) => c.category !== cat);
};

const handleAddInstruction = () => {
  validate({
    instruction_description: instruction.value,
  });
  instructions.value.push({ description: instruction.value });
  instruction.value = "";
};

const handleInstructionRemove = (e: Event, instruction: String) => {
  e.stopPropagation();
  instructions.value = instructions.value.filter(
    (instr) => instr.description !== instruction
  );
};

const handleCategoryToggle = () => {
  openCategoryOption.value = !openCategoryOption.value;
  if (openCategoryOption.value) {
    fetchCategories(category.value);
  }
};

const handleCategoryOptionSelect = (selectedCategory: String) => {
  if (
    categories.value.filter((cat) => cat.category === selectedCategory).length >
    0
  ) {
    return;
  }
  categories.value.push({ category: selectedCategory });
  openCategoryOption.value = false;
  category.value = "";
};

const handleSubmit = () => {
  const formattedImages = images.value.map((image) => {
    if (image.image_url.startsWith("http")) {
      return image.image_url;
    }
    return image.image_url.split(",")[1];
  });

  let base64Thumbnail = "";

  if (thumbnail.value?.image_url.startsWith("http")) {
    base64Thumbnail = thumbnail.value?.image_url.toString();
  } else {
    base64Thumbnail = thumbnail.value?.image_url.split(",")[1].toString() || "";
  }

  validate({
    ingredients: ingredients.value,
    instructions: instructions.value,
    categories: categories.value,
    images: images.value,
    description: description.value,
  });
  console.log(errors.value);
  if (errors.value.length === 0) {
    updateRecipe(
      {
        title: title.value,
        description: description.value,
        prep_time: prep_time.value,
        ingredients: ingredients.value,
        steps: instructions.value,
        categories: categories.value,
      },
      formattedImages,
      base64Thumbnail,
      id.toString()
    ).then((data) => {
      if (!data.error) {
        navigateTo(`/recipe/${id}`);
      } else {
        throw new Error("An error occurred while updating recipe");
      }
    });
  }
};

const checkError = (field: String) => {
  return errors.value.filter((error) => error.field === field).length > 0;
};

watch(category, (value) => {
  if (value.length > 0) {
    fetchCategories(category.value);
    openCategoryOption.value = true;
  } else {
    openCategoryOption.value = false;
  }
});

const units = [
  "teaspoon",
  "tablespoon",
  "fluid ounce",
  "cup",
  "pint",
  "quart",
  "gallon",

  "ounce",
  "pound",
  "gram",
  "kilogram",

  "each",
  "piece",
  "dozen",

  "pinch",
  "dash",
  "sprinkle",
  "handful",
  "slice",
  "wedge",
  "whole",
];

const openUnitOption = ref(false);

watch(unit, (value) => {
  if (value.length > 0) {
    openUnitOption.value = true;
  } else {
    openUnitOption.value = false;
  }
});

const handleUnitSelect = (un: String) => {
  unit.value = String(un);
  openUnitOption.value = false;
};

const filteredUnits = toRef(
  computed(() => {
    return units.filter((un) => un.includes(unit.value.toLowerCase()));
  })
);
</script>
