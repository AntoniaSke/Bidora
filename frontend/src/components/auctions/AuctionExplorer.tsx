"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import AuctionCard from "./AuctionCard";

import { socket } from "@/lib/socket";

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
  createdAt?: string;
};

type PriceFilter =
  | "all"
  | "under-50"
  | "50-100"
  | "100-250"
  | "250-plus";

type StatusFilter =
  | "all"
  | "ending-soon"
  | "newly-listed";

type SortOption =
  | "ending-soon"
  | "newest"
  | "most-bids"
  | "lowest-price"
  | "highest-price";

export default function AuctionExplorer() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [priceFilter, setPriceFilter] =
    useState<PriceFilter>("all");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [sort, setSort] =
    useState<SortOption>("ending-soon");

  const [favouriteIds, setFavouriteIds] =
    useState<number[]>([]);

  const [auctions, setAuctions] =
    useState<Auction[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    currentUserId,
    setCurrentUserId,
  ] = useState<number | null>(null);

  const [now, setNow] =
    useState(Date.now());

  /*
    INITIAL DATA
  */
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

          setAuctions(
            auctionsData
          );
        }

        if (favouritesResponse.ok) {
          const favouritesData =
            await favouritesResponse.json();

          const ids =
            favouritesData.map(
              (auction: {
                id: number;
              }) => auction.id
            );

          setFavouriteIds(ids);
        }

        if (userResponse.ok) {
          const user =
            await userResponse.json();

          setCurrentUserId(
            user.id
          );
        }
      } catch (error) {
        console.error(
          "Could not load auction data:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  /*
    REALTIME BIDS
  */
  useEffect(() => {
    socket.connect();

    function handleBidPlaced(data: {
      auctionId: number;
      currentBid: number;
      bids: number;
    }) {
      setAuctions((prev) =>
        prev.map((auction) =>
          auction.id ===
          data.auctionId
            ? {
                ...auction,

                currentBid:
                  data.currentBid,

                bids:
                  data.bids,
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

  /*
    UPDATE TIME
  */
  useEffect(() => {
    const interval =
      setInterval(() => {
        setNow(Date.now());
      }, 60_000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const filteredAuctions =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      const result =
        auctions.filter(
          (auction) => {
            const matchesSearch =
              auction.title
                .toLowerCase()
                .includes(search) ||
              auction.category
                .toLowerCase()
                .includes(search);

            const matchesCategory =
              category === "All" ||
              auction.category ===
                category;

            const isNotOwnAuction =
              currentUserId === null ||
              auction.sellerId !==
                currentUserId;

            const endTime =
              new Date(
                auction.endsAt
              ).getTime();

            const isActive =
              endTime > now;

            /*
              PRICE FILTER
            */
            let matchesPrice = true;

            if (
              priceFilter ===
              "under-50"
            ) {
              matchesPrice =
                auction.currentBid <
                50;
            }

            if (
              priceFilter ===
              "50-100"
            ) {
              matchesPrice =
                auction.currentBid >=
                  50 &&
                auction.currentBid <=
                  100;
            }

            if (
              priceFilter ===
              "100-250"
            ) {
              matchesPrice =
                auction.currentBid >
                  100 &&
                auction.currentBid <=
                  250;
            }

            if (
              priceFilter ===
              "250-plus"
            ) {
              matchesPrice =
                auction.currentBid >
                250;
            }

            /*
              STATUS FILTER
            */
            let matchesStatus =
              true;

            if (
              statusFilter ===
              "ending-soon"
            ) {
              const difference =
                endTime - now;

              matchesStatus =
                difference > 0 &&
                difference <=
                  24 *
                    60 *
                    60 *
                    1000;
            }

            if (
              statusFilter ===
              "newly-listed"
            ) {
              if (
                !auction.createdAt
              ) {
                matchesStatus =
                  false;
              } else {
                const createdAt =
                  new Date(
                    auction.createdAt
                  ).getTime();

                const difference =
                  now - createdAt;

                matchesStatus =
                  difference >= 0 &&
                  difference <=
                    24 *
                      60 *
                      60 *
                      1000;
              }
            }

            return (
              matchesSearch &&
              matchesCategory &&
              matchesPrice &&
              matchesStatus &&
              isNotOwnAuction &&
              isActive
            );
          }
        );

      /*
        SORT
      */
      return result.sort(
        (a, b) => {
          switch (sort) {
            case "newest":
              return (
                new Date(
                  b.createdAt ?? 0
                ).getTime() -
                new Date(
                  a.createdAt ?? 0
                ).getTime()
              );

            case "most-bids":
              return (
                b.bids -
                a.bids
              );

            case "lowest-price":
              return (
                a.currentBid -
                b.currentBid
              );

            case "highest-price":
              return (
                b.currentBid -
                a.currentBid
              );

            case "ending-soon":
            default:
              return (
                new Date(
                  a.endsAt
                ).getTime() -
                new Date(
                  b.endsAt
                ).getTime()
              );
          }
        }
      );
    }, [
      auctions,
      searchTerm,
      category,
      priceFilter,
      statusFilter,
      sort,
      currentUserId,
      now,
    ]);

  return (
    <section className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* SEARCH */}
        <div className="relative">
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
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            className="
              w-full
              rounded-2xl
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

        {/* FILTERS */}
        <div
          className="
            mt-5
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div className="flex flex-wrap gap-3">

            {/* CATEGORY */}
            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="
                rounded-xl
                border
                border-[var(--bidora-border)]
                bg-white
                px-4
                py-3
                outline-none
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

            {/* PRICE */}
            <select
              value={priceFilter}
              onChange={(e) =>
                setPriceFilter(
                  e.target
                    .value as PriceFilter
                )
              }
              className="
                rounded-xl
                border
                border-[var(--bidora-border)]
                bg-white
                px-4
                py-3
                outline-none
              "
            >
              <option value="all">
                Any price
              </option>

              <option value="under-50">
                Under €50
              </option>

              <option value="50-100">
                €50 - €100
              </option>

              <option value="100-250">
                €100 - €250
              </option>

              <option value="250-plus">
                €250+
              </option>
            </select>

            {/* STATUS */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target
                    .value as StatusFilter
                )
              }
              className="
                rounded-xl
                border
                border-[var(--bidora-border)]
                bg-white
                px-4
                py-3
                outline-none
              "
            >
              <option value="all">
                All statuses
              </option>

              <option value="ending-soon">
                Ending soon
              </option>

              <option value="newly-listed">
                Newly listed
              </option>
            </select>
          </div>

          {/* SORT */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              size={18}
              className="text-[var(--bidora-text-secondary)]"
            />

            <select
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target
                    .value as SortOption
                )
              }
              className="
                rounded-xl
                border
                border-[var(--bidora-border)]
                bg-white
                px-4
                py-3
                outline-none
              "
            >
              <option value="ending-soon">
                Ending soon
              </option>

              <option value="newest">
                Newest
              </option>

              <option value="most-bids">
                Most bids
              </option>

              <option value="lowest-price">
                Lowest price
              </option>

              <option value="highest-price">
                Highest price
              </option>
            </select>
          </div>
        </div>

        {/* RESULTS COUNT */}
        <div className="mt-10 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--bidora-text)]">
            Active auctions
          </h2>

          <p className="mt-1 text-sm text-[var(--bidora-text-secondary)]">
            {filteredAuctions.length}{" "}
            {filteredAuctions.length ===
            1
              ? "auction"
              : "auctions"}{" "}
            found
          </p>
        </div>

        {/* GRID */}
        {isLoading ? (
          <p className="text-[var(--bidora-text-secondary)]">
            Loading auctions...
          </p>
        ) : filteredAuctions.length >
          0 ? (
          <div
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {filteredAuctions.map(
              (auction) => (
                <AuctionCard
                  key={auction.id}
                  id={auction.id}
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
                  isFavourite={favouriteIds.includes(
                    auction.id
                  )}
                />
              )
            )}
          </div>
        ) : (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-[var(--bidora-border)]
              bg-white
              py-20
              text-center
            "
          >
            <p className="text-lg font-semibold text-[var(--bidora-text)]">
              No auctions found
            </p>

            <p className="mt-2 text-[var(--bidora-text-secondary)]">
              Try changing your
              search or filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}