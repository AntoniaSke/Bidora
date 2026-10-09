"use client";

import { categories } from "@/src/data/categories";
import { API_URL } from "@/lib/api";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Camera, Headphones, Palette, Zap, Tag, Search } from "lucide-react";
import Link from "next/link";
import { socket } from "@/lib/socket";
import AuctionCountdown from "@/src/components/auctions/AuctionCountdown";
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
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

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
            `${API_URL}/api/auctions`
          ),

          fetch(
            `${API_URL}/api/favourites`,
            {
              credentials: "include",
            }
          ),

          fetch(
            `${API_URL}/api/auth/me`,
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
          ).getTime() > now;

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
    now,
  ]);

  const homepageAuctions =
    filteredAuctions.slice(0, 4);

  // Use the existing live catalogue independently of the browse filters.
  const activeAuctions = auctions.filter((auction) =>
    new Date(auction.endsAt).getTime() > now && auction.image && auction.sellerId !== currentUserId
  );
  const heroAuctions: Auction[] = [];
  for (const preferred of ["Photography", "Electronics", "Art"]) {
    const auction = activeAuctions.find((item) => item.category === preferred);
    if (auction) heroAuctions.push(auction);
  }
  for (const auction of activeAuctions) {
    if (heroAuctions.length === 3) break;
    if (!heroAuctions.some((item) => item.id === auction.id)) heroAuctions.push(auction);
  }

  return (
    <>
      <section className="bidora-hero" aria-labelledby="hero-title">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow"><span /> Live auctions · Unique finds</p>
            <h1 id="hero-title">Discover your next <span>great find.</span></h1>
            <p className="hero-description">Bid on unique pieces, discover everyday favourites, and make your next great find yours.</p>
            <div className="hero-actions">
              <Link href="/auctions" className="hero-primary">Explore auctions <ArrowRight size={20} /></Link>
              <Link href="/sell" className="hero-secondary">Start selling</Link>
            </div>
            <div className="hero-benefits"><span><Zap size={18} /> Real-time bidding</span><span><Tag size={18} /> Finds for every budget</span></div>
            <div className="hero-categories" aria-label="Explore categories">
              {[{ name: "Electronics", icon: Headphones }, { name: "Collectibles", icon: Camera }, { name: "Art", icon: Palette }].map(({ name, icon: Icon }) => (
                <Link key={name} href={`/auctions?category=${encodeURIComponent(name)}`}><Icon size={17} />{name}</Link>
              ))}
              <Link href="/categories">All categories <ArrowRight size={16} /></Link>
            </div>
          </div>
          <div className="hero-showcase" aria-label="Featured live auctions">
            {isLoading ? <div className="hero-placeholder" role="status">Finding your next great find…</div> : heroAuctions.length ? heroAuctions.map((auction, index) => (
              <Link key={auction.id} href={`/auctions/${auction.id}`} className={`hero-auction hero-auction-${index}`}>
                <div className="hero-auction-image"><img src={auction.image} alt={auction.title} /></div>
                <div className="hero-auction-body">
                  <h2>{auction.title}</h2><p>{auction.category}</p>
                  <div className="hero-auction-bid">
                    <div><span>Current bid</span><strong>{new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(auction.currentBid)}</strong></div>
                    {index === 0 && <span className="hero-countdown"><AuctionCountdown endsAt={auction.endsAt} compact /></span>}
                  </div>
                  {index === 0 && <span className="hero-view">View auction <ArrowRight size={16} /></span>}
                </div>
              </Link>
            )) : <div className="hero-placeholder"><Camera size={48} /><h2>Great finds are on their way.</h2><Link href="/sell">Be the first to list an item →</Link></div>}
          </div>
        </div>
      </section>
      {/* SEARCH / FILTER SECTION */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--bidora-accent)]">
              Browse auctions
            </p>

            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[var(--bidora-text)]">
              Find what you&apos;re looking for
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

            <select
              aria-label="Category"
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
                bg-[var(--bidora-surface)]
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

              {categories.map((item) => (
                <option key={item.id} value={item.name}>{item.name}</option>
              ))}
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
                bg-[var(--bidora-surface)]
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