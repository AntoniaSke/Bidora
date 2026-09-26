"use client";

import { API_URL } from "@/lib/api";

import { useEffect, useState } from "react";
import Link from "next/link";

import AuctionCard from "@/src/components/auctions/AuctionCard";

type Auction = {
  id: number;
  title: string;
  category: string;
  currentBid: number;
  bids: number;
  image: string;
  endsAt: string;
};

type FavouriteFilter =
  | "all"
  | "active"
  | "ended";

export default function FavouritesList() {
  const [favourites, setFavourites] =
    useState<Auction[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [filter, setFilter] =
    useState<FavouriteFilter>("all");

  useEffect(() => {
    async function loadFavourites() {
      try {
        const response = await fetch(
          `${API_URL}/api/favourites`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        setFavourites(data);
      } catch (error) {
        console.error(
          "Could not load favourites:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadFavourites();
  }, []);

  const filteredFavourites =
    favourites.filter((auction) => {
      const hasEnded =
        new Date(
          auction.endsAt
        ).getTime() <= Date.now();

      if (filter === "active") {
        return !hasEnded;
      }

      if (filter === "ended") {
        return hasEnded;
      }

      return true;
    });

  if (isLoading) {
    return (
      <p className="text-[var(--bidora-text-secondary)]">
        Loading favourites...
      </p>
    );
  }

  if (favourites.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-[var(--bidora-border)]
          bg-white
          py-20
          px-6
          text-center
        "
      >
        <h2 className="text-xl font-bold text-[var(--bidora-text)]">
          No favourites yet
        </h2>

        <p className="mt-2 text-[var(--bidora-text-secondary)]">
          Save auctions you like and they will appear here.
        </p>

        <Link
          href="/auctions"
          className="
            mt-6
            inline-block
            rounded-xl
            bg-[var(--bidora-primary)]
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-[var(--bidora-primary-hover)]
          "
        >
          Explore auctions
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* FILTERS */}
      <div className="mb-8 flex justify-start sm:justify-end">
        <div className="flex flex-wrap gap-2">
          {[
            {
              label: "All",
              value: "all",
            },
            {
              label: "Active",
              value: "active",
            },
            {
              label: "Ended",
              value: "ended",
            },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setFilter(
                  item.value as FavouriteFilter
                )
              }
              className={`
                rounded-full
                px-4
                py-2
                text-sm
                font-semibold
                transition

                ${
                  filter === item.value
                    ? "bg-[var(--bidora-primary)] text-white"
                    : "border border-[var(--bidora-border)] bg-white text-[var(--bidora-text-secondary)] hover:text-[var(--bidora-primary)]"
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* FILTERED EMPTY STATE */}
      {filteredFavourites.length === 0 ? (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-[var(--bidora-border)]
            bg-white
            px-6
            py-16
            text-center
          "
        >
          <p className="font-semibold text-[var(--bidora-text)]">
            No favourites found
          </p>

          <p className="mt-2 text-sm text-[var(--bidora-text-secondary)]">
            You don't have any favourite auctions matching this filter.
          </p>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-[repeat(auto-fit,minmax(280px,320px))]
            gap-6
          "
        >
          {filteredFavourites.map(
            (auction) => (
              <AuctionCard
                key={auction.id}
                {...auction}
                isFavourite
                onFavouriteChange={(
                  auctionId,
                  isFavourite
                ) => {
                  if (!isFavourite) {
                    setFavourites(
                      (prev) =>
                        prev.filter(
                          (item) =>
                            item.id !==
                            auctionId
                        )
                    );
                  }
                }}
              />
            )
          )}
        </div>
      )}
    </>
  );
}