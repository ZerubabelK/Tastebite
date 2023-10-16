interface Error {
  field: string;
  message: string;
}
interface ValidationFields {
  ingredients?: any;
  instructions?: any;
  categories?: any;
  images?: any;
  ingredient_name?: any;
  ingredient_quantity?: any;
  ingredient_unit?: any;
  instruction_description?: any;
  category_name?: any;
}
export default function () {
  const errors = ref<Error[]>([]);

  return {
    errors,
    validate(fields: ValidationFields) {
      console.log(fields);
      if (fields.categories && fields.categories.length === 0) {
        if (
          errors.value.filter((error) => error.field === "categories")
            .length === 0
        ) {
          errors.value.push({
            field: "categories",
            message: "Please select at least one category",
          });
        }
      }
      if (fields.categories && fields.categories.length > 0) {
        errors.value = errors.value.filter(
          (error) => error.field !== "categories"
        );
      }
      if (fields.ingredients && fields.ingredients.length === 0) {
        if (
          errors.value.filter((error) => error.field === "ingredients")
            .length === 0
        )
          errors.value.push({
            field: "ingredients",
            message: "Please add at least one ingredient",
          });
      }
      if (fields.ingredients && fields.ingredients.length > 0) {
        errors.value = errors.value.filter(
          (error) => error.field !== "ingredients"
        );
      }
      if (fields.instructions && fields.instructions.length === 0) {
        if (
          errors.value.filter((error) => error.field === "instructions")
            .length === 0
        )
          errors.value.push({
            field: "instructions",
            message: "Please add at least one instruction",
          });
      }
      if (fields.instructions && fields.instructions.length > 0) {
        errors.value = errors.value.filter(
          (error) => error.field !== "instructions"
        );
      }
      if (fields.images && fields.images.length === 0) {
        if (
          errors.value.filter((error) => error.field === "images").length === 0
        )
          errors.value.push({
            field: "images",
            message: "Please add at least one image",
          });
      }
      if (fields.images && fields.images.length > 0) {
        errors.value = errors.value.filter((error) => error.field !== "images");
      }
      if (
        fields.ingredient_name &&
        !fields.ingredient_name.match(/^[a-zA-Z]+$/)
      ) {
        if (
          errors.value.filter((error) => error.field === "ingredient_name")
            .length === 0
        )
          errors.value.push({
            field: "ingredient_name",
            message: "Ingredient name must be a string",
          });
      }
      if (
        fields.ingredient_name &&
        fields.ingredient_name.match(/^[a-zA-Z]+$/)
      ) {
        errors.value = errors.value.filter(
          (error) => error.field !== "ingredient_name"
        );
      }
      if (fields.amount && !fields.amount.match(/^[0-9]+$/)) {
        if (
          errors.value.filter((error) => error.field === "ingredient_quantity")
            .length === 0
        )
          errors.value.push({
            field: "ingredient_quantity",
            message: "Amount must be a number",
          });
      }
      if (fields.amount && fields.amount.match(/^[0-9]+$/)) {
        errors.value = errors.value.filter(
          (error) => error.field !== "ingredient_quantity"
        );
      }
      if (fields.unit && !fields.unit.match(/^[a-zA-Z]+$/)) {
        if (
          errors.value.filter((error) => error.field === "ingredient_unit")
            .length === 0
        )
          errors.value.push({
            field: "ingredient_unit",
            message: "Unit must be a string",
          });
      }
      if (fields.unit && fields.unit.match(/^[a-zA-Z]+$/)) {
        errors.value = errors.value.filter(
          (error) => error.field !== "ingredient_unit"
        );
      }
      console.log(errors);
    },
  };
}
