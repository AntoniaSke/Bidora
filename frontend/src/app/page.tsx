import Navbar from "../components/Navbar";
import AuctionMarketplace from "../components/AuctionMarketplace";
import PopularCategories from "../components/PopularCategories";

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
              px-2 sm:px-4 lg:px-6
              pt-12 sm:pt-16 lg:pt-20
              pb-12 sm:pb-16 lg:pb-20
            "
                    >
                        <p
                            className="
                text-xs sm:text-sm
                font-semibold
                uppercase
                tracking-[0.12em] sm:tracking-[0.16em]
                text-[var(--bidora-accent)]
              "
                        >
                            Live auction marketplace
                        </p>

                        <h1
                            className="
                mt-4
                text-2xl
                sm:text-4xl
                lg:text-5xl
                xl:text-6xl
                font-bold
                tracking-tight
                leading-[1.05]
                max-w-4xl
              "
                        >
                            Find it. Bid on it.
                            <br />

                            <span className="text-[var(--bidora-primary)]">
                                Make it yours.
                            </span>
                        </h1>

                        <p
                            className="
                mt-6
                text-base
                sm:text-lg
                lg:text-xl
                text-[var(--bidora-text-secondary)]
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
                  bg-[var(--bidora-primary)]
                  text-white
                  px-6 sm:px-7
                  py-3 sm:py-3.5
                  rounded-xl
                  font-semibold
                  hover:bg-[var(--bidora-primary-hover)]
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
                  border-[var(--bidora-border)]
                  bg-white
                  px-6
                  py-3
                  rounded-xl
                  font-medium
                  hover:border-[var(--bidora-primary)]
                  transition
                  text-center
                "
                            >
                                How it works
                            </a>
                        </div>
                    </div>
                </section>

                <AuctionMarketplace />
                <PopularCategories />

            </main>
        </>
    );
}