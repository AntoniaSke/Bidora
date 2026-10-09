import "dotenv/config";
import bcrypt from "bcrypt";
import { createAuctionSchema } from "../schemas/auctionSchema.js";

// These helpers are also used by the existing activity script.
export type DemoConfig = { apiUrl?: string; password: string; key: string };
export type DemoAuction = { id: number; title: string; description: string; category: string; startingPrice: number; currentBid: number; bids: number; sellerId: number; endsAt: string | Date };

export function getDemoConfig(): DemoConfig {
  const password = process.env.DEMO_SEED_PASSWORD;
  const key = process.env.DEMO_SEED_KEY ?? "catalogue_v3";
  if (!password || password.length < 12) throw new Error("Set DEMO_SEED_PASSWORD to a unique password of at least 12 characters.");
  if (!/^[a-z0-9_]{1,12}$/.test(key)) throw new Error("DEMO_SEED_KEY must contain 1–12 lowercase letters, digits or underscores.");
  const apiUrl = process.env.DEMO_API_URL?.replace(/\/$/, "");
  if (apiUrl) {
    const url = new URL(apiUrl);
    if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) {
      throw new Error("Use HTTPS for a remote demo API.");
    }
  } else if (!process.env.DATABASE_URL) {
    throw new Error("Set DEMO_API_URL or DATABASE_URL before seeding.");
  }
  return { apiUrl, password, key };
}

export function demoIdentity(config: DemoConfig, bidder?: number) {
  const username = bidder === undefined ? `bidora_demo_${config.key}` : `bidora_demo_${bidder}_${config.key}`;
  return { username, email: `${username}@bidora.demo`, password: config.password };
}

