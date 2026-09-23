import { Router } from "express";

import {
  placeBid,
  getMyBids,
  getAuctionBids,
} from "../controllers/bidController.js";

import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post(
  "/auctions/:id",
  requireAuth,
  placeBid
);

router.get(
  "/mine",
  requireAuth,
  getMyBids
);

router.get(
  "/auctions/:id",
  getAuctionBids
);

export default router;