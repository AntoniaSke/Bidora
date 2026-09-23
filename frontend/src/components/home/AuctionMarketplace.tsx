"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { socket } from "@/lib/socket";
import AuctionCard from "@/src/components/auctions/AuctionCard";

type Auction = {
  id: number;
  title: string;
  description: string;
  category: string;
  startingPrice: number;
  currentBid: number;
  bids: number;
  image: string;
  endsAt: string;
  sellerId: number;
};

export default function AuctionMarketplace() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const [favouriteIds, setFavouriteIds] = useState<number[]>(
    []
  );

  const [currentUserId, setCurrentUserId] =
    useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          auctionsResponse,
          favouritesResponse,
          userResponse,
        ] = await Promise.all([
          fetch(
            "http://localhost:4000/api/auctions"
          ),

          fetch(
            "http://localhost:4000/api/favourites",
            {
              credentials: "include",
            }
          ),

          fetch(
            "http://localhost:4000/api/auth/me",
            {
              credentials: "include",
            }
          ),
        ]);

        if (auctionsResponse.ok) {
          const auctionsData =
            await auctionsResponse.json();

          setAuctions(auctionsData);
        }

        if (favouritesResponse.ok) {
          const favouritesData =
            await favouritesResponse.json();

          setFavouriteIds(
            favouritesData.map(
              (auction: { id: number }) =>
                auction.id
            )
          );
        }

        if (userResponse.ok) {
          const user =
            await userResponse.json();

          setCurrentUserId(user.id);
        }
      } catch (error) {
        console.error(
          "Could not load homepage auctions:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();

    socket.connect();

    function handleBidPlaced(data: {
      auctionId: number;
      currentBid: number;
      bids: number;
    }) {
      setAuctions((prev) =>
        prev.map((auction) =>
          auction.id === data.auctionId
            ? {
              ...auction,
              currentBid:
                data.currentBid,
              bids: data.bids,
            }
            : auction
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

  const filteredAuctions = useMemo(() => {
    const search =
      searchTerm
        .trim()
        .toLowerCase();

    return auctions
      .filter((auction) => {
        const matchesSearch =
          auction.title
            .toLowerCase()
            .includes(search) ||
          auction.category
            .toLowerCase()
            .includes(search);

        const matchesCategory =
          category === "All" ||
          auction.category === category;

        const isNotOwnAuction =
          currentUserId === null ||
          auction.sellerId !== currentUserId;

        const isActive =
          new Date(
            auction.endsAt
          ).getTime() > Date.now();

        return (
          matchesSearch &&
          matchesCategory &&
          isNotOwnAuction &&
          isActive
        );
      })
      .sort(
        (a, b) =>
          new Date(
            a.endsAt
          ).getTime() -
          new Date(
            b.endsAt
          ).getTime()
      );
  }, [
    auctions,
    searchTerm,
    category,
    currentUserId,
  ]);

  const homepageAuctions =
    filteredAuctions.slice(0, 4);

  return (
    <>
      {/* SEARCH / FILTER SECTION */}
      <section>
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
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-[var(--bidora-border)]
                  bg-white
                  py-4
                  pl-12
                  pr-4
                  outline-none
                  transition
                  focus:border-[var(--bidora-primary)]
                "
              />
            </div>

            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              className="
                rounded-xl
                border
                border-[var(--bidora-border)]
                bg-white
                px-4
                py-4
                outline-none
                focus:border-[var(--bidora-primary)]
                lg:w-52
              "
            >
              <option value="All">
                All categories
              </option>

              <option value="Electronics">
                Electronics
              </option>

              <option value="Fashion">
                Fashion
              </option>

              <option value="Gaming">
                Gaming
              </option>

              <option value="Collectibles">
                Collectibles
              </option>

              <option value="Art">
                Art
              </option>

              <option value="Home">
                Home
              </option>
            </select>
          </div>

          <p className="mt-4 text-sm text-[var(--bidora-text-secondary)]">
            {filteredAuctions.length}{" "}
            {filteredAuctions.length === 1
              ? "auction"
              : "auctions"}{" "}
            found
          </p>
        </div>
      </section>

      {/* AUCTION PREVIEW */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--bidora-accent)]">
                Live auctions
              </p>

              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[var(--bidora-text)]">
                Ending soon
              </h2>
            </div>

            <Link
              href="/auctions"
              className="
                hidden
                font-semibold
                text-[var(--bidora-primary)]
                transition
                hover:text-[var(--bidora-accent)]
                sm:block
              "
            >
              View all →
            </Link>
          </div>

          {isLoading ? (
            <p className="text-[var(--bidora-text-secondary)]">
              Loading auctions...
            </p>
          ) : homepageAuctions.length > 0 ? (
            <div
              className="
    grid
    grid-cols-1
    sm:grid-cols-2
    md:grid-cols-3
    lg:grid-cols-4
    gap-6
  "
            >
              {homepageAuctions.map((auction) => (
                <AuctionCard
                  key={auction.id}
                  id={auction.id}
                  title={auction.title}
                  category={auction.category}
                  currentBid={auction.currentBid}
                  bids={auction.bids}
                  image={auction.image}
                  endsAt={auction.endsAt}
                  isFavourite={favouriteIds.includes(
                    auction.id
                  )}
                />
              ))}
            </div>
          ) : (
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
              <p className="text-lg font-semibold text-[var(--bidora-text)]">
                No auctions found
              </p>

              <p className="mt-2 text-[var(--bidora-text-secondary)]">
                Try a different search or category.
              </p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/auctions"
              className="font-semibold text-[var(--bidora-primary)]"
            >
              View all auctions →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}