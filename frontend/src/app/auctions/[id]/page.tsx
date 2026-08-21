import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { auctions } from "../../../data/auction";

type AuctionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AuctionPage({
  params,
}: AuctionPageProps) {
  const { id } = await params;

  const auction = auctions.find(
    (auction) => auction.id === Number(id)
  );

  if (!auction) {
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
                  {auction.seller}
                </span>
              </p>

              {/* BID INFO */}
              <div
                className="
                  mt-8
                  rounded-2xl
                  border
                  border-[var(--bidora-border)]
                  bg-white
                  p-6
                "
              >
                <div className="flex items-end justify-between gap-6">

                  <div>
                    <p className="text-sm text-[var(--bidora-text-secondary)]">
                      Current bid
                    </p>

                    <p className="mt-1 text-4xl font-bold text-[var(--bidora-primary)]">
                      €{auction.currentBid}
                    </p>

                    <p className="mt-2 text-sm text-[var(--bidora-text-secondary)]">
                      {auction.bids} bids
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-[var(--bidora-text-secondary)]">
                      Time remaining
                    </p>

                    <p className="mt-1 text-xl font-semibold text-[var(--bidora-accent)]">
                      02:14:36
                    </p>
                  </div>

                </div>

                {/* BID FORM */}
                <div className="mt-7">

                  <label
                    htmlFor="bid"
                    className="text-sm font-medium text-[var(--bidora-text)]"
                  >
                    Your bid
                  </label>

                  <div className="mt-2 flex flex-col sm:flex-row gap-3">

                    <div className="relative flex-1">
                      <span
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-[var(--bidora-text-secondary)]
                        "
                      >
                        €
                      </span>

                      <input
                        id="bid"
                        type="number"
                        placeholder={`${auction.currentBid + 1}`}
                        className="
                          w-full
                          rounded-xl
                          border
                          border-[var(--bidora-border)]
                          bg-white
                          py-3.5
                          pl-8
                          pr-4
                          outline-none
                          focus:border-[var(--bidora-primary)]
                        "
                      />
                    </div>

                    <button
                      type="button"
                      className="
                        rounded-xl
                        bg-[var(--bidora-primary)]
                        px-7
                        py-3.5
                        font-semibold
                        text-white
                        transition
                        hover:bg-[var(--bidora-primary-hover)]
                      "
                    >
                      Place bid
                    </button>

                  </div>

                  <p className="mt-2 text-xs text-[var(--bidora-text-secondary)]">
                    Enter an amount higher than the current bid.
                  </p>
                </div>

              </div>

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