export async function apiRequest<T>(config: DemoConfig, path: string, options: RequestInit = {}) {
  const response = await fetch(`${config.apiUrl}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok) {
    // Never include headers, cookies, credentials or submitted request bodies in errors.
    throw new Error(`${options.method ?? "GET"} ${path} failed (${response.status}).`);
  }
  return await response.json() as T;
}

export async function getDemoSession(config: DemoConfig, bidder?: number) {
  const identity = demoIdentity(config, bidder);
  const registration = await fetch(`${config.apiUrl}/api/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(identity), signal: AbortSignal.timeout(60_000),
  });
  if (!registration.ok && registration.status !== 409) throw new Error(`Demo registration failed (${registration.status}).`);
  const login = await fetch(`${config.apiUrl}/api/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: identity.email, password: identity.password }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!login.ok) throw new Error(`Demo login failed (${login.status}). Reuse the original seed password for this seed key.`);
  const cookie = login.headers.getSetCookie().find((value) => value.startsWith("token="))?.split(";")[0];
  if (!cookie) throw new Error("Demo login did not return a session cookie.");
  const data = await login.json() as { user: { id: number } };
  return { id: data.user.id, headers: { Cookie: cookie } };
}

export const demoCatalogue = [
  {
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
    items: [["MacBook Air M2", 650], ["Wireless Headphones", 55], ["Bluetooth Speaker", 40], ["Portable Tablet", 140], ["USB-C Docking Station", 65]],
  },
  {
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80",
    items: [["Air Jordan Sneakers", 80], ["Leather Backpack", 60], ["Denim Jacket", 35], ["Cotton Hoodie", 25], ["Canvas Tote Bag", 15]],
  },
  {
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80",
    items: [["PlayStation 5 Console", 320], ["Nintendo Switch OLED", 210], ["Mechanical Gaming Keyboard", 45], ["Wireless Game Controller", 40], ["Gaming Headset", 50]],
  },
  {
    category: "Collectibles",
    image: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1000&q=80",
    items: [["Collectible Film Camera", 90], ["Limited Edition Trading Cards", 25], ["Retro Vinyl Collection", 75], ["Commemorative Coin Set", 55], ["Collectible Miniature Model", 35]],
  },
  {
    category: "Art",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=80",
    items: [["Abstract Canvas Painting", 110], ["Minimalist Wall Print", 35], ["Limited Edition Art Poster", 50], ["Handmade Watercolor Print", 28], ["Modern Sculpture", 90]],
  },
  {
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
    items: [["Modern Desk Lamp", 25], ["Ceramic Vase", 30], ["Woven Cushion Set", 20], ["Decorative Wall Mirror", 45], ["Linen Throw Blanket", 30]],
  },
  {
    category: "Books",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1000&q=80",
    items: [["Classic Literature Collection", 18], ["Illustrated Design Book", 32], ["Science Fiction Box Set", 24], ["Photography Coffee Table Book", 35], ["Historical Fiction Collection", 22]],
  },
  {
    category: "Sports",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1000&q=80",
    items: [["Adjustable Dumbbell Set", 65], ["Tennis Racket", 45], ["Yoga Mat and Blocks", 15], ["Indoor Training Bike", 160], ["Basketball and Pump Set", 20]],
  },
  {
    category: "Music",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1000&q=80",
    items: [["Acoustic Guitar", 120], ["Portable MIDI Keyboard", 75], ["Studio Microphone", 60], ["Ukulele Starter Kit", 40], ["Digital Guitar Pedal", 65]],
  },
  {
    category: "Photography",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
    items: [["Mirrorless Camera Kit", 280], ["Camera Tripod", 35], ["Portrait Lens", 145], ["Camera Carrying Bag", 28], ["LED Photography Light", 45]],
  },
  {
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80",
    items: [["Silver Pendant Necklace", 38], ["Handmade Bracelet", 16], ["Pearl Earrings", 45], ["Gold-Plated Chain Bracelet", 30], ["Handmade Gemstone Ring", 35]],
  },
  {
    category: "Watches",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80",
    items: [["Classic Leather Watch", 95], ["Stainless Steel Watch", 130], ["Vintage Pocket Watch", 70], ["Minimalist Dial Watch", 60], ["Sport Chronograph Watch", 85]],
  },
  {
    category: "Toys",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80",
    items: [["Wooden Building Blocks", 22], ["Family Board Game", 18], ["Remote Control Car", 42], ["Puzzle Collection", 20], ["Toy Train Set", 35]],
  },
  {
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1538688423619-a81d3f23454b?auto=format&fit=crop&w=1000&q=80",
    items: [["Minimalist Coffee Table", 85], ["Ergonomic Desk Chair", 110], ["Oak Bedside Table", 55], ["Compact Bookshelf", 60], ["Dining Chair Pair", 80]],
  },
  {
    category: "Garden",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80",
    items: [["Terracotta Planter Set", 24], ["Garden Tool Kit", 30], ["Balcony Plant Stand", 45], ["Outdoor Watering Can", 18], ["Raised Garden Bed Kit", 55]],
  },
  {
    category: "Tools",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80",
    items: [["Cordless Drill Kit", 75], ["Precision Screwdriver Set", 18], ["Portable Tool Box", 28], ["Socket Wrench Set", 35], ["Rechargeable Work Light", 25]],
  },
  {
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=80",
    items: [["Makeup Brush Set", 20], ["Illuminated Vanity Mirror", 35], ["Travel Toiletry Organizer", 12], ["Compact Hair Styling Tool", 45], ["Beauty Accessories Organizer", 18]],
  },
  {
    category: "Automotive",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80",
    items: [["Car Dash Camera", 55], ["Portable Tire Inflator", 30], ["Motorcycle Helmet", 80], ["Car Cleaning Kit", 25], ["Roof Cargo Bag", 55]],
  },
  {
    category: "Antiques",
    image: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=1000&q=80",
    items: [["Vintage Brass Candlestick", 40], ["Antique Decorative Box", 65], ["Vintage Ceramic Tea Set", 75], ["Vintage Wooden Picture Frame", 28], ["Antique Desk Clock", 90]],
  },
  {
    category: "Travel",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80",
    items: [["Cabin Suitcase", 55], ["Hiking Travel Backpack", 40], ["Travel Packing Cube Set", 15], ["Lightweight Weekend Bag", 35], ["Travel Neck Pillow Set", 15]],
  },
 ] as const;

export function buildDemoAuctions(key: string, now = Date.now()) {
  return demoCatalogue.flatMap((category, categoryIndex) => category.items.map(([title, startingPrice], itemIndex) => {
    const index = categoryIndex * 5 + itemIndex;
    return createAuctionSchema.parse({
      title,
      description: `[DEMO:${key}] ${title}. Sample listing for exploring Bidora's ${category.category.toLowerCase()} auctions. Images are illustrative; this item is demo content.`,
      category: category.category,
      startingPrice,
      image: category.image,
      endsAt: new Date(now + (index < 3
        ? (6 + index * 6) * 3_600_000
        : (30 + index % 61) * 86_400_000)).toISOString(),
    });
  }));
}

