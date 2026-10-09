import bcrypt from "bcrypt";
import { apiRequest, demoIdentity, getDemoConfig, getDemoSession, type DemoAuction } from "./seedAuctions.js";

// Stable, increasing bids by distinct bidders; never reset existing history.
export function activityPlan(index: number, startingPrice: number) {
  let amount = startingPrice;
  return Array.from({ length: 1 + index % 4 }, (_, bidIndex) => {
    amount = Math.round((amount + 5 + bidIndex * 5) * 100) / 100;
    return { bidderIndex: (index + bidIndex) % 4, amount };
  });
}

async function main() {
  const config = getDemoConfig();
  let bidsCreated = 0;
  let favouritesCreated = 0;
  if (config.apiUrl) {
    const seller = await getDemoSession(config);
    const listings = await apiRequest<DemoAuction[]>(config, "/api/auctions/mine", { headers: seller.headers });
    const auctions = listings.filter((auction) =>
      auction.sellerId === seller.id && new Date(auction.endsAt).getTime() > Date.now() &&
      auction.description.startsWith(`[DEMO:${config.key}]`)
    ).sort((a, b) => a.id - b.id);
    if (!auctions.length) throw new Error("No active demo auctions found. Run seed:auctions first.");
    const sessions = [];
    for (let index = 1; index <= 4; index++) sessions.push(await getDemoSession(config, index));
    const favourites = await Promise.all(sessions.map(async (session) => {
      const items = await apiRequest<DemoAuction[]>(config, "/api/favourites", { headers: session.headers });
      return new Set(items.map((auction) => auction.id));
    }));
    for (const [index, auction] of auctions.entries()) {
      if (auction.bids === 0 && auction.currentBid === auction.startingPrice) {
        for (const bid of activityPlan(index, auction.startingPrice)) {
          await apiRequest(config, `/api/bids/auctions/${auction.id}`, {
            method: "POST", headers: sessions[bid.bidderIndex]!.headers,
            body: JSON.stringify({ amount: bid.amount }),
          });
          // The existing API creates notifications and broadcasts real-time events.
          bidsCreated++;
        }
      }
      for (const bidderIndex of [index % 4, (index + 1) % 4]) {
        if (favourites[bidderIndex]!.has(auction.id)) continue;
        await apiRequest(config, `/api/favourites/${auction.id}`, {
          method: "POST", headers: sessions[bidderIndex]!.headers,
        });
        favourites[bidderIndex]!.add(auction.id);
        favouritesCreated++;
      }
      if ((index + 1) % 10 === 0) console.log(`Processed ${index + 1}/${auctions.length} demo auctions...`);
    }
  } else {
    const { prisma } = await import("../lib/prisma.js");
    try {
      const seller = await prisma.user.findUnique({ where: { email: demoIdentity(config).email } });
      if (!seller || !await bcrypt.compare(config.password, seller.password)) {
        throw new Error("Demo seller missing or seed password does not match. Run seed:auctions first.");
      }
      const auctions = await prisma.auction.findMany({
        where: { sellerId: seller.id, description: { startsWith: `[DEMO:${config.key}]` }, endsAt: { gt: new Date() } },
        orderBy: { id: "asc" },
      });
      if (!auctions.length) throw new Error("No active demo auctions found.");
      const users: { id: number }[] = [];
      for (let index = 1; index <= 4; index++) {
        const identity = demoIdentity(config, index);
        const user = await prisma.user.upsert({
          where: { email: identity.email }, update: {},
          create: { ...identity, password: await bcrypt.hash(config.password, 10) },
        });
        if (!await bcrypt.compare(config.password, user.password)) throw new Error("Demo bidder seed password does not match.");
        users.push(user);
      }
      for (const [index, auction] of auctions.entries()) {
        const plan = activityPlan(index, auction.startingPrice);
        bidsCreated += await prisma.$transaction(async (tx) => {
          // A conditional write protects any auction receiving a real bid during seeding.
          const eligible = await tx.auction.updateMany({
            where: { id: auction.id, sellerId: seller.id, bids: 0, currentBid: auction.startingPrice, endsAt: { gt: new Date() } },
            data: { currentBid: plan.at(-1)!.amount, bids: plan.length },
          });
          if (!eligible.count) return 0;
          for (const [bidIndex, bid] of plan.entries()) {
            await tx.bid.create({ data: { userId: users[bid.bidderIndex]!.id, auctionId: auction.id, amount: bid.amount } });
            await tx.notification.create({ data: {
              userId: seller.id, type: "NEW_BID", auctionId: auction.id,
              message: `Your auction "${auction.title}" received a new bid of €${bid.amount}.`,
            } });
            if (bidIndex > 0) {
              await tx.notification.create({ data: {
                userId: users[plan[bidIndex - 1]!.bidderIndex]!.id, type: "OUTBID", auctionId: auction.id,
                message: `You have been outbid on "${auction.title}". Current bid is €${bid.amount}.`,
              } });
            }
          }
          return plan.length;
        });
        for (const bidderIndex of [index % 4, (index + 1) % 4]) {
          const result = await prisma.favourite.createMany({
            data: [{ userId: users[bidderIndex]!.id, auctionId: auction.id }], skipDuplicates: true,
          });
          favouritesCreated += result.count;
        }
      }
    } finally { await prisma.$disconnect(); }
  }
  console.log(`Created ${bidsCreated} bids and ${favouritesCreated} favourites. Existing bids and listings left unchanged.`);
}

if (require.main === module) {
  main().catch((error) => { console.error("DEMO ACTIVITY SEED ERROR:", error.message); process.exitCode = 1; });
}
