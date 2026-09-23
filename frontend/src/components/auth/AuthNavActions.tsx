"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  Heart,
  Gavel,
  Package,
  Bell,
} from "lucide-react";

import { socket } from "@/lib/socket";

type AuthNavActionsProps = {
  mobile?: boolean;
};

export default function AuthNavActions({
  mobile = false,
}: AuthNavActionsProps) {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [unreadCount, setUnreadCount] =
    useState(0);

  async function loadUnreadCount() {
    try {
      const response = await fetch(
        "http://localhost:4000/api/notifications/unread-count",
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
        "Could not load notification count:",
        error
      );
    }
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(
          "http://localhost:4000/api/auth/me",
          {
            credentials: "include",
          }
        );

        setIsLoggedIn(
          response.ok
        );

        if (response.ok) {
          await loadUnreadCount();
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    function handleNotificationsUpdated() {
      if (isLoggedIn) {
        loadUnreadCount();
      }
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
  }, [isLoggedIn]);

  /*
    Realtime update for NEW_BID / OUTBID.
  */
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

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
  }, [isLoggedIn]);

  /*
    WON / AUCTION_SOLD are created
    by the ended-auction checker,
    so refresh periodically too.
  */
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const interval =
      setInterval(() => {
        loadUnreadCount();
      }, 60_000);

    return () => {
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  async function handleLogout() {
    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        return;
      }

      setIsLoggedIn(false);
      setUnreadCount(0);
      setMenuOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  }

  function NotificationBadge() {
    if (unreadCount <= 0) {
      return null;
    }

    return (
      <span
        className="
          ml-auto
          flex
          h-5
          min-w-5
          items-center
          justify-center
          rounded-full
          bg-[var(--bidora-accent)]
          px-1.5
          text-[10px]
          font-bold
          text-white
        "
      >
        {unreadCount > 99
          ? "99+"
          : unreadCount}
      </span>
    );
  }

  if (isLoading) {
    return (
      <div
        className="
          h-11
          w-11
          shrink-0
        "
      />
    );
  }

  // MOBILE
  if (mobile) {
    if (!isLoggedIn) {
      return (
        <div className="grid grid-cols-2 gap-3">
          <a
            href="/login"
            className="
              rounded-xl
              border
              border-[var(--bidora-border)]
              px-4
              py-3
              text-center
              font-medium
              text-[var(--bidora-text)]
            "
          >
            Log In
          </a>

          <a
            href="/register"
            className="
              rounded-xl
              border
              border-[var(--bidora-border)]
              px-4
              py-3
              text-center
              font-medium
              text-[var(--bidora-text)]
            "
          >
            Sign Up
          </a>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <a
          href="/profile"
          className="
            flex
            items-center
            gap-3
            rounded-xl
            px-3
            py-3
            font-medium
            hover:bg-[var(--bidora-background)]
          "
        >
          <User size={19} />
          Profile
        </a>

        <a
          href="/profile/favourites"
          className="
            flex
            items-center
            gap-3
            rounded-xl
            px-3
            py-3
            font-medium
            hover:bg-[var(--bidora-background)]
          "
        >
          <Heart size={19} />
          Favourites
        </a>

        <a
          href="/profile/bids"
          className="
            flex
            items-center
            gap-3
            rounded-xl
            px-3
            py-3
            font-medium
            hover:bg-[var(--bidora-background)]
          "
        >
          <Gavel size={19} />
          My Bids
        </a>

        <a
          href="/profile/auctions"
          className="
            flex
            items-center
            gap-3
            rounded-xl
            px-3
            py-3
            font-medium
            hover:bg-[var(--bidora-background)]
          "
        >
          <Package size={19} />
          My Auctions
        </a>

        <a
          href="/profile/notifications"
          className="
            flex
            items-center
            gap-3
            rounded-xl
            px-3
            py-3
            font-medium
            hover:bg-[var(--bidora-background)]
          "
        >
          <Bell size={19} />
          Notifications

          <NotificationBadge />
        </a>

        <div className="my-2 border-t border-[var(--bidora-border)]" />

        <button
          type="button"
          onClick={
            handleLogout
          }
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-3
            text-left
            font-medium
            text-[var(--bidora-accent)]
            hover:bg-[var(--bidora-background)]
          "
        >
          <LogOut size={19} />
          Log out
        </button>
      </div>
    );
  }

  // DESKTOP LOGGED OUT
  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-6">
        <a
          href="/login"
          className="
            font-semibold
            text-[var(--bidora-text)]
            transition
            hover:text-[var(--bidora-primary)]
          "
        >
          Log In
        </a>

        <a
          href="/register"
          className="
            font-semibold
            text-[var(--bidora-primary)]
            transition
            hover:text-[var(--bidora-accent)]
          "
        >
          Sign Up
        </a>
      </div>
    );
  }

  // DESKTOP LOGGED IN
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setMenuOpen(
            (prev) => !prev
          )
        }
        className="
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-[var(--bidora-border)]
          bg-white
          text-[var(--bidora-primary)]
          transition
          hover:border-[var(--bidora-primary)]
        "
        aria-label="Open profile menu"
      >
        <User size={20} />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-[var(--bidora-accent)]
              px-1
              text-[9px]
              font-bold
              text-white
            "
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {menuOpen && (
        <div
          className="
            absolute
            right-0
            top-14
            z-50
            w-56
            rounded-2xl
            border
            border-[var(--bidora-border)]
            bg-white
            p-2
            shadow-lg
          "
        >
          <a
            href="/profile"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-[var(--bidora-background)]"
          >
            <User size={17} />
            Profile
          </a>

          <a
            href="/profile/favourites"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-[var(--bidora-background)]"
          >
            <Heart size={17} />
            Favourites
          </a>

          <a
            href="/profile/bids"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-[var(--bidora-background)]"
          >
            <Gavel size={17} />
            My Bids
          </a>

          <a
            href="/profile/auctions"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-[var(--bidora-background)]"
          >
            <Package size={17} />
            My Auctions
          </a>

          <a
            href="/profile/notifications"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-[var(--bidora-background)]"
          >
            <Bell size={17} />
            Notifications

            <NotificationBadge />
          </a>

          <div className="my-2 border-t border-[var(--bidora-border)]" />

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-left
              text-sm
              font-medium
              text-[var(--bidora-accent)]
              hover:bg-[var(--bidora-background)]
            "
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}