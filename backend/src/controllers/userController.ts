import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { updateProfileSchema } from "../schemas/profileSchema.js";

export async function updateProfile(req: Request, res: Response) {
  const result = updateProfileSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid profile data",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const userId = req.user!.userId;

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: result.data,
  });

  res.status(200).json({
    id: updatedUser.id,
    name: updatedUser.name,
    username: updatedUser.username,
    email: updatedUser.email,
    phone: updatedUser.phone,
    address: updatedUser.address,
    city: updatedUser.city,
    postalCode: updatedUser.postalCode,
    country: updatedUser.country,
    bio: updatedUser.bio,
  });
}