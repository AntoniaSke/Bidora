import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";
import { getSocketServer } from "../lib/socket.js";
import { createBidSchema } from "../schemas/bidSchema.js";

export async function placeBid(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.userId;
    const auctionId = Number(req.params.id);

    if (Number.isNaN(auctionId)) {
      return res.status(400).json({
        message: "Invalid auction id",
      });
    }

    const parsed =
      createBidSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message:
          parsed.error.issues[0]?.message ||
          "Invalid bid",
      });
    }

    const { amount } = parsed.data;

    /*
      Initial auction check.
    */
    const auction =
      await prisma.auction.findUnique({
        where: {
          id: auctionId,
        },
      });

    if (!auction) {
      return res.status(404).json({
        message: "Auction not found",
      });
    }

    if (auction.sellerId === userId) {
      return res.status(403).json({
        message:
          "You cannot bid on your own auction",
      });
    }

    if (auction.endsAt <= new Date()) {
      return res.status(400).json({
        message:
          "This auction has ended",
      });
    }

    if (amount <= auction.currentBid) {
      return res.status(400).json({
        message:
          `Bid must be higher than €${auction.currentBid}`,
      });
    }

    const now = new Date();

    /*
      BID + NOTIFICATIONS
      μέσα στο ίδιο transaction.
    */
    const result =
      await prisma.$transaction(
        async (tx) => {
          /*
            Update auction only if this bid
            is still higher than the current bid
            and the auction is still active.
          */
          const updateResult =
            await tx.auction.updateMany({
              where: {
                id: auctionId,

                currentBid: {
                  lt: amount,
                },

                endsAt: {
                  gt: now,
                },
              },

              data: {
                currentBid: amount,

                bids: {
                  increment: 1,
                },
              },
            });

          /*
            Another request may have won
            the race before this one.
          */
          if (updateResult.count === 0) {
            return null;
          }

          /*
            Find the previous highest bidder.

            We do this after the successful
            conditional update, but search
            for the highest bid below the new amount.
          */
          const previousHighestBid =
            await tx.bid.findFirst({
              where: {
                auctionId,

                amount: {
                  lt: amount,
                },
              },

              orderBy: [
                {
                  amount: "desc",
                },
                {
                  createdAt: "desc",
                },
              ],

              select: {
                userId: true,
                amount: true,
              },
            });

          /*
            Create the actual bid.
          */
          const bid =
            await tx.bid.create({
              data: {
                amount,
                userId,
                auctionId,
              },

              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            });

          /*
            Notification 1:
            seller received a new bid.
          */
          await tx.notification.create({
            data: {
              userId:
                auction.sellerId,

              type:
                "NEW_BID",

              message:
                `Your auction "${auction.title}" received a new bid of €${amount}.`,

              auctionId,
            },
          });

          /*
            Notification 2:
            previous highest bidder
            has been outbid.

            No notification on the first bid
            because previousHighestBid is null.

            Also don't notify the same user
            if they somehow raise their own bid.
          */
          if (
            previousHighestBid &&
            previousHighestBid.userId !==
              userId
          ) {
            await tx.notification.create({
              data: {
                userId:
                  previousHighestBid.userId,

                type:
                  "OUTBID",

                message:
                  `You have been outbid on "${auction.title}". Current bid is €${amount}.`,

                auctionId,
              },
            });
          }

          /*
            Read final auction state.
          */
          const updatedAuction =
            await tx.auction.findUnique({
              where: {
                id: auctionId,
              },
            });

          if (!updatedAuction) {
            throw new Error(
              "Auction disappeared during bid transaction"
            );
          }

          return {
            bid,
            auction:
              updatedAuction,
          };
        }
      );

    /*
      Conditional update failed.
    */
    if (!result) {
      const latestAuction =
        await prisma.auction.findUnique({
          where: {
            id: auctionId,
          },
        });

      if (!latestAuction) {
        return res.status(404).json({
          message:
            "Auction not found",
        });
      }

      if (
        latestAuction.endsAt <=
        new Date()
      ) {
        return res.status(400).json({
          message:
            "This auction has ended",
        });
      }

      return res.status(400).json({
        message:
          `Another bid was placed first. Current bid is €${latestAuction.currentBid}`,
      });
    }

    /*
      Existing realtime bid update.
    */
    const payload = {
      auctionId,

      currentBid:
        result.auction.currentBid,

      bids:
        result.auction.bids,

      bid: {
        id:
          result.bid.id,

        amount:
          result.bid.amount,

        createdAt:
          result.bid.createdAt,

        user: {
          id:
            result.bid.user.id,

          username:
            result.bid.user.username,
        },
      },
    };

    const io =
      getSocketServer();

    io.emit(
      "bid-placed",
      payload
    );

    return res.status(201).json({
      bid:
        result.bid,

      auction:
        result.auction,
    });
  } catch (error) {
    console.error(
      "PLACE BID ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Could not place bid",
    });
  }
}


export async function getMyBids(
    req: Request,
    res: Response
) {
    try {
        const userId =
            req.user!.userId;

        const bids =
            await prisma.bid.findMany({
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

        return res
            .status(200)
            .json(bids);
    } catch (error) {
        console.error(
            "GET MY BIDS ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Could not load your bids",
        });
    }
}

export async function getAuctionBids(
    req: Request,
    res: Response
) {
    try {
        const auctionId =
            Number(req.params.id);

        if (
            Number.isNaN(auctionId)
        ) {
            return res.status(400).json({
                message:
                    "Invalid auction id",
            });
        }

        const auction =
            await prisma.auction.findUnique({
                where: {
                    id: auctionId,
                },

                select: {
                    id: true,
                },
            });

        if (!auction) {
            return res.status(404).json({
                message:
                    "Auction not found",
            });
        }

        const bids =
            await prisma.bid.findMany({
                where: {
                    auctionId,
                },

                orderBy: {
                    createdAt: "desc",
                },

                select: {
                    id: true,
                    amount: true,
                    createdAt: true,

                    user: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            });

        return res
            .status(200)
            .json(bids);
    } catch (error) {
        console.error(
            "GET AUCTION BIDS ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Could not load bid history",
        });
    }
}