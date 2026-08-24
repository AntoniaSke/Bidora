import { z } from "zod";

export const createAuctionSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(80, "Title must be less than 80 characters"),

  category: z
    .string()
    .min(1, "Category is required"),

  startingPrice: z
    .number()
    .positive("Starting price must be greater than 0"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  image: z
    .string()
    .min(1, "Image is required"),

  endsAt: z
    .string()
    .min(1, "Auction end date is required"),
});