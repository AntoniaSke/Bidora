"use client";

import { Search } from "lucide-react";

type AuctionSearchProps = {
  searchTerm: string;
  category: string;
  resultCount: number;

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

export default function AuctionSearch({
  searchTerm,
  category,
  resultCount,
  onSearchChange,
  onCategoryChange,
}: AuctionSearchProps) {
  return (
    <section className="hero-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--bidora-accent)]">
            Browse auctions
          </p>

          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[var(--bidora-text)]">
            Find what you're looking for
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">

          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="
                w-full
                border
                border-[var(--bidora-border)]
                rounded-xl
                py-4
                pl-12
                pr-4
                outline-none
                bg-white
                focus:border-[var(--bidora-primary)]
                transition
              "
            />
          </div>

          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="
              lg:w-52
              border
              border-[var(--bidora-border)]
              rounded-xl
              px-4
              py-4
              bg-white
              outline-none
              focus:border-[var(--bidora-primary)]
            "
          >
            <option value="All">All categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Gaming">Gaming</option>
            <option value="Collectibles">Collectibles</option>
          </select>

        </div>

        <div className="mt-4">
          <p className="text-sm text-[var(--bidora-text-secondary)]">
            {resultCount} auctions found
          </p>
        </div>

      </div>
    </section>
  );
}