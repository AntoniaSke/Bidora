export default function SellerCTA() {
    return (
        <section
  className="
    border-t-4
    border-[var(--bidora-accent)]
    bg-gradient-to-b
    from-[#fff4ef]
    to-[#f7f9fc]
  "
>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">

                <div
                    className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-8
          "
                >
                    {/* Text */}
                    <div className="max-w-2xl">
                        <p
                            className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[var(--bidora-accent)]
              "
                        >
                            Start selling
                        </p>

                        <h2
                            className="
                mt-3
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-bold
                tracking-tight
                text-[var(--bidora-text)]
              "
                        >
                            Have something worth bidding on?
                        </h2>

                        <p
                            className="
                mt-5
                max-w-xl
                text-base
                sm:text-lg
                leading-relaxed
                text-[var(--bidora-text-secondary)]
              "
                        >
                            Create an auction, set your starting price and let buyers
                            compete for it.
                        </p>
                    </div>

                    {/* Button */}
                    <div className="shrink-0">
                        <a
                            href="/sell"
                            className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-[var(--bidora-primary)]
                px-7
                py-3.5
                font-semibold
                text-white
                transition-all
                duration-300
                hover:bg-[var(--bidora-primary-hover)]
                hover:-translate-y-0.5
              "
                        >
                            Start selling →
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}