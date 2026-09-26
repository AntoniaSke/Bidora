import bcrypt from "bcrypt";

import { prisma } from "../lib/prisma.js";

async function main() {
  const password =
    await bcrypt.hash(
      "Demo123!",
      10
    );

  const demoUsersData = [
    {
      name: "Alex Carter",
      username: "alex_demo",
      email: "alex@bidora.demo",
    },
    {
      name: "Maria Lee",
      username: "maria_demo",
      email: "maria@bidora.demo",
    },
    {
      name: "Chris Evans",
      username: "chris_demo",
      email: "chris@bidora.demo",
    },
    {
      name: "Sofia Brown",
      username: "sofia_demo",
      email: "sofia@bidora.demo",
    },
  ];

  const users = [];

  for (const userData of demoUsersData) {
    const user =
      await prisma.user.upsert({
        where: {
          email:
            userData.email,
        },

        update: {},

        create: {
          ...userData,
          password,
        },
      });

    users.push(user);
  }

  const demoSeller =
    await prisma.user.findUnique({
      where: {
        email:
          "demo@bidora.com",
      },
    });

  if (!demoSeller) {
    throw new Error(
      "Demo seller not found. Run seed:auctions first."
    );
  }

  const auctions =
    await prisma.auction.findMany({
      where: {
        sellerId:
          demoSeller.id,

        endsAt: {
          gt: new Date(),
        },
      },

      orderBy: {
        id: "asc",
      },
    });

  if (auctions.length === 0) {
    throw new Error(
      "No demo auctions found."
    );
  }

  /*
    Καθαρίζουμε προηγούμενα demo bids
    στα seeded auctions.
  */
  await prisma.bid.deleteMany({
    where: {
      auctionId: {
        in: auctions.map(
          (auction) =>
            auction.id
        ),
      },
    },
  });

  /*
    Reset auction counters.
  */
  for (const auction of auctions) {
    await prisma.auction.update({
      where: {
        id:
          auction.id,
      },

      data: {
        currentBid:
          auction.startingPrice,

        bids: 0,
      },
    });
  }

  /*
    Demo activity patterns.
  */
  const bidPatterns = [
    [20, 45, 80],
    [15, 35],
    [10, 25, 50, 75],
    [30],
    [12, 22, 40],
    [18, 37],
    [25, 55, 90],
    [20, 45],
    [10, 28, 60],
    [15],
    [35, 65],
    [25, 40, 70],
  ];

  for (
    let auctionIndex = 0;
    auctionIndex <
    Math.min(
      auctions.length,
      bidPatterns.length
    );
    auctionIndex++
  ) {
    const auction =
      auctions[auctionIndex];

    const increments =
      bidPatterns[
        auctionIndex
      ];

    let currentBid =
      auction.startingPrice;

    let bidCount = 0;

    for (
      let bidIndex = 0;
      bidIndex <
      increments.length;
      bidIndex++
    ) {
      const user =
        users[
          (auctionIndex +
            bidIndex) %
            users.length
        ];

      currentBid +=
        increments[bidIndex];

      await prisma.bid.create({
        data: {
          amount:
            currentBid,

          userId:
            user.id,

          auctionId:
            auction.id,
        },
      });

      bidCount++;
    }

    await prisma.auction.update({
      where: {
        id:
          auction.id,
      },

      data: {
        currentBid,

        bids:
          bidCount,
      },
    });
  }

  console.log(
    "Demo bidding activity created."
  );

  console.log(
    `${users.length} demo bidders available.`
  );
}

main()
  .catch((error) => {
    console.error(
      "DEMO ACTIVITY SEED ERROR:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });