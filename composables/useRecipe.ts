export default function () {
  const recipes = ref<any[]>([]);
  const loading = ref(false);
  const filteredCategories = ref([]);

  return {
    fetchRecipes: async (limit?: number) => {
      loading.value = true;
      const query = gql`
        query GetRecipes($limit: Int) {
          recipe(order_by: { created_at: desc }, limit: $limit) {
            id
            title
            description
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
            bookmarks {
              id
              user_id
              recipe_id
            }
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query,
          variables: {
            limit,
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
            bookmarks {
              id
              user_id
              recipe_id
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
      // console.log("recipe", data, error);
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

    searchRecipes: async (search: string) => {
      loading.value = true;
      const query = gql`
        query SearchRecipe($filter: recipe_bool_exp) {
          recipe(where: $filter) {
            id
            title
            description
            image
            user {
              id
              first_name
              last_name
              username
              profile_image
            }
          }
        }
      `;
      const { data, error, status }: { data: any; error: any; status: any } =
        await useAsyncQuery({
          query,
          variables: {
            search: `%${search}%`,
          },
          cache: true,
        });
      if (status.value === "success") {
        recipes.value = data.value!.recipe;
      }
      loading.value = false;
    },
    fetchCategories: async (search: String) => {
      const query = gql`
        query GetCategories($filter: category_bool_exp!) {
          category(where: $filter) {
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
        filteredCategories.value = data.value!.category;
      }
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
      console.log("images", data, error, status);
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
    getBookmarks: async (user_id: String) => {
      loading.value = true;
      const query = gql`
        query ($user_id: uuid!) {
          bookmark(where: { user_id: { _eq: $user_id } }) {
            id
            recipe {
              id
              title
              description
              user {
                id
                first_name
                last_name
                username
                profile_image
              }
              images {
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
              bookmarks {
                id
                user_id
                recipe_id
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
          },
          cache: true,
        });
      console.log("bookmarks", data, error, status);
      if (status.value === "success") {
        loading.value = false;
        return { bookmarks: data.value!.bookmark };
      } else {
        loading.value = false;
        return { error: "Error getting bookmarks" };
      }
    },
    recipes,
    loading,
    filteredCategories,
  };
}
