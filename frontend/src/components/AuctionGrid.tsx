import AuctionCard from "./AuctionCard";

type Auction = {
  id: number;
  title: string;
  category: string;
  currentBid: number;
  bids: number;
  image?: string;
};

type AuctionGridProps = {
  auctions: Auction[];
};

export default function AuctionGrid({
  auctions,
}: AuctionGridProps) {
  return (
    <section className="hero-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--bidora-accent)]">
              Live auctions
            </p>

            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[var(--bidora-text)]">
              Ending soon
            </h2>
          </div>

          <a
            href="/auctions"
            className="hidden sm:block font-semibold text-[var(--bidora-primary)] hover:underline"
          >
            View all →
          </a>
        </div>

        {auctions.length > 0 ? (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-6
            "
          >
            {auctions.map((auction) => (
              <AuctionCard
                key={auction.id}
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
              py-20
              text-center
              border
              border-dashed
              border-[var(--bidora-border)]
              rounded-2xl
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

      </div>
    </section>
  );
}