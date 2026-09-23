import { Router } from "express";

import { requireAuth } from "../middleware/auth.js";
import { cloudinary } from "../lib/cloudinary.js";

const router = Router();

router.post(
  "/signature",
  requireAuth,
  (req, res) => {
    try {
      const timestamp = Math.round(
        Date.now() / 1000
      );

      const folder = "bidora/auctions";

      const signature =
        cloudinary.utils.api_sign_request(
          {
            timestamp,
            folder,
          },
          process.env.CLOUDINARY_API_SECRET!
        );

      return res.status(200).json({
        timestamp,
        signature,
        folder,

        cloudName:
          process.env.CLOUDINARY_CLOUD_NAME,

        apiKey:
          process.env.CLOUDINARY_API_KEY,
      });
    } catch (error) {
      console.error(
        "CLOUDINARY SIGNATURE ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Could not prepare image upload",
      });
    }
  }
);

export default router;