import { prisma } from "../lib/prisma.js";

export async function processEndedAuctions() {
  const now = new Date();

  try {
    /*
      Βρίσκουμε auctions που έχουν λήξει
      και έχουν τουλάχιστον ένα bid.
    */
    const endedAuctions =
      await prisma.auction.findMany({
        where: {
          endsAt: {
            lte: now,
          },

          bids: {
            gt: 0,
          },
        },

        select: {
          id: true,
          title: true,
          sellerId: true,
          currentBid: true,
        },
      });

    for (const auction of endedAuctions) {
      /*
        Highest bid = winner.
      */
      const winningBid =
        await prisma.bid.findFirst({
          where: {
            auctionId:
              auction.id,
          },

          orderBy: [
            {
              amount: "desc",
            },
            {
              createdAt: "asc",
            },
          ],

          select: {
            userId: true,
            amount: true,

            user: {
              select: {
                username: true,
              },
            },
          },
        });

      if (!winningBid) {
        continue;
      }

      /*
        Winner notification.
      */
      await prisma.notification.upsert({
        where: {
          dedupeKey:
            `winner-auction-${auction.id}`,
        },

        update: {},

        create: {
          userId:
            winningBid.userId,

          type:
            "WON",

          message:
            `You won "${auction.title}" for €${winningBid.amount}.`,

          auctionId:
            auction.id,

          dedupeKey:
            `winner-auction-${auction.id}`,
        },
      });

      /*
        Seller notification.
      */
      await prisma.notification.upsert({
        where: {
          dedupeKey:
            `seller-sold-auction-${auction.id}`,
        },

        update: {},

        create: {
          userId:
            auction.sellerId,

          type:
            "AUCTION_SOLD",

          message:
            `Your auction "${auction.title}" was sold to ${winningBid.user.username} for €${winningBid.amount}.`,

          auctionId:
            auction.id,

          dedupeKey:
            `seller-sold-auction-${auction.id}`,
        },
      });
    }
  } catch (error) {
    console.error(
      "PROCESS ENDED AUCTIONS ERROR:",
      error
    );
  }
}