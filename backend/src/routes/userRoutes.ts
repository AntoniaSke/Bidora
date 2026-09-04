import { Router } from "express";
import { updateProfile } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.patch("/me", requireAuth, updateProfile);

export default router;