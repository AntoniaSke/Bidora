import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getFavourites(
  req: Request,
  res: Response
) {
  const userId = req.user!.userId;

  const favourites = await prisma.favourite.findMany({
    where: {
      userId,
    },
    include: {
      auction: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(
    favourites.map((favourite) => favourite.auction)
  );
}

export async function addFavourite(
  req: Request,
  res: Response
) {
  const userId = req.user!.userId;
  const auctionId = Number(req.params.auctionId);

  const auction = await prisma.auction.findUnique({
    where: {
      id: auctionId,
    },
  });

  if (!auction) {
    return res.status(404).json({
      message: "Auction not found",
    });
  }

  const existingFavourite =
    await prisma.favourite.findUnique({
      where: {
        userId_auctionId: {
          userId,
          auctionId,
        },
      },
    });

  if (existingFavourite) {
    return res.status(409).json({
      message: "Auction is already in favourites",
    });
  }

  await prisma.favourite.create({
    data: {
      userId,
      auctionId,
    },
  });

  res.status(201).json({
    message: "Auction added to favourites",
  });
}

export async function removeFavourite(
  req: Request,
  res: Response
) {
  const userId = req.user!.userId;
  const auctionId = Number(req.params.auctionId);

  const favourite =
    await prisma.favourite.findUnique({
      where: {
        userId_auctionId: {
          userId,
          auctionId,
        },
      },
    });

  if (!favourite) {
    return res.status(404).json({
      message: "Favourite not found",
    });
  }

  await prisma.favourite.delete({
    where: {
      userId_auctionId: {
        userId,
        auctionId,
      },
    },
  });

  res.status(200).json({
    message: "Auction removed from favourites",
  });
}