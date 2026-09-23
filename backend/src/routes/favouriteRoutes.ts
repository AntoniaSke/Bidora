import { Router } from "express";

import {
  getFavourites,
  addFavourite,
  removeFavourite,
} from "../controllers/favouriteController.js";

import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getFavourites);

router.post(
  "/:auctionId",
  requireAuth,
  addFavourite
);

router.delete(
  "/:auctionId",
  requireAuth,
  removeFavourite
);

export default router;