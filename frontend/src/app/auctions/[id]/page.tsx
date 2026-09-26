
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import BidPanel from "../../../components/auctions/BidPanel";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:4000";

type AuctionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

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
  hasEnded: boolean;

  winner: {
    userId: number;
    username: string;
    amount: number;
  } | null;

  seller: {
    id: number;
    username: string;
  };
};

export default async function AuctionPage({
  params,
}: AuctionPageProps) {
  const { id } = await params;

  const response = await fetch(
    `${BACKEND_URL}/api/auctions/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <h1 className="text-3xl font-bold">
              Auction not found
            </h1>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const auction: Auction = await response.json();

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* IMAGE */}
            <div>
              <div
                className="
                  aspect-square
                  overflow-hidden
                  rounded-3xl
                  bg-white
                  border
                  border-[var(--bidora-border)]
                "
              >
                {auction.image ? (
                  <img
                    src={auction.image}
                    alt={auction.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[var(--bidora-text-secondary)]">
                    Auction image
                  </div>
                )}
              </div>
            </div>

            {/* DETAILS */}
            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[var(--bidora-accent)]
                "
              >
                {auction.category}
              </p>

              <h1
                className="
                  mt-3
                  text-4xl
                  sm:text-5xl
                  font-bold
                  tracking-tight
                  text-[var(--bidora-text)]
                "
              >
                {auction.title}
              </h1>

              <p className="mt-4 text-[var(--bidora-text-secondary)]">
                Sold by{" "}
                <span className="font-medium text-[var(--bidora-text)]">
                  {auction.seller.username}
                </span>
              </p>

              <BidPanel
                auctionId={auction.id}
                currentBid={auction.currentBid}
                bids={auction.bids}
                endsAt={auction.endsAt}
                sellerId={auction.seller.id}
              />

              {auction.hasEnded && (
                <div
                  className="
      mt-5
      rounded-2xl
      border
      border-[var(--bidora-border)]
      bg-white
      p-5
    "
                >
                  {auction.winner ? (
                    <>
                      <p className="text-sm font-medium text-[var(--bidora-text-secondary)]">
                        Auction winner
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-[var(--bidora-text)]">
                            {auction.winner.username}
                          </p>

                          <p className="mt-1 text-sm text-[var(--bidora-text-secondary)]">
                            Winning bid
                          </p>
                        </div>

                        <p className="text-2xl font-bold text-[var(--bidora-primary)]">
                          €{auction.winner.amount}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-[var(--bidora-text)]">
                        Auction ended
                      </p>

                      <p className="mt-1 text-sm text-[var(--bidora-text-secondary)]">
                        No bids were placed on this auction.
                      </p>
                    </>
                  )}
                </div>
              )}
              {/* DESCRIPTION */}
              <div className="mt-10">
                <h2 className="text-xl font-bold text-[var(--bidora-text)]">
                  About this item
                </h2>

                <p
                  className="
                    mt-4
                    leading-relaxed
                    text-[var(--bidora-text-secondary)]
                  "
                >
                  {auction.description}
                </p>
              </div>

            </div>
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}