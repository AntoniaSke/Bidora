"use client";

import { API_URL } from "@/lib/api";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { socket } from "@/lib/socket";

const links = [
  {
    label: "Profile",
    href: "/profile",
  },
  {
    label: "Favourites",
    href: "/profile/favourites",
  },
  {
    label: "My Bids",
    href: "/profile/bids",
  },
  {
    label: "My Auctions",
    href: "/profile/auctions",
  },
  {
    label: "Notifications",
    href: "/profile/notifications",
  },
];

export default function ProfileNav() {
  const pathname = usePathname();

  const [unreadCount, setUnreadCount] =
    useState(0);

  async function loadUnreadCount() {
    try {
      const response = await fetch(
        `${API_URL}/api/notifications/unread-count`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      setUnreadCount(
        data.count
      );
    } catch (error) {
      console.error(
        "Could not load unread notifications:",
        error
      );
    }
  }

  useEffect(() => {
    loadUnreadCount();
  }, [pathname]);

  useEffect(() => {
    function handleNotificationsUpdated() {
      loadUnreadCount();
    }

    window.addEventListener(
      "notifications-updated",
      handleNotificationsUpdated
    );

    return () => {
      window.removeEventListener(
        "notifications-updated",
        handleNotificationsUpdated
      );
    };
  }, []);

  /*
    Realtime refresh when a bid happens.

    Notifications NEW_BID / OUTBID
    έχουν ήδη δημιουργηθεί στο backend
    πριν γίνει το bid-placed emit.
  */
  useEffect(() => {
    socket.connect();

    function handleBidPlaced() {
      loadUnreadCount();
    }

    socket.on(
      "bid-placed",
      handleBidPlaced
    );

    return () => {
      socket.off(
        "bid-placed",
        handleBidPlaced
      );
    };
  }, []);

  /*
    WON / AUCTION_SOLD δημιουργούνται
    από τον ended-auction checker.

    Κάνουμε μικρό periodic refresh ώστε
    το badge να ενημερωθεί χωρίς manual refresh.
  */
  useEffect(() => {
    const interval =
      setInterval(() => {
        loadUnreadCount();
      }, 60_000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="mb-10 border-b border-[var(--bidora-border)]">
      <div className="flex flex-wrap gap-6">
        {links.map((link) => {
          const isActive =
            pathname === link.href;

          const isNotifications =
            link.href ===
            "/profile/notifications";

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                relative
                flex
                items-center
                gap-2
                pb-4
                text-sm
                font-semibold
                transition-colors

                ${isActive
                  ? "border-b-2 border-[var(--bidora-accent)] text-[var(--bidora-primary)]"
                  : "text-[var(--bidora-text-secondary)] hover:text-[var(--bidora-primary)]"
                }
              `}
            >
              {link.label}

              {isNotifications &&
                unreadCount > 0 && (
                  <span
                    className="
                      flex
                      h-5
                      min-w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-[var(--bidora-accent)]
                      px-1.5
                      text-[11px]
                      font-bold
                      text-white
                    "
                  >
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}