import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import AuctionExplorer from "@/src/components/auctions/AuctionExplorer";

export default function AuctionsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 lg:pt-20">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--bidora-accent)]">
              Explore auctions
            </p>

            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-[var(--bidora-text)]">
              Find your next winning bid.
            </h1>

            <p className="mt-4 text-lg text-[var(--bidora-text-secondary)]">
              Browse active auctions, filter by category and find items worth bidding on.
            </p>
          </div>
        </section>

        <AuctionExplorer />
      </main>

      <Footer />
    </>
  );
}