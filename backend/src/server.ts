import express from "express";
import { createAuctionSchema } from "./schemas/auctionSchema.js";
import { prisma } from "./lib/prisma.js";

const app=express();
app.use(express.json());

const PORT=4000;
app.get("/api/health", (req,res) =>{
    res.json({
        status:"ok",
        message: "Bidora API is running"
    });
});

app.get("/api/auctions", async (req, res) => {
  const auctions = await prisma.auction.findMany();

  res.json(auctions);
});

app.get("/api/auctions/:id", async (req, res) => {
  const id = Number(req.params.id);

  const auction = await prisma.auction.findUnique({
    where: {
      id: id,
    },
  });

  if (!auction) {
    return res.status(404).json({
      message: "Auction not found",
    });
  }

  res.json(auction);
});

app.post("/api/auctions", async (req, res) => {
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
});

app.listen(PORT, () =>{
    console.log(`Bidora API running on http://localhost:${PORT}`);
});