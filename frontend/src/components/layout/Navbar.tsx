"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import AuthNavActions from "@/src/components/auth/AuthNavActions";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Auctions",
      href: "/auctions",
    },
    {
      label: "Categories",
      href: "/categories",
    },
  ];

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <nav className="w-full bg-white border-b border-[var(--bidora-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">

        {/* BRAND */}
        <Link
          href="/"
          className="text-2xl sm:text-3xl font-black tracking-[-0.055em]"
        >
          <span className="text-[var(--bidora-primary)]">
            BID
          </span>

          <span className="text-[var(--bidora-accent)]">
            ORA
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative
                  py-2
                  font-medium
                  transition-colors
                  duration-200

                  ${
                    active
                      ? "text-[var(--bidora-primary)]"
                      : "text-[var(--bidora-text)] hover:text-[var(--bidora-primary)]"
                  }
                `}
              >
                {link.label}

                {active && (
                  <span
                    className="
                      absolute
                      left-0
                      right-0
                      -bottom-1
                      h-[2px]
                      rounded-full
                      bg-[var(--bidora-accent)]
                    "
                  />
                )}
              </Link>
            );
          })}

          <Link
            href="/#how-it-works"
            className="
              relative
              py-2
              font-medium
              text-[var(--bidora-text)]
              transition-colors
              duration-200
              hover:text-[var(--bidora-primary)]
            "
          >
            How It Works
          </Link>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/sell"
            className={`
              rounded-xl
              px-5
              py-2.5
              font-semibold
              text-white
              transition
              
              ${
                pathname === "/sell"
                  ? "bg-[var(--bidora-primary)]"
                  : "bg-[var(--bidora-accent)] hover:opacity-90"
              }
            `}
          >
            Sell an Item
          </Link>

          <AuthNavActions />
        </div>

        {/* MOBILE */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              className="p-2"
              aria-label="Open menu"
            >
              <Menu size={27} />
            </SheetTrigger>

            <SheetContent side="right">
              <div className="mt-10">
                <AuthNavActions mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  );
}