import bcrypt from "bcrypt";

import { prisma } from "../lib/prisma.js";

function hoursFromNow(hours: number) {
  return new Date(
    Date.now() + hours * 60 * 60 * 1000
  );
}

const auctions = [
  {
    title: "MacBook Air M2",
    description:
      "MacBook Air M2 in excellent condition. Lightweight, fast and ideal for work, study or everyday use.",
    category: "Electronics",
    startingPrice: 650,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    endsAt: hoursFromNow(5),
  },
  {
    title: "Sony PlayStation 5",
    description:
      "PlayStation 5 console in excellent condition with controller and original packaging.",
    category: "Gaming",
    startingPrice: 320,
    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
    endsAt: hoursFromNow(9),
  },
  {
    title: "Vintage Film Camera",
    description:
      "Classic vintage film camera for collectors and photography enthusiasts. Fully functional.",
    category: "Collectibles",
    startingPrice: 90,
    image:
      "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848",
    endsAt: hoursFromNow(13),
  },
  {
    title: "Nike Air Jordan Sneakers",
    description:
      "Air Jordan sneakers in very good condition. Comfortable and suitable for everyday wear.",
    category: "Fashion",
    startingPrice: 80,
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3",
    endsAt: hoursFromNow(18),
  },
  {
    title: "Mechanical Gaming Keyboard",
    description:
      "RGB mechanical gaming keyboard with tactile switches and customizable lighting.",
    category: "Gaming",
    startingPrice: 45,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    endsAt: hoursFromNow(22),
  },
  {
    title: "Minimalist Wall Art",
    description:
      "Modern minimalist wall artwork suitable for living rooms, offices and creative spaces.",
    category: "Art",
    startingPrice: 35,
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5",
    endsAt: hoursFromNow(28),
  },
  {
    title: "Apple Watch Series 9",
    description:
      "Apple Watch in excellent working condition with charging cable and sport band included.",
    category: "Electronics",
    startingPrice: 180,
    image:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d",
    endsAt: hoursFromNow(32),
  },
  {
    title: "Retro Vinyl Record Player",
    description:
      "Retro-style vinyl record player with built-in speakers. Perfect for vinyl enthusiasts.",
    category: "Collectibles",
    startingPrice: 75,
    image:
      "https://images.unsplash.com/photo-1461360228754-6e81c478b882",
    endsAt: hoursFromNow(40),
  },
  {
    title: "Designer Leather Backpack",
    description:
      "Premium leather backpack with multiple compartments and minimal modern design.",
    category: "Fashion",
    startingPrice: 60,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    endsAt: hoursFromNow(48),
  },
  {
    title: "Modern Desk Lamp",
    description:
      "Minimal modern desk lamp suitable for home offices, bedrooms and study spaces.",
    category: "Home",
    startingPrice: 25,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    endsAt: hoursFromNow(54),
  },
  {
    title: "Wireless Headphones",
    description:
      "Comfortable wireless headphones with excellent sound quality and long battery life.",
    category: "Electronics",
    startingPrice: 55,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    endsAt: hoursFromNow(65),
  },
  {
    title: "Abstract Canvas Painting",
    description:
      "Original abstract canvas painting with a modern style, ideal as a statement piece.",
    category: "Art",
    startingPrice: 110,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
    endsAt: hoursFromNow(72),
  },
  {
    title: "Nintendo Switch OLED",
    description:
      "Nintendo Switch OLED console with dock and Joy-Con controllers, in excellent condition.",
    category: "Gaming",
    startingPrice: 210,
    image:
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e",
    endsAt: hoursFromNow(16),
  },
  {
    title: "Classic Wristwatch",
    description:
      "Elegant classic wristwatch with stainless steel case and leather strap.",
    category: "Fashion",
    startingPrice: 95,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
    endsAt: hoursFromNow(30),
  },
  {
    title: "Bluetooth Speaker",
    description:
      "Portable Bluetooth speaker with strong bass and long battery life.",
    category: "Electronics",
    startingPrice: 40,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
    endsAt: hoursFromNow(36),
  },
  {
    title: "Ceramic Vase",
    description:
      "Handcrafted ceramic vase with a clean contemporary design for modern interiors.",
    category: "Home",
    startingPrice: 30,
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
    endsAt: hoursFromNow(44),
  },
  {
    title: "Vintage Typewriter",
    description:
      "Decorative vintage typewriter in good condition, ideal for collectors or home decor.",
    category: "Collectibles",
    startingPrice: 120,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    endsAt: hoursFromNow(58),
  },
  {
    title: "Gaming Mouse",
    description:
      "Lightweight high-precision gaming mouse with programmable buttons and RGB lighting.",
    category: "Gaming",
    startingPrice: 35,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db",
    endsAt: hoursFromNow(26),
  },
  {
    title: "Minimalist Coffee Table",
    description:
      "Modern coffee table with clean lines, ideal for contemporary living rooms.",
    category: "Home",
    startingPrice: 85,
    image:
      "https://images.unsplash.com/photo-1532372320572-cda25653a694",
    endsAt: hoursFromNow(70),
  },
  {
    title: "Limited Edition Poster",
    description:
      "Limited edition art poster printed on premium paper, suitable for framing.",
    category: "Art",
    startingPrice: 50,
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342",
    endsAt: hoursFromNow(20),
  },
];

async function main() {
  const password =
    await bcrypt.hash(
      "Demo123!",
      10
    );

  const demoSeller =
    await prisma.user.upsert({
      where: {
        email:
          "demo@bidora.com",
      },

      update: {},

      create: {
        name:
          "Bidora Demo",

        username:
          "bidora_demo",

        email:
          "demo@bidora.com",

        password,
      },
    });

  await prisma.auction.deleteMany({
    where: {
      sellerId:
        demoSeller.id,
    },
  });

  await prisma.auction.createMany({
    data: auctions.map(
      (auction) => ({
        ...auction,

        currentBid:
          auction.startingPrice,

        bids: 0,

        sellerId:
          demoSeller.id,
      })
    ),
  });

  console.log(
    `Created ${auctions.length} demo auctions`
  );

  console.log(
    `Demo seller: ${demoSeller.username}`
  );
}

main()
  .catch((error) => {
    console.error(
      "SEED ERROR:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });