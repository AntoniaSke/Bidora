import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import auctionRoutes from "./routes/auctionRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = 4000;

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Bidora API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Bidora API running on http://localhost:${PORT}`);
});