async function main() {
  const config = getDemoConfig();
  const data = buildDemoAuctions(config.key);
  if (process.argv.includes("--dry-run")) {
    console.log(`Validated ${data.length} demo auctions across ${demoCatalogue.length} categories. No data written.`);
    return;
  }
  let created = 0;
  let extended = 0;
  const refreshDeadlines = process.argv.includes("--refresh-deadlines");
  if (refreshDeadlines && config.apiUrl && config.key !== "catalogue_v3") {
    throw new Error("API deadline refresh is restricted to the existing catalogue_v3 portfolio seed account.");
  }
  if (config.apiUrl) {
    const session = await getDemoSession(config);
    const existing = await apiRequest<DemoAuction[]>(config, "/api/auctions/mine", { headers: session.headers });
    const byTitle = new Map(existing.map((auction) => [auction.title, auction]));
    for (const [index, auction] of data.entries()) {
      const previous = byTitle.get(auction.title);
      if (previous) {
        // Keep the three existing ending-soon listings. Extend only this seed's
        // active long-running listings; counters and prices are never submitted.
        if (refreshDeadlines && index >= 3 && previous.description.startsWith(`[DEMO:${config.key}]`) &&
            new Date(previous.endsAt).getTime() > Date.now() &&
            new Date(previous.endsAt).getTime() < new Date(auction.endsAt).getTime()) {
          await apiRequest(config, `/api/auctions/${previous.id}`, {
            method: "PATCH", headers: session.headers, body: JSON.stringify({ endsAt: auction.endsAt }),
          });
          extended++;
        }
        continue;
      }
      await apiRequest(config, "/api/auctions", { method: "POST", headers: session.headers, body: JSON.stringify(auction) });
      created++;
      if (created % 10 === 0) console.log(`Created ${created} demo auctions...`);
    }
  } else {
    const { prisma } = await import("../lib/prisma.js");
    try {
      const identity = demoIdentity(config);
      const seller = await prisma.user.upsert({
        where: { email: identity.email }, update: {},
        create: { ...identity, password: await bcrypt.hash(config.password, 10) },
      });
      if (!await bcrypt.compare(config.password, seller.password)) throw new Error("Demo seller seed password does not match.");
      const existing = await prisma.auction.findMany({ where: { sellerId: seller.id }, select: { id: true, title: true, description: true, endsAt: true, bids: true } });
      const titles = new Set(existing.map((auction) => auction.title));
      if (refreshDeadlines) {
        const bidderEmails = [1, 2, 3, 4].map((index) => demoIdentity(config, index).email);
        for (const [index, auction] of data.entries()) {
          const previous = existing.find((item) => item.title === auction.title);
          if (!previous || index < 3 || !previous.description.startsWith(`[DEMO:${config.key}]`)) continue;
          const result = await prisma.auction.updateMany({
            where: {
              id: previous.id, sellerId: seller.id, bids: previous.bids,
              endsAt: { gt: new Date(), lt: new Date(auction.endsAt) },
              bidHistory: { every: { user: { email: { in: bidderEmails } } } },
            },
            data: { endsAt: new Date(auction.endsAt) },
          });
          extended += result.count;
        }
      }
      const result = await prisma.auction.createMany({
        data: data.filter((auction) => !titles.has(auction.title)).map((auction) => ({
          ...auction, endsAt: new Date(auction.endsAt), currentBid: auction.startingPrice, bids: 0, sellerId: seller.id,
        })),
      });
      created = result.count;
    } finally { await prisma.$disconnect(); }
  }
  console.log(`Created ${created} demo auctions; ${extended} demo deadlines extended; existing bids and prices preserved.`);
}

if (require.main === module) {
  main().catch((error) => { console.error("DEMO AUCTION SEED ERROR:", error.message); process.exitCode = 1; });
}
