import { z } from "zod";

export const createBidSchema = z.object({
  amount: z
    .number()
    .positive("Bid amount must be greater than 0"),
});