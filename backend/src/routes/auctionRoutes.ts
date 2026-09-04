import { Router } from "express";
import {
  getAuctions,
  getAuctionById,
  createAuction,
} from "../controllers/auctionController.js";

const router = Router();

router.get("/", getAuctions);
router.get("/:id", getAuctionById);
router.post("/", createAuction);

export default router;