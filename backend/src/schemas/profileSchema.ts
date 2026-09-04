import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .optional(),

  phone: z
    .string()
    .optional(),

  address: z
    .string()
    .optional(),

  city: z
    .string()
    .optional(),

  postalCode: z
    .string()
    .optional(),

  country: z
    .string()
    .optional(),

  bio: z
    .string()
    .max(300, "Bio must be less than 300 characters")
    .optional(),
});