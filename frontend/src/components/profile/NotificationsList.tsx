"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCheck } from "lucide-react";
import { toast } from "sonner";

type Notification = {
  id: number;
  userId: number;
  type: string;
  message: string;
  auctionId: number | null;
  isRead: boolean;
  createdAt: string;
};


function notifyUnreadCountChanged() {
  window.dispatchEvent(
    new Event("notifications-updated")
  );
}

export default function NotificationsList() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isMarkingAll, setIsMarkingAll] =
    useState(false);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await fetch(
          "http://localhost:4000/api/notifications",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          toast.error(
            "Could not load notifications."
          );

          return;
        }

        const data =
          await response.json();

        setNotifications(data);
      } catch (error) {
        console.error(
          "Could not load notifications:",
          error
        );

        toast.error(
          "Could not connect to the server."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadNotifications();
  }, []);

  async function markAsRead(
    notificationId: number
  ) {
    const notification =
      notifications.find(
        (item) =>
          item.id === notificationId
      );

    if (
      !notification ||
      notification.isRead
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );
      notifyUnreadCountChanged();
    } catch (error) {
      console.error(
        "Could not mark notification as read:",
        error
      );
    }
  }

  async function markAllAsRead() {
    const hasUnread =
      notifications.some(
        (notification) =>
          !notification.isRead
      );

    if (!hasUnread) {
      return;
    }

    try {
      setIsMarkingAll(true);

      const response = await fetch(
        "http://localhost:4000/api/notifications/read-all",
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!response.ok) {
        toast.error(
          "Could not update notifications."
        );

        return;
      }

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
        notifyUnreadCountChanged();
      toast.success(
        "All notifications marked as read."
      );
      
    } catch (error) {
      console.error(
        "Could not mark notifications as read:",
        error
      );

      toast.error(
        "Could not connect to the server."
      );
    } finally {
      setIsMarkingAll(false);
    }
  }

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  if (isLoading) {
    return (
      <p className="text-[var(--bidora-text-secondary)]">
        Loading notifications...
      </p>
    );
  }

  if (notifications.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-[var(--bidora-border)]
          bg-white
          px-6
          py-20
          text-center
        "
      >
        <h2 className="text-xl font-bold text-[var(--bidora-text)]">
          No notifications yet
        </h2>

        <p className="mt-2 text-[var(--bidora-text-secondary)]">
          Updates about your bids and auctions
          will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* TOP ACTION */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--bidora-text-secondary)]">
          {unreadCount === 0
            ? "You're all caught up."
            : `${unreadCount} unread ${
                unreadCount === 1
                  ? "notification"
                  : "notifications"
              }`}
        </p>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={
              markAllAsRead
            }
            disabled={
              isMarkingAll
            }
            className="
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-[var(--bidora-primary)]
              transition
              hover:text-[var(--bidora-accent)]
              disabled:opacity-50
            "
          >
            <CheckCheck size={17} />

            {isMarkingAll
              ? "Updating..."
              : "Mark all as read"}
          </button>
        )}
      </div>

      {/* NOTIFICATION LIST */}
      <div className="space-y-3">
        {notifications.map(
          (notification) => {
            const content = (
              <div
                className={`
                  rounded-2xl
                  border
                  px-5
                  py-4
                  transition

                  ${
                    notification.isRead
                      ? "border-[var(--bidora-border)] bg-white"
                      : "border-[var(--bidora-primary)]/20 bg-blue-50/40"
                  }

                  ${
                    notification.auctionId
                      ? "hover:border-[var(--bidora-primary)]"
                      : ""
                  }
                `}
              >
                <div className="flex gap-4">
                  {/* UNREAD DOT */}
                  <div className="pt-2">
                    <span
                      className={`
                        block
                        h-2.5
                        w-2.5
                        rounded-full

                        ${
                          notification.isRead
                            ? "bg-transparent"
                            : "bg-[var(--bidora-accent)]"
                        }
                      `}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`
                        text-sm
                        text-[var(--bidora-text)]

                        ${
                          notification.isRead
                            ? "font-medium"
                            : "font-semibold"
                        }
                      `}
                    >
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-[var(--bidora-text-secondary)]">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );

            if (
              notification.auctionId
            ) {
              return (
                <Link
                  key={
                    notification.id
                  }
                  href={`/auctions/${notification.auctionId}`}
                  onClick={() =>
                    markAsRead(
                      notification.id
                    )
                  }
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={
                  notification.id
                }
                onClick={() =>
                  markAsRead(
                    notification.id
                  )
                }
              >
                {content}
              </div>
            );
          }
        )}
      </div>
    </>
  );
}