import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout//Footer";
import ProfileForm from "@/src/components/profile/ProfileForm";
import ProfileNav from "@/src/components/profile/ProfileNav";
import AuctionCard from "@/src/components/auctions/AuctionCard";
import { auctions } from "@/src/data/auction";

export default function FavouritesPage() {
  const favouriteAuctions = auctions.slice(0, 3);

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--bidora-accent)]">
              Your account
            </p>

            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-[var(--bidora-text)]">
              Favourites
            </h1>

            <p className="mt-4 text-[var(--bidora-text-secondary)]">
              Auctions you've saved to keep an eye on.
            </p>
          </div>

          <div className="mt-10">
            <ProfileNav />

            {favouriteAuctions.length > 0 ? (
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
                {favouriteAuctions.map((auction) => (
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
                <h2 className="text-xl font-bold text-[var(--bidora-text)]">
                  No favourites yet
                </h2>

                <p className="mt-2 text-[var(--bidora-text-secondary)]">
                  Save auctions you're interested in and they'll appear here.
                </p>

                <a
                  href="/auctions"
                  className="
                    mt-6
                    inline-block
                    rounded-xl
                    bg-[var(--bidora-primary)]
                    px-6
                    py-3
                    font-semibold
                    text-white
                  "
                >
                  Explore auctions
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}