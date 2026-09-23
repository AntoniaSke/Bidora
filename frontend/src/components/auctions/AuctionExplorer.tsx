"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

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
};

export default function AuctionExplorer() {
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("ending-soon");
    const [favouriteIds, setFavouriteIds] = useState<number[]>(
        []
    );
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] =
        useState<number | null>(null);

    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        async function loadData() {
            try {
                const [
                    auctionsResponse,
                    favouritesResponse,
                    userResponse,
                ] = await Promise.all([
                    fetch("http://localhost:4000/api/auctions"),

                    fetch("http://localhost:4000/api/favourites", {
                        credentials: "include",
                    }),

                    fetch("http://localhost:4000/api/auth/me", {
                        credentials: "include",
                    }),
                ]);

                if (auctionsResponse.ok) {
                    const auctionsData =
                        await auctionsResponse.json();

                    setAuctions(auctionsData);
                }

                if (favouritesResponse.ok) {
                    const favouritesData =
                        await favouritesResponse.json();

                    const ids = favouritesData.map(
                        (auction: { id: number }) => auction.id
                    );

                    setFavouriteIds(ids);
                }

                if (userResponse.ok) {
                    const user = await userResponse.json();

                    setCurrentUserId(user.id);
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

        const interval = setInterval(() => {
            setNow(Date.now());
        }, 60_000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const filteredAuctions = useMemo(() => {
        return auctions.filter((auction) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                auction.title.toLowerCase().includes(search) ||
                auction.category.toLowerCase().includes(search);

            const matchesCategory =
                category === "All" ||
                auction.category === category;

            const isNotOwnAuction =
                currentUserId === null ||
                auction.sellerId !== currentUserId;

            const isActive =
                new Date(auction.endsAt).getTime() > now;

            return (
                matchesSearch &&
                matchesCategory &&
                isNotOwnAuction &&
                isActive
            );
        });
    }, [
        auctions,
        searchTerm,
        category,
        currentUserId,
        now,
    ]);

    return (
        <section className="pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Search */}
                <div className="relative">
                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search auctions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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

                {/* Filters */}
                <div
                    className="
                        mt-5
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-4
                    "
                >
                    <div className="flex flex-wrap gap-3">

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
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
                            <option value="All">All categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Collectibles">Collectibles</option>
                            <option value="Art">Art</option>
                            <option value="Home">Home</option>
                        </select>

                        <select
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
                            <option>Any price</option>
                            <option>Under €50</option>
                            <option>€50 - €100</option>
                            <option>€100 - €250</option>
                            <option>€250+</option>
                        </select>

                        <select
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
                            <option>All statuses</option>
                            <option>Ending soon</option>
                            <option>Newly listed</option>
                        </select>

                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal
                            size={18}
                            className="text-[var(--bidora-text-secondary)]"
                        />

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
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

                {/* Results count */}
                <div className="mt-10 mb-6 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--bidora-text)]">
                            Active auctions
                        </h2>

                        <p className="mt-1 text-sm text-[var(--bidora-text-secondary)]">
                            {filteredAuctions.length} auctions found
                        </p>
                    </div>
                </div>

                {/* Grid */}
                {filteredAuctions.length > 0 ? (
                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-4
                            gap-6
                            "
                    >
                        {filteredAuctions.map((auction) => (
                            <AuctionCard
                                key={auction.id}
                                id={auction.id}
                                title={auction.title}
                                category={auction.category}
                                currentBid={auction.currentBid}
                                bids={auction.bids}
                                image={auction.image}
                                endsAt={auction.endsAt}
                                isFavourite={favouriteIds.includes(auction.id)}
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
                            py-20
                            text-center
                            "
                    >
                        <p className="text-lg font-semibold text-[var(--bidora-text)]">
                            No auctions found
                        </p>

                        <p className="mt-2 text-[var(--bidora-text-secondary)]">
                            Try changing your search or filters.
                        </p>
                    </div>
                )}

                {/* Demo load more */}
                <div className="mt-12 flex justify-center">
                    <button
                        type="button"
                        className="
                            rounded-xl
                            border
                            border-[var(--bidora-primary)]
                            px-7
                            py-3
                            font-semibold
                            text-[var(--bidora-primary)]
                            transition
                            hover:bg-[var(--bidora-primary)]
                            hover:text-white
                            "
                    >
                        Load more
                    </button>
                </div>

            </div>
        </section>
    );
}