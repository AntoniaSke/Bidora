import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import SellAuctionForm from "@/src/components/SellAuctionForm";

export default function SellPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--bidora-accent)]">
              Create an auction
            </p>

            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-[var(--bidora-text)]">
              Sell something worth bidding on.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[var(--bidora-text-secondary)]">
              Add the details of your item, choose a starting price and decide
              when the auction should end.
            </p>
          </div>

          <div className="mt-10">
            <SellAuctionForm />
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}