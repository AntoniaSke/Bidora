"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import AuctionCard from "./AuctionCard";
import { auctions } from "../../data/auction";

export default function AuctionExplorer() {
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("ending-soon");

    const filteredAuctions = useMemo(() => {
        const filtered = auctions.filter((auction) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                auction.title.toLowerCase().includes(search) ||
                auction.category.toLowerCase().includes(search);

            const matchesCategory =
                category === "All" || auction.category === category;

            return matchesSearch && matchesCategory;
        });

        return filtered;
    }, [searchTerm, category]);

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