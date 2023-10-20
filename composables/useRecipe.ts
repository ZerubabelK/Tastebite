export default function () {
  const recipes = ref<any[]>([]);
  const loading = ref(false);
  const filteredCategories = ref([]);
  const totalRecipeCount = ref(0);

  return {
    fetchRecipes: async (limit?: number, offset?: number) => {
      loading.value = true;
      const query = gql`
        query GetRecipes($limit: Int, $offset: Int) {
          recipe(
            order_by: { created_at: desc }
            limit: $limit
            offset: $offset
          ) {
            id
            title
            description
            prep_time
            recipe_categories {
              id
              category
            }
            user {
              id
              first_name
              last_name
              username
              profile_image
            }
            images(order_by: { is_thumbnail: desc }) {
              id
              image_url
              is_thumbnail
            }
            ingredients {
              id
              name
              quantity
              unit
            }
            steps(order_by: { number: asc }) {
              id
              description
              number
            }
            likes {
              id
              user_id
              recipe_id
            }
            ratings {
              id
              value
              comment
              user {
                id
                first_name
                last_name
                profile_image
              }
            }
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query,
          variables: {
            limit,
            offset,
          },
          cache: true,
        });
      // console.log("recipe", data, error);
      if (status.value === "success") {
        recipes.value = data.value!.recipe;
        loading.value = false;
      }
      loading.value = false;
    },

    fetchRecipeById: async (id: String) => {
      loading.value = true;
      const query = gql`
        query GetRecipeById($id: uuid!) {
          recipe_by_pk(id: $id) {
            id
            title
            description
            prep_time
            recipe_categories {
              id
              category
            }
            user {
              id
              first_name
              last_name
              username
              profile_image
            }
            images(order_by: { is_thumbnail: desc }) {
              id
              image_url
              is_thumbnail
            }
            ingredients {
              id
              name
              quantity
              unit
            }
            steps {
              id
              description
              number
            }
            likes {
              id
              user_id
              recipe_id
            }
            ratings {
              id
              value
              comment
              user {
                id
                first_name
                last_name
                profile_image
              }
            }
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query,
          variables: {
            id,
          },
          cache: true,
        });
      if (status.value === "success") {
        loading.value = false;
        return { recipe: data.value!.recipe_by_pk };
      }
      loading.value = false;
      return { error: "Error fetching recipe" };
    },

    subscribeRecipeLikes: (recipe_id: String) => {
      const query = gql`
        subscription OnLike($filter: like_bool_exp!) {
          like(where: $filter) {
            id
            user_id
            recipe_id
          }
        }
      `;
      const { onResult, onError } = useSubscription(
        query,
        {
          filter: {
            recipe_id: {
              _eq: recipe_id,
            },
          },
        },
        {
          fetchPolicy: "network-only",
        }
      );

      onResult((data: any) => {
        return data.data.like;
      });
      onError((error: any) => {
        console.log(error);
      });
      return [];
    },

    filterRecipes: async (filter: Object, limit?: number, offset?: number) => {
      loading.value = true;
      const query = gql`
        query SearchRecipe(
          $filter: recipe_bool_exp
          $limit: Int
          $offset: Int
        ) {
          recipe(
            where: $filter
            order_by: { created_at: desc }
            limit: $limit
            offset: $offset
          ) {
            id
            title
            description
            prep_time
            recipe_categories {
              id
              category
            }
            user {
              id
              first_name
              last_name
              username
              profile_image
            }
            images(order_by: { is_thumbnail: desc }) {
              id
              image_url
              is_thumbnail
            }
            ingredients {
              id
              name
              quantity
              unit
            }
            steps {
              id
              description
              number
            }
            likes {
              id
              user_id
              recipe_id
            }
            ratings {
              id
              value
              comment
              user {
                id
                first_name
                last_name
                profile_image
              }
            }
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query,
          variables: {
            filter,
            limit,
            offset,
          },
          cache: true,
        });
      if (status.value === "success") {
        recipes.value = data.value!.recipe;
      }
      loading.value = false;
    },
    getTotalRecipeCount: async () => {
      const query = gql`
        query GetTotalRecipeCount {
          recipe {
            id
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query,
          cache: true,
        });
      if (status.value === "success") {
        totalRecipeCount.value = data.value!.recipe.length;
        return { count: data.value!.recipe.length };
      }
      return { error: "Error fetching recipe count" };
    },
    fetchCategories: async (search: String) => {
      const query = gql`
        query GetCategories($filter: category_bool_exp!) {
          category(where: $filter) {
            name
            recipe_categories {
              id
            }
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query,
          variables: {
            filter: { name: { _ilike: `%${search}%` } },
          },
          cache: true,
        });
      if (status.value === "success") {
        filteredCategories.value = data.value!.category;
      }
    },
    fetchIngredients: async (search: String) => {
      const query = gql`
        query GetIngredients($filter: ingredient_bool_exp!) {
          ingredient(where: $filter) {
            id
            name
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query,
          variables: {
            filter: { name: { _ilike: `%${search}%` } },
          },
          cache: true,
        });
      if (status.value === "success") {
        const ingredients = new Set(data.value!.ingredient);
        return { ingredients: [...ingredients] };
      }
      return { error: "Error fetching ingredients" };
    },
    publishRecipe: async (recipe: any, images: any[], thumbnail: any) => {
      console.log("recipe", recipe, images, thumbnail);
      let query = gql`
        mutation ($arg: UploadInput!) {
          uploadImages(arg: $arg) {
            image_urls
            error
            success
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query: query,
          variables: {
            arg: {
              images,
            },
          },
        });
      if (status.value === "success") {
        const { image_urls } = data.value!.uploadImages;

        const {
          data: thumbnailData,
          error: thumbnailError,
          status: thumbnailStatus,
        }: { data: any; error: any; status: any } = await useAsyncQuery({
          query: query,
          variables: {
            arg: {
              images: [thumbnail],
            },
          },
        });
        console.log(
          "thumbnail",
          thumbnailData,
          thumbnailError,
          thumbnailStatus
        );

        if (thumbnailStatus.value === "success") {
          const { image_urls: thumbnailImages } =
            thumbnailData.value!.uploadImages;
          query = gql`
            mutation PublishRecipe($recipe: recipe_insert_input!) {
              insert_recipe_one(object: $recipe) {
                id
              }
            }
          `;
          image_urls.push(thumbnailImages[0]);
          const {
            data: publishData,
            error: publishError,
            status: publishStatus,
          }: { data: any; error: any; status: any } = await useAsyncQuery({
            query: query,
            variables: {
              recipe: {
                title: recipe.title,
                description: recipe.description,
                prep_time: recipe.prep_time,
                ingredients: {
                  data: recipe.ingredients.map((ingredient: any) => {
                    return {
                      name: ingredient.ingredient_name,
                      quantity: ingredient.amount,
                      unit: ingredient.unit,
                    };
                  }),
                },
                steps: {
                  data: recipe.steps.map((step: any, index: number) => {
                    return {
                      description: step,
                      number: index + 1,
                    };
                  }),
                },
                images: {
                  data: image_urls.map((image: any) => {
                    if (image === thumbnailImages[0]) {
                      return {
                        image_url: image,
                        is_thumbnail: true,
                      };
                    }
                    return {
                      image_url: image,
                      is_thumbnail: false,
                    };
                  }),
                },
                recipe_categories: {
                  data: recipe.categories.map((category: any) => {
                    return {
                      category: category,
                    };
                  }),
                },
              },
            },
          });

          console.log("publish", publishData, publishError, publishStatus);
          if (publishStatus.value === "success") {
            return { success: true };
          } else {
            return { error: "Error publishing recipe" };
          }
        } else {
          return { error: "Error uploading thumbnail" };
        }
      } else {
        return { error: "Error uploading images" };
      }
    },
    updateRecipe: async (
      recipe: any,
      images: any[],
      thumbnail: any,
      recipe_id: String
    ) => {
      loading.value = true;
      const newImages = images.filter((image) => {
        if (image.startsWith("http") && image === thumbnail) {
          return false;
        }
        return true;
      });
      let oldImages = images.filter((image) => {
        if (image.startsWith("http") && image !== thumbnail) {
          return true;
        }
        return false;
      });

      let query = gql`
        mutation ($arg: UploadInput!) {
          uploadImages(arg: $arg) {
            image_urls
            error
            success
          }
        }
      `;
      if (newImages.length > 0) {
        const { data, error, status }: { data: any; error: any; status: any } =
          await useAsyncQuery({
            query,
            variables: {
              arg: {
                images: newImages,
              },
            },
          });
        if (status.value === "success") {
          const { image_urls } = data.value!.uploadImages;
          oldImages = oldImages.concat(image_urls);
        }
      }
      if (!thumbnail.startsWith("http")) {
        const {
          data: thumbnailData,
          error: thumbnailError,
          status: thumbnailStatus,
        }: { data: any; error: any; status: any } = await useAsyncQuery({
          query: query,
          variables: {
            arg: {
              images: [thumbnail],
            },
          },
        });
        if (thumbnailStatus.value === "success") {
          thumbnail = thumbnailData.value!.uploadImages.image_urls[0];
          oldImages.push(thumbnail);
        }
      } else {
        oldImages.push(thumbnail);
      }
      query = gql`
        mutation DeleteRecipeImages($filter: images_bool_exp!) {
          delete_images(where: $filter) {
            affected_rows
          }
        }
      `;
      const {
        data: deleteData,
        error: deleteError,
        status: deleteStatus,
      }: { data: any; error: any; status: any } = await useAsyncQuery({
        query,
        variables: {
          filter: {
            recipe_id: {
              _eq: recipe_id,
            },
          },
        },
      });
      if (deleteStatus.value === "success") {
        // console.log("deleted", deleteData);
      }
      query = gql`
        mutation DeleteRecipeIngredients($filter: ingredient_bool_exp!) {
          delete_ingredient(where: $filter) {
            affected_rows
          }
        }
      `;
      const {
        data: deleteIngredientData,
        error: deleteIngredientError,
        status: deleteIngredientStatus,
      }: { data: any; error: any; status: any } = await useAsyncQuery({
        query,
        variables: {
          filter: {
            recipe_id: {
              _eq: recipe_id,
            },
          },
        },
      });
      if (deleteIngredientStatus.value === "success") {
        // console.log("deleted", deleteIngredientData);
      }
      query = gql`
        mutation DeleteRecipeSteps($filter: step_bool_exp!) {
          delete_step(where: $filter) {
            affected_rows
          }
        }
      `;
      const {
        data: deleteStepData,
        error: deleteStepError,
        status: deleteStepStatus,
      }: { data: any; error: any; status: any } = await useAsyncQuery({
        query,
        variables: {
          filter: {
            recipe_id: {
              _eq: recipe_id,
            },
          },
        },
      });
      if (deleteStepStatus.value === "success") {
        // console.log("deleted", deleteStepData);
      }
      query = gql`
        mutation DeleteRecipeCategories($filter: recipe_category_bool_exp!) {
          delete_recipe_category(where: $filter) {
            affected_rows
          }
        }
      `;
      const {
        data: deleteCategoryData,
        error: deleteCategoryError,
        status: deleteCategoryStatus,
      }: { data: any; error: any; status: any } = await useAsyncQuery({
        query,
        variables: {
          filter: {
            recipe_id: {
              _eq: recipe_id,
            },
          },
        },
      });
      if (deleteCategoryStatus.value === "success") {
        // console.log("deleted category", deleteCategoryDatar);
      }

      query = gql`
        mutation UpdateRecipe($recipe: recipe_set_input!, $id: uuid!) {
          update_recipe_by_pk(pk_columns: { id: $id }, _set: $recipe) {
            id
          }
        }
      `;
      const {
        data: updateData,
        error: updateError,
        status: updateStatus,
      }: { data: any; error: any; status: any } = await useAsyncQuery({
        query: query,
        variables: {
          recipe: {
            title: recipe.title,
            description: recipe.description,
            prep_time: recipe.prep_time,
          },
          id: recipe_id,
        },
      });
      if (updateStatus.value === "success") {
        // console.log("update", updateData, updateError, updateStatus);

        query = gql`
          mutation InsertRecipeIngredients(
            $ingredients: [ingredient_insert_input!]!
          ) {
            insert_ingredient(objects: $ingredients) {
              affected_rows
            }
          }
        `;
        const {
          data: ingredientData,
          error: ingredientError,
          status: ingredientStatus,
        }: { data: any; error: any; status: any } = await useAsyncQuery({
          query,
          variables: {
            ingredients: recipe.ingredients.map((ingredient: any) => {
              return {
                name: ingredient.ingredient_name,
                quantity: ingredient.amount,
                unit: ingredient.unit,
                recipe_id: recipe_id,
              };
            }),
          },
        });
        if (ingredientStatus.value === "success") {
          // console.log(
          //   "ingredient",
          //   ingredientData,
          //   ingredientError,
          //   ingredientStatus
          // );
        }
        query = gql`
          mutation InsertRecipeSteps($steps: [step_insert_input!]!) {
            insert_step(objects: $steps) {
              affected_rows
            }
          }
        `;
        const {
          data: stepData,
          error: stepError,
          status: stepStatus,
        }: { data: any; error: any; status: any } = await useAsyncQuery({
          query,
          variables: {
            steps: recipe.steps.map((step: any, index: number) => {
              return {
                description: step.description,
                number: index + 1,
                recipe_id: recipe_id,
              };
            }),
          },
        });
        if (stepStatus.value === "success") {
          // console.log("step", stepData, stepError, stepStatus);
        }
        query = gql`
          mutation InsertRecipeCategories(
            $categories: [recipe_category_insert_input!]!
          ) {
            insert_recipe_category(objects: $categories) {
              affected_rows
            }
          }
        `;
        const {
          data: categoryData,
          error: categoryError,
          status: categoryStatus,
        }: { data: any; error: any; status: any } = await useAsyncQuery({
          query,
          variables: {
            categories: recipe.categories.map((category: any) => {
              return {
                category: category.category,
                recipe_id: recipe_id,
              };
            }),
          },
        });
        if (categoryStatus.value === "success") {
          // console.log("category", categoryData, categoryError, categoryStatus);
        }
        query = gql`
          mutation InsertRecipeImages($images: [images_insert_input!]!) {
            insert_images(objects: $images) {
              affected_rows
            }
          }
        `;
        // console.log("old", oldImages);
        const {
          data: imageData,
          error: imageError,
          status: imageStatus,
        }: { data: any; error: any; status: any } = await useAsyncQuery({
          query,
          variables: {
            images: oldImages.map((image: any) => {
              if (image === thumbnail) {
                return {
                  image_url: image,
                  is_thumbnail: true,
                  recipe_id: recipe_id,
                };
              }
              return {
                image_url: image,
                is_thumbnail: false,
                recipe_id: recipe_id,
              };
            }),
          },
        });
        if (imageStatus.value === "success") {
          // console.log("image", imageData, imageError, imageStatus);
        }
        loading.value = false;

        return { success: true };
      } else {
        loading.value = false;
        return { error: "Error updating recipe" };
      }
    },

    likeRecipe: async (recipe_id: String, user_id: String) => {
      const query = gql`
        mutation ($recipe_id: uuid!, $user_id: uuid!) {
          insert_like_one(
            object: { recipe_id: $recipe_id, user_id: $user_id }
          ) {
            id
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query: query,
          variables: {
            recipe_id,
            user_id,
          },
        });
      console.log("like", data, error, status);
      if (status.value === "success") {
        return { success: true };
      } else {
        return { error: "Error liking recipe" };
      }
    },
    unlikeRecipe: async (like_id: String) => {
      const query = gql`
        mutation ($id: uuid!) {
          delete_like_by_pk(id: $id) {
            id
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query: query,
          variables: {
            id: like_id,
          },
        });
      console.log("unlike", data, error, status);
      if (status.value === "success") {
        return { success: true };
      } else {
        return { error: "Error unliking recipe" };
      }
    },

    bookmarkRecipe: async (recipe_id: String, user_id: String) => {
      const query = gql`
        mutation ($user_id: uuid!, $recipe_id: uuid!) {
          insert_bookmark_one(
            object: { user_id: $user_id, recipe_id: $recipe_id }
          ) {
            id
            recipe_id
            user_id
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query: query,
          variables: {
            recipe_id,
            user_id,
          },
        });
      console.log("bookmark", data, error, status);
      if (status.value === "success") {
        return { success: true };
      } else {
        return { error: "Error bookmarking recipe" };
      }
    },
    unbookmarkRecipe: async (bookmark_id: String) => {
      const query = gql`
        mutation ($id: uuid!) {
          delete_bookmark_by_pk(id: $id) {
            id
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query: query,
          variables: {
            id: bookmark_id,
          },
        });
      console.log("unbookmark", data, error, status);
      if (status.value === "success") {
        return { success: true };
      } else {
        return { error: "Error unbookmarking recipe" };
      }
    },
    getBookmarks: async (user_id: String, limit?: number, offset?: number) => {
      loading.value = true;
      const query = gql`
        query ($user_id: uuid!, $limit: Int, $offset: Int) {
          bookmark(
            where: { user_id: { _eq: $user_id } }
            limit: $limit
            offset: $offset
          ) {
            id
            recipe {
              id
              title
              description
              prep_time
              recipe_categories {
                id
                category
              }
              user {
                id
                first_name
                last_name
                username
                profile_image
              }
              images(order_by: { is_thumbnail: desc }) {
                id
                image_url
                is_thumbnail
              }
              ingredients {
                id
                name
                quantity
                unit
              }
              steps(order_by: { number: asc }) {
                id
                description
                number
              }
              likes {
                id
                user_id
                recipe_id
              }
              ratings {
                id
                value
                comment
                user {
                  id
                  first_name
                  last_name
                  profile_image
                }
              }
            }
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query: query,
          variables: {
            user_id,
            limit,
            offset,
          },
          cache: true,
        });
      if (status.value === "success") {
        loading.value = false;
        return { bookmarks: data.value!.bookmark };
      } else {
        loading.value = false;
        return { error: "Error getting bookmarks" };
      }
    },
    rateRecipe: async (
      recipe_id: String,
      user_id: String,
      value: number,
      comment: String
    ) => {
      loading.value = true;
      const query = gql`
        mutation ($rate: rating_insert_input!) {
          insert_rating_one(object: $rate) {
            id
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query: query,
          variables: {
            rate: {
              user_id,
              value,
              comment,
              recipe_id,
            },
          },
        });
      console.log("rate", data, error, status);
      if (status.value === "success") {
        loading.value = false;
        return { success: true };
      } else {
        loading.value = false;
        return { error: "Error rating recipe" };
      }
    },
    getUserRecipes: async (user_id: String) => {
      loading.value = true;
      const query = gql`
        query GetUserRecipes($filter: recipe_bool_exp!) {
          recipe(where: $filter) {
            id
            title
            description
            prep_time
            recipe_categories {
              id
              category
            }
            user {
              id
              first_name
              last_name
              username
              profile_image
            }
            images(order_by: { is_thumbnail: desc }) {
              id
              image_url
              is_thumbnail
            }
            ingredients {
              id
              name
              quantity
              unit
            }
            steps(order_by: { number: asc }) {
              id
              description
              number
            }
            likes {
              id
              user_id
              recipe_id
            }
            ratings {
              id
              value
              comment
              user {
                id
                first_name
                last_name
                profile_image
              }
            }
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query,
          variables: {
            filter: { user_id: { _eq: user_id } },
          },
          cache: true,
        });
      if (status.value === "success") {
        loading.value = false;
        return { recipes: data.value!.recipe };
      }
      loading.value = false;
      return { error: "Error fetching user recipes" };
    },
    recipes,
    loading,
    filteredCategories,
    totalRecipeCount,
  };
}
