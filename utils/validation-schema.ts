import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().trim().email().required(),
  password: yup.string().min(8).required(),
});

export const registerSchema = yup.object().shape({
  first_name: yup.string().trim().required(),
  last_name: yup.string().trim().required(),
  username: yup.string().trim().required(),
  email: yup.string().trim().email().required(),
  password: yup.string().min(8).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export const createRecipeSchema = yup.object().shape({
  title: yup.string().trim().required("Title is required"),
  description: yup.string().trim().required("Description is required"),
  prep_time: yup.number().required("Preparation time is required"),
  categories: yup.array().of(yup.string().required("Category is required")),
  ingredients: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().trim().required("Ingredient name is required"),
        quantity: yup.number().required("Quantity is required"),
        unit: yup.string().trim().required("Unit is required"),
      })
    )
    .required("Ingredients are required"),
  instructions: yup
    .array()
    .of(
      yup.object().shape({
        description: yup
          .string()
          .trim()
          .required("Instruction description is required"),
      })
    )
    .required("Instructions are required"),
});
