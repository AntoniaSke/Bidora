"use client";

import { API_URL } from "@/lib/api";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AuctionCard from "@/src/components/auctions/AuctionCard";
import { socket } from "@/lib/socket";

type Auction = {
  id: number;
  title: string;
  category: string;
  currentBid: number;
  bids: number;
  image: string;
  endsAt: string;
};

type Bid = {
  id: number;
  amount: number;
  createdAt: string;
  auction: Auction;
};

type AuctionBid = {
  auction: Auction;
  myBid: number;
};

type BidFilter =
  | "all"
  | "highest"
  | "outbid"
  | "won"
  | "lost";

type MyBidsListProps = {
  filter: string;
};

type BidPlacedEvent = {
  auctionId: number;
  currentBid: number;
  bids: number;
};

function getBidStatus(
  auction: Auction,
  myBid: number
): Exclude<BidFilter, "all"> {
  const hasEnded =
    new Date(
      auction.endsAt
    ).getTime() <= Date.now();

  const isHighestBidder =
    myBid === auction.currentBid;

  if (hasEnded) {
    return isHighestBidder
      ? "won"
      : "lost";
  }

  return isHighestBidder
    ? "highest"
    : "outbid";
}

export default function MyBidsList({
  filter,
}: MyBidsListProps) {
  const [auctionBids, setAuctionBids] =
    useState<AuctionBid[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState(false);

  /*
    Initial load
  */
  useEffect(() => {
    async function loadMyBids() {
      try {
        const response = await fetch(
          `${API_URL}/api/bids/mine`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          setLoadError(true);
          return;
        }

        const bids: Bid[] =
          await response.json();

        /*
          Backend returns newest -> oldest.

          Keep only the user's latest bid
          for each auction.
        */
        const uniqueAuctions =
          new Map<number, AuctionBid>();

        for (const bid of bids) {
          if (
            !uniqueAuctions.has(
              bid.auction.id
            )
          ) {
            uniqueAuctions.set(
              bid.auction.id,
              {
                auction:
                  bid.auction,
                myBid:
                  bid.amount,
              }
            );
          }
        }

        setAuctionBids(
          Array.from(
            uniqueAuctions.values()
          )
        );
      } catch (error) {
        console.error(
          "Could not load your bids:",
          error
        );

        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadMyBids();
  }, []);

  /*
    Realtime auction updates
  */
  useEffect(() => {
    socket.connect();

    function handleBidPlaced(
      data: BidPlacedEvent
    ) {
      setAuctionBids((prev) =>
        prev.map((item) =>
          item.auction.id ===
          data.auctionId
            ? {
                ...item,
                auction: {
                  ...item.auction,
                  currentBid:
                    data.currentBid,
                  bids:
                    data.bids,
                },
              }
            : item
        )
      );
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

  const filteredAuctionBids =
    useMemo(() => {
      if (filter === "all") {
        return auctionBids;
      }

      return auctionBids.filter(
        ({
          auction,
          myBid,
        }) =>
          getBidStatus(
            auction,
            myBid
          ) === filter
      );
    }, [
      auctionBids,
      filter,
    ]);

  if (isLoading) {
    return (
      <p className="text-[var(--bidora-text-secondary)]">
        Loading your bids...
      </p>
    );
  }

  if (loadError) {
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
          Could not load your bids
        </h2>

        <p className="mt-2 text-[var(--bidora-text-secondary)]">
          Please try again later.
        </p>
      </div>
    );
  }

  if (auctionBids.length === 0) {
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
          No bids yet
        </h2>

        <p className="mt-2 text-[var(--bidora-text-secondary)]">
          Once you place a bid, the auction will appear here.
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
              label: "Highest",
              value: "highest",
            },
            {
              label: "Outbid",
              value: "outbid",
            },
            {
              label: "Won",
              value: "won",
            },
            {
              label: "Lost",
              value: "lost",
            },
          ].map((item) => (
            <Link
              key={item.value}
              href={
                item.value === "all"
                  ? "/profile/bids"
                  : `/profile/bids?filter=${item.value}`
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
            </Link>
          ))}
        </div>
      </div>

      {/* EMPTY FILTER RESULT */}
      {filteredAuctionBids.length === 0 ? (
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
            No bids found
          </p>

          <p className="mt-2 text-sm text-[var(--bidora-text-secondary)]">
            You don't have any bids matching this filter.
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
          {filteredAuctionBids.map(
            ({
              auction,
              myBid,
            }) => {
              const bidStatus =
                getBidStatus(
                  auction,
                  myBid
                );

              return (
                <AuctionCard
                  key={
                    auction.id
                  }
                  id={
                    auction.id
                  }
                  title={
                    auction.title
                  }
                  category={
                    auction.category
                  }
                  currentBid={
                    auction.currentBid
                  }
                  bids={
                    auction.bids
                  }
                  image={
                    auction.image
                  }
                  endsAt={
                    auction.endsAt
                  }
                  showFavouriteButton={
                    false
                  }
                  bidStatus={
                    bidStatus
                  }
                />
              );
            }
          )}
        </div>
      )}
    </>
  );
}