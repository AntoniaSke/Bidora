import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { createAuctionSchema } from "../schemas/auctionSchema.js";

export async function getAuctions(
  req: Request,
  res: Response
) {
  try {
    const auctions = await prisma.auction.findMany({
      where: {
        endsAt: {
          gt: new Date(),
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(auctions);
  } catch (error) {
    console.error("GET AUCTIONS ERROR:", error);

    return res.status(500).json({
      message: "Could not load auctions",
    });
  }
}

export async function getAuctionById(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid auction id",
      });
    }

    const auction = await prisma.auction.findUnique({
      where: {
        id,
      },

      include: {
        seller: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!auction) {
      return res.status(404).json({
        message: "Auction not found",
      });
    }

    const hasEnded =
      auction.endsAt <= new Date();

    let winner = null;

    if (hasEnded && auction.bids > 0) {
      const winningBid =
        await prisma.bid.findFirst({
          where: {
            auctionId: auction.id,
          },

          orderBy: {
            amount: "desc",
          },

          select: {
            amount: true,

            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        });

      if (winningBid) {
        winner = {
          userId: winningBid.user.id,
          username: winningBid.user.username,
          amount: winningBid.amount,
        };
      }
    }

    return res.status(200).json({
      ...auction,
      hasEnded,
      winner,
    });
  } catch (error) {
    console.error(
      "GET AUCTION ERROR:",
      error
    );

    return res.status(500).json({
      message: "Could not load auction",
    });
  }
}

export async function createAuction(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.userId;

    const {
      title,
      description,
      category,
      startingPrice,
      image,
      endsAt,
    } = req.body;

    const auction = await prisma.auction.create({
      data: {
        title,
        description,
        category,
        startingPrice: Number(startingPrice),
        currentBid: Number(startingPrice),
        image,
        endsAt: new Date(endsAt),

        seller: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res.status(201).json(auction);
  } catch (error) {
    console.error("CREATE AUCTION ERROR:", error);

    return res.status(500).json({
      message: "Could not create auction",
    });
  }
}

export async function getMyAuctions(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.userId;

    const auctions = await prisma.auction.findMany({
      where: {
        sellerId: userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const auctionsWithWinner = await Promise.all(
      auctions.map(async (auction) => {
        const hasEnded =
          auction.endsAt <= new Date();

        let winner = null;

        if (hasEnded && auction.bids > 0) {
          const winningBid =
            await prisma.bid.findFirst({
              where: {
                auctionId: auction.id,
              },

              orderBy: {
                amount: "desc",
              },

              select: {
                amount: true,

                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            });

          if (winningBid) {
            winner = {
              userId: winningBid.user.id,
              username: winningBid.user.username,
              amount: winningBid.amount,
            };
          }
        }

        return {
          ...auction,
          hasEnded,
          winner,
        };
      })
    );

    return res.status(200).json(
      auctionsWithWinner
    );
  } catch (error) {
    console.error(
      "Failed to fetch user auctions:",
      error
    );

    return res.status(500).json({
      message: "Could not load your auctions",
    });
  }
}

export async function updateAuction(
  req: Request,
  res: Response
) {
  try {
    const auctionId = Number(req.params.id);
    const userId = req.user!.userId;

    const existingAuction =
      await prisma.auction.findUnique({
        where: {
          id: auctionId,
        },
      });

    if (!existingAuction) {
      return res.status(404).json({
        message: "Auction not found",
      });
    }

    if (existingAuction.sellerId !== userId) {
      return res.status(403).json({
        message: "You cannot edit this auction",
      });
    }


    if (existingAuction.endsAt <= new Date()) {
      return res.status(400).json({
        message: "Ended auctions cannot be edited",
      });
    }

    const {
      title,
      description,
      category,
      startingPrice,
      endsAt,
      image,
    } = req.body;

    const newStartingPrice =
      startingPrice !== undefined
        ? Number(startingPrice)
        : existingAuction.startingPrice;

    // Δεν επιτρέπουμε αλλαγή τιμής αν έχουν ήδη γίνει bids
    if (
      existingAuction.bids > 0 &&
      newStartingPrice !== existingAuction.startingPrice
    ) {
      return res.status(400).json({
        message:
          "Starting price cannot be changed after bidding has started",
      });
    }

    const updatedAuction =
      await prisma.auction.update({
        where: {
          id: auctionId,
        },

        data: {
          title,
          description,
          category,
          image,

          startingPrice:
            newStartingPrice,

          currentBid:
            newStartingPrice,

          ...(endsAt && {
            endsAt:
              new Date(endsAt),
          }),
        },
      });

    return res.status(200).json(updatedAuction);
  } catch (error) {
    console.error("UPDATE AUCTION ERROR:", error);

    return res.status(500).json({
      message: "Could not update auction",
    });
  }
}


export async function deleteAuction(
  req: Request,
  res: Response
) {
  try {
    const auctionId = Number(req.params.id);
    const userId = req.user!.userId;

    if (Number.isNaN(auctionId)) {
      return res.status(400).json({
        message: "Invalid auction id",
      });
    }

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

    if (auction.sellerId !== userId) {
      return res.status(403).json({
        message: "You cannot delete this auction",
      });
    }

    if (auction.bids > 0) {
      return res.status(400).json({
        message:
          "Auction cannot be deleted after the first bid",
      });
    }

    if (auction.endsAt <= new Date()) {
      return res.status(400).json({
        message:
          "Ended auctions cannot be deleted",
      });
    }

    await prisma.auction.delete({
      where: {
        id: auctionId,
      },
    });

    return res.status(200).json({
      message:
        "Auction deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE AUCTION ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Could not delete auction",
    });
  }
}