import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup.string().trim().required(),
  password: yup.string().min(8).required(),
});

export const registerSchema = yup.object().shape({
  first_name: yup
    .string()
    .trim()
    .required("First name is required")
    .matches(/^[a-zA-Z]+$/, "First name can only contain letters"),
  last_name: yup
    .string()
    .trim()
    .required("Last name is required")
    .matches(/^[a-zA-Z]+$/, "Last name can only contain letters"),
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    ),
  email: yup.string().trim().email().required("Email is required"),
  password: yup.string().min(8).required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
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
