import { Router } from "express";

import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

/*
  IMPORTANT:
  Τα static routes πρέπει να είναι
  πριν από το /:id/read.
*/
router.get(
  "/",
  getNotifications
);

router.get(
  "/unread-count",
  getUnreadCount
);

router.patch(
  "/read-all",
  markAllNotificationsAsRead
);

router.patch(
  "/:id/read",
  markNotificationAsRead
);

export default router;