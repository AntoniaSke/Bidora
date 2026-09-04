import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { createAuctionSchema } from "../schemas/auctionSchema.js";

export async function getAuctions(req: Request, res: Response) {
  const auctions = await prisma.auction.findMany();

  res.json(auctions);
}

export async function getAuctionById(req: Request, res: Response) {
  const id = Number(req.params.id);

  const auction = await prisma.auction.findUnique({
    where: { id },
  });

  if (!auction) {
    return res.status(404).json({
      message: "Auction not found",
    });
  }

  res.json(auction);
}

export async function createAuction(req: Request, res: Response) {
  const result = createAuctionSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid auction data",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const {
    title,
    category,
    startingPrice,
    description,
    image,
    endsAt,
  } = result.data;

  const newAuction = await prisma.auction.create({
    data: {
      title,
      category,
      startingPrice,
      currentBid: startingPrice,
      bids: 0,
      seller: "demo_user",
      description,
      image,
      endsAt: new Date(endsAt),
    },
  });

  res.status(201).json(newAuction);
}