import { z } from "zod";

export const createAuctionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(80, "Title must be less than 80 characters"),

  category: z.enum([
    "Electronics", "Fashion", "Gaming", "Collectibles", "Art", "Home",
  ]),

  startingPrice: z
    .number()
    .finite()
    .positive("Starting price must be greater than 0"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),

  image: z
    .string()
    .url("Image must be a valid URL")
    .refine((value) => /^https?:\/\//i.test(value), "Image must use HTTP or HTTPS"),

  endsAt: z.iso.datetime({ offset: true })
    .refine((value) => new Date(value).getTime() > Date.now(),
      "Auction end date must be in the future"),
}).strict();

export const updateAuctionSchema = createAuctionSchema.partial()
  .refine((value) => Object.values(value).some((field) => field !== undefined),
    "At least one auction field is required");
