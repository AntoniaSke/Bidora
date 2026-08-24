import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout//Footer";
import ProfileForm from "@/src/components/profile/ProfileForm";
import ProfileNav from "@/src/components/profile/ProfileNav";

export default function MyBidsPage() {
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
              My Bids
            </h1>

            <p className="mt-4 text-[var(--bidora-text-secondary)]">
              Keep track of the auctions you've participated in.
            </p>
          </div>

          <div className="mt-10">
            <ProfileNav />

            <div className="rounded-2xl border border-dashed border-[var(--bidora-border)] bg-white py-20 px-6 text-center">
              <h2 className="text-xl font-bold text-[var(--bidora-text)]">
                No bids yet
              </h2>

              <p className="mt-2 text-[var(--bidora-text-secondary)]">
                Once you place a bid, the auction will appear here.
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
                  transition
                  hover:bg-[var(--bidora-primary-hover)]
                "
              >
                Explore auctions
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}