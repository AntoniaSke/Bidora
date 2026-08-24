import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import AuctionExplorer from "../../components/auctions/AuctionExplorer"

export default function AuctionsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--bidora-accent)]">
            Explore auctions
          </p>

          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-[var(--bidora-text)]">
            Find your next winning bid.
          </h1>

          <p className="mt-4 max-w-2xl text-base sm:text-lg text-[var(--bidora-text-secondary)]">
            Browse active auctions, filter by category and find items worth bidding on.
          </p>
        </section>

        <AuctionExplorer />
      </main>

      <Footer />
    </>
  );
}