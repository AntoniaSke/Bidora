import { Router } from "express";
import {
  getAuctions,
  getAuctionById,
  getMyAuctions,
        createAuction,
        updateAuction,
        deleteAuction,
      } from "../controllers/auctionController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/mine", requireAuth, getMyAuctions);
router.get("/", getAuctions);
router.get("/:id", getAuctionById);
router.post("/", requireAuth, createAuction);
router.patch(
  "/:id",
  requireAuth,
  updateAuction
);
router.delete(
  "/:id",
  requireAuth,
  deleteAuction
);
export default router;