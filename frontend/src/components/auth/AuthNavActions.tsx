"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  Heart,
  Gavel,
  Package,
} from "lucide-react";

type AuthNavActionsProps = {
  mobile?: boolean;
};

export default function AuthNavActions({
  mobile = false,
}: AuthNavActionsProps) {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(
          "http://localhost:4000/api/auth/me",
          {
            credentials: "include",
          }
        );

        setIsLoggedIn(response.ok);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) return;

      setIsLoggedIn(false);
      setMenuOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  if (isLoading) {
    return null;
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

        <div className="my-2 border-t border-[var(--bidora-border)]" />

        <button
          type="button"
          onClick={handleLogout}
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
        onClick={() => setMenuOpen((prev) => !prev)}
        className="
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

          <div className="my-2 border-t border-[var(--bidora-border)]" />

          <button
            type="button"
            onClick={handleLogout}
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