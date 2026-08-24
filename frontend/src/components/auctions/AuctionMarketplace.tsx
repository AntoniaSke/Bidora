"use client";

import { useMemo, useState } from "react";
import AuctionSearch from "./AuctionSearch";
import AuctionGrid from "./AuctionGrid";
import { auctions } from "../../data/auction";

export default function AuctionMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const filteredAuctions = useMemo(() => {
    return auctions.filter((auction) => {
      const matchesSearch =
        auction.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        auction.category
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        category === "All" || auction.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, category]);

  return (
    <>
      <AuctionSearch
        searchTerm={searchTerm}
        category={category}
        resultCount={filteredAuctions.length}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategory}
      />

      <AuctionGrid auctions={filteredAuctions} />
    </>
  );
}