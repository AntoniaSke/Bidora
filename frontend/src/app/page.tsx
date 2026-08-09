import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="hero-background">
          <div
            className="
              max-w-7xl
              mx-auto
              px-4 sm:px-6 lg:px-8
              pt-16 sm:pt-20 lg:pt-24
              pb-20 sm:pb-24 lg:pb-32
            "
          >
            <p
              className="
                text-xs sm:text-sm
                font-semibold
                uppercase
                tracking-[0.16em] sm:tracking-[0.18em]
                text-[var(--accent)]
              "
            >
              Live auction marketplace
            </p>

            <h1
              className="
                mt-4
                text-4xl
                sm:text-5xl
                lg:text-6xl
                xl:text-7xl
                font-bold
                tracking-tight
                leading-[1.05]
                max-w-4xl
              "
            >
              Find it. Bid on it.
              <br />

              <span className="text-[var(--primary)]">
                Make it yours.
              </span>
            </h1>

            <p
              className="
                mt-6
                text-base
                sm:text-lg
                lg:text-xl
                text-[var(--text-secondary)]
                max-w-xl
                leading-relaxed
              "
            >
              Discover unique items and compete in live auctions.
              Find something you love and place your bid.
            </p>

            <div
              className="
                mt-8
                flex
                flex-col
                sm:flex-row
                gap-3 sm:gap-4
                sm:items-center
              "
            >
              <a
                href="/auctions"
                className="
                  bg-[var(--primary)]
                  text-white
                  px-6 sm:px-7
                  py-3 sm:py-3.5
                  rounded-xl
                  font-semibold
                  hover:bg-[var(--primary-hover)]
                  transition-all
                  text-center
                "
              >
                Explore auctions
              </a>

              <a
                href="/how-it-works"
                className="
                  border
                  border-[var(--border)]
                  bg-white
                  px-6
                  py-3
                  rounded-xl
                  font-medium
                  hover:border-[var(--primary)]
                  transition
                  text-center
                "
              >
                How it works
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}