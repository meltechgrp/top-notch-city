import { z } from "zod";

export const validateEmail = z.string().email({
  message: "Enter a valid email address",
});

export const validatePassword = z
  .string()
  .min(8, "Password is too short. Minimum 8 characters required.")
  .max(50, "Password is too long. Maximum 50 characters required.");

export const Name = z.string().min(2, {
  message: "Enter a valid name",
});

export const validatePhone = z.string().min(10, {
  message: "Please enter a valid phone number.",
});
export const AuthLoginSchema = z.object({
  email: validateEmail,
  password: validatePassword,
});
export type AuthLoginInput = z.infer<typeof AuthLoginSchema>;

export const AuthSignupSchema = z.object({
  email: validateEmail,
  password: validatePassword,
  first_name: Name,
  last_name: Name,
  confirmPassword: validatePassword,
});

export type AuthSignupInput = z.infer<typeof AuthSignupSchema>;

export const UpdateUserSchema = z.object({
  email: validateEmail,
  first_name: Name,
  last_name: Name,
  phone: validatePhone,
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  country_code: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const mediaFileSchema = z.object({
  uri: z.string().url(),
  id: z.string(),
});
