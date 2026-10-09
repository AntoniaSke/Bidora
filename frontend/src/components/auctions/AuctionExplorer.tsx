"use client";

import { useRouter } from "next/navigation";
import { categories } from "@/src/data/categories";
import { API_URL } from "@/lib/api";

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

export default function AuctionExplorer({ initialCategory = "All" }: { initialCategory?: string }) {
  const router = useRouter();
  const category = initialCategory;
  const [searchTerm, setSearchTerm] =
    useState("");


  const [priceFilter, setPriceFilter] =
    useState<PriceFilter>("all");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [sort, setSort] =
    useState<SortOption>("ending-soon");
  const [pagination, setPagination] = useState({ filterKey: "", page: 1 });
  const pageSize = 12;
  const filterKey = JSON.stringify([category, searchTerm, priceFilter, statusFilter, sort]);
  function resetPage() { setPagination({ filterKey: "", page: 1 }); }

  const [favouriteIds, setFavouriteIds] =
    useState<number[]>([]);

  const [auctions, setAuctions] =
    useState<Auction[]>([]);

  const [loadedCategory, setLoadedCategory] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const isLoading = loadedCategory !== category;

  const [
    currentUserId,
    setCurrentUserId,
  ] = useState<number | null>(null);

  const [now, setNow] =
    useState(() => Date.now());

  /*
    INITIAL DATA
  */
  useEffect(() => {
    const controller = new AbortController();
    async function loadData() {
      try {
        const query = category === "All" ? "" : `?category=${encodeURIComponent(category)}`;
        const [auctionsResponse, favouritesResponse, userResponse] = await Promise.all([
          fetch(`${API_URL}/api/auctions${query}`, { signal: controller.signal }),
          fetch(`${API_URL}/api/favourites`, { credentials: "include", signal: controller.signal }),
          fetch(`${API_URL}/api/auth/me`, { credentials: "include", signal: controller.signal }),
        ]);
        if (!auctionsResponse.ok) throw new Error("Could not load auctions. Please refresh to try again.");
        const auctionsData = await auctionsResponse.json();
        const favouritesData = favouritesResponse.ok ? await favouritesResponse.json() : [];
        const user = userResponse.ok ? await userResponse.json() : null;
        if (controller.signal.aborted) return;
        setAuctions(auctionsData);
        setFavouriteIds(favouritesData.map((auction: { id: number }) => auction.id));
        setCurrentUserId(user?.id ?? null);
        setLoadError(null);
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(error instanceof Error ? error.message : "Could not load auctions.");
        }
      } finally {
        if (!controller.signal.aborted) setLoadedCategory(category);
      }
    }
    void loadData();
    return () => controller.abort();
  }, [category]);

  function changeCategory(value: string) {
    resetPage();
    const params = new URLSearchParams(window.location.search);
    if (value === "All") params.delete("category");
    else params.set("category", value);
    const query = params.toString();
    router.push(`/auctions${query ? `?${query}` : ""}`, { scroll: false });
  }

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

  const totalPages = Math.max(1, Math.ceil(filteredAuctions.length / pageSize));
  const currentPage = Math.min(pagination.filterKey === filterKey ? pagination.page : 1, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleAuctions = filteredAuctions.slice(startIndex, startIndex + pageSize);
  function changePage(page: number) {
    setPagination({ filterKey, page: Math.max(1, Math.min(page, totalPages)) });
    document.getElementById("auction-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
            onChange={(e) => {
              resetPage();
              setSearchTerm(
                e.target.value
              );
            }}
            className="
              w-full
              rounded-2xl
              border
              border-[var(--bidora-border)]
              bg-[var(--bidora-surface)]
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
              aria-label="Category"
              value={category}
              onChange={(e) => {
                resetPage();
                changeCategory(
                  e.target.value
                );
              }}
              className="
                rounded-xl
                border
                border-[var(--bidora-border)]
                bg-[var(--bidora-surface)]
                px-4
                py-3
                outline-none
              "
            >
              <option value="All">
                All categories
              </option>

              {categories.map((item) => (
                <option key={item.id} value={item.name}>{item.name}</option>
              ))}
            </select>

            {/* PRICE */}
            <select
              value={priceFilter}
              onChange={(e) => {
                resetPage();
                setPriceFilter(
                  e.target
                    .value as PriceFilter
                );
              }}
              className="
                rounded-xl
                border
                border-[var(--bidora-border)]
                bg-[var(--bidora-surface)]
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
              onChange={(e) => {
                resetPage();
                setStatusFilter(
                  e.target
                    .value as StatusFilter
                );
              }}
              className="
                rounded-xl
                border
                border-[var(--bidora-border)]
                bg-[var(--bidora-surface)]
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
              onChange={(e) => {
                resetPage();
                setSort(
                  e.target
                    .value as SortOption
                );
              }}
              className="
                rounded-xl
                border
                border-[var(--bidora-border)]
                bg-[var(--bidora-surface)]
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
        <div id="auction-results" className="mt-10 mb-6 scroll-mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--bidora-text)]">
            {category === "All" ? "Active auctions" : `${category} auctions`}
          </h2>

          {!isLoading && !loadError && (
            <p aria-live="polite" className="mt-1 text-sm text-[var(--bidora-text-secondary)]">
              {filteredAuctions.length === 0 ? "0 auctions found" :
                `Showing ${startIndex + 1}–${Math.min(startIndex + pageSize, filteredAuctions.length)} of ${filteredAuctions.length} auctions`}
            </p>
          )}
        </div>

        {/* GRID */}
        {isLoading ? (
          <p className="text-[var(--bidora-text-secondary)]">
            Loading auctions...
          </p>
        ) : loadError ? (
          <p role="alert" className="py-12 text-center text-red-600">{loadError}</p>
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
            {visibleAuctions.map(
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
              bg-[var(--bidora-surface)]
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
        {!isLoading && !loadError && totalPages > 1 && (
          <nav aria-label="Auction pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}
              className="rounded-xl border border-[var(--bidora-border)] bg-[var(--bidora-surface)] px-4 py-3 disabled:cursor-not-allowed disabled:opacity-40">
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button key={page} type="button" aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined} onClick={() => changePage(page)}
                className={`min-w-11 rounded-xl border px-3 py-3 ${currentPage === page
                  ? "border-[var(--bidora-primary)] bg-[var(--bidora-primary)] text-white"
                  : "border-[var(--bidora-border)] bg-[var(--bidora-surface)] hover:border-[var(--bidora-primary)]"}`}>
                {page}
              </button>
            ))}
            <button type="button" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}
              className="rounded-xl border border-[var(--bidora-border)] bg-[var(--bidora-surface)] px-4 py-3 disabled:cursor-not-allowed disabled:opacity-40">
              Next
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}