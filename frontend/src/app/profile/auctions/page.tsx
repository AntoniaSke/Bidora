import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout//Footer";
import ProfileForm from "@/src/components/profile/ProfileForm";
import ProfileNav from "@/src/components/profile/ProfileNav";

export default function MyAuctionsPage() {
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
              My Auctions
            </h1>

            <p className="mt-4 text-[var(--bidora-text-secondary)]">
              Manage the items you're selling on Bidora.
            </p>
          </div>

          <div className="mt-10">
            <ProfileNav />

            <div className="rounded-2xl border border-dashed border-[var(--bidora-border)] bg-white py-20 px-6 text-center">
              <h2 className="text-xl font-bold text-[var(--bidora-text)]">
                You haven't created any auctions yet
              </h2>

              <p className="mt-2 text-[var(--bidora-text-secondary)]">
                Create your first auction and start receiving bids.
              </p>

              <a
                href="/sell"
                className="
                  mt-6
                  inline-block
                  rounded-xl
                  bg-[var(--bidora-accent)]
                  px-6
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                "
              >
                Create an auction
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}