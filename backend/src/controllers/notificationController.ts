import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";

/*
  GET /api/notifications
*/
export async function getNotifications(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.userId;

    const notifications =
      await prisma.notification.findMany({
        where: {
          userId,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json(
      notifications
    );
  } catch (error) {
    console.error(
      "GET NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Could not load notifications",
    });
  }
}

/*
  GET /api/notifications/unread-count
*/
export async function getUnreadCount(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.userId;

    const count =
      await prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      });

    return res.status(200).json({
      count,
    });
  } catch (error) {
    console.error(
      "GET UNREAD COUNT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Could not load unread count",
    });
  }
}

/*
  PATCH /api/notifications/:id/read
*/
export async function markNotificationAsRead(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.userId;
    const notificationId =
      Number(req.params.id);

    if (
      Number.isNaN(notificationId)
    ) {
      return res.status(400).json({
        message:
          "Invalid notification id",
      });
    }

    const notification =
      await prisma.notification.findUnique({
        where: {
          id: notificationId,
        },
      });

    if (!notification) {
      return res.status(404).json({
        message:
          "Notification not found",
      });
    }

    /*
      User can only update
      their own notification.
    */
    if (
      notification.userId !==
      userId
    ) {
      return res.status(403).json({
        message:
          "You cannot update this notification",
      });
    }

    const updatedNotification =
      await prisma.notification.update({
        where: {
          id: notificationId,
        },

        data: {
          isRead: true,
        },
      });

    return res
      .status(200)
      .json(updatedNotification);
  } catch (error) {
    console.error(
      "MARK NOTIFICATION READ ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Could not update notification",
    });
  }
}

/*
  PATCH /api/notifications/read-all
*/
export async function markAllNotificationsAsRead(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.userId;

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },

      data: {
        isRead: true,
      },
    });

    return res.status(200).json({
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "MARK ALL NOTIFICATIONS READ ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Could not update notifications",
    });
  }
}