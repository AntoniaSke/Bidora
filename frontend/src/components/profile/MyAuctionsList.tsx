"use client";

import { API_URL } from "@/lib/api";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import AuctionCard from "@/src/components/auctions/AuctionCard";

type Auction = {
  id: number;
  title: string;
  category: string;
  currentBid: number;
  bids: number;
  image: string;
  endsAt: string;
  hasEnded: boolean;

  winner: {
    userId: number;
    username: string;
    amount: number;
  } | null;
};

type AuctionFilter =
  | "all"
  | "active"
  | "ended";

export default function MyAuctionsList() {
  const [auctions, setAuctions] =
    useState<Auction[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [filter, setFilter] =
    useState<AuctionFilter>("all");

  useEffect(() => {
    async function loadMyAuctions() {
      try {
        const response = await fetch(
          `${API_URL}/api/auctions/mine`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          toast.error(
            "Could not load your auctions."
          );

          return;
        }

        const data =
          await response.json();

        setAuctions(data);
      } catch (error) {
        console.error(
          "Could not load your auctions:",
          error
        );

        toast.error(
          "Could not connect to the server."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadMyAuctions();
  }, []);

  const filteredAuctions =
    auctions.filter((auction) => {
      if (filter === "active") {
        return !auction.hasEnded;
      }

      if (filter === "ended") {
        return auction.hasEnded;
      }

      return true;
    });

  if (isLoading) {
    return (
      <p className="text-[var(--bidora-text-secondary)]">
        Loading your auctions...
      </p>
    );
  }

  if (auctions.length === 0) {
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
          No auctions yet
        </h2>

        <p className="mt-2 text-[var(--bidora-text-secondary)]">
          Create your first auction and it will appear here.
        </p>

        <Link
          href="/sell"
          className="
            mt-6
            inline-block
            rounded-xl
            bg-[var(--bidora-accent)]
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:opacity-90
          "
        >
          Sell an Item
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
                  item.value as AuctionFilter
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

      {/* EMPTY FILTER RESULT */}
      {filteredAuctions.length === 0 ? (
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
            No auctions found
          </p>

          <p className="mt-2 text-sm text-[var(--bidora-text-secondary)]">
            You don't have any auctions matching this filter.
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
          {filteredAuctions.map(
            (auction) => (
              <AuctionCard
                key={auction.id}
                id={auction.id}
                title={auction.title}
                category={auction.category}
                currentBid={
                  auction.currentBid
                }
                bids={auction.bids}
                image={auction.image}
                endsAt={auction.endsAt}

                showFavouriteButton={
                  false
                }

                showEditButton
                showDeleteButton

                canEdit={
                  auction.bids === 0 &&
                  !auction.hasEnded
                }

                canDelete={
                  auction.bids === 0 &&
                  !auction.hasEnded
                }

                sellerResult={
                  auction.hasEnded &&
                  auction.winner
                    ? {
                        username:
                          auction.winner
                            .username,

                        amount:
                          auction.winner
                            .amount,
                      }
                    : null
                }

                showNoBidsResult={
                  auction.hasEnded &&
                  !auction.winner
                }

                onDelete={(
                  auctionId
                ) => {
                  setAuctions(
                    (prev) =>
                      prev.filter(
                        (item) =>
                          item.id !==
                          auctionId
                      )
                  );
                }}
              />
            )
          )}
        </div>
      )}
    </>
  );
}