"use client";

import { usePathname } from "next/navigation";

const links = [
  { label: "Profile", href: "/profile" },
  { label: "Favourites", href: "/profile/favourites" },
  { label: "My Bids", href: "/profile/bids" },
  { label: "My Auctions", href: "/profile/auctions" },
];

export default function ProfileNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-10 border-b border-[var(--bidora-border)]">
      <div className="flex flex-wrap gap-6">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <a
              key={link.href}
              href={link.href}
              className={`
                pb-4
                text-sm
                font-semibold
                transition-colors
                ${
                  isActive
                    ? "border-b-2 border-[var(--bidora-accent)] text-[var(--bidora-primary)]"
                    : "text-[var(--bidora-text-secondary)] hover:text-[var(--bidora-primary)]"
                }
              `}
            >
              {link.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}