import { Search, Gavel, Trophy } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Explore auctions, browse categories and find items worth bidding on.",
    icon: Search,
  },
  {
    number: "02",
    title: "Bid",
    description:
      "Place your bid and follow the auction as other buyers compete in real time.",
    icon: Gavel,
  },
  {
    number: "03",
    title: "Win",
    description:
      "Have the highest bid when the timer ends and the item is yours.",
    icon: Trophy,
  },
];

export default function HowItWorks() {
  return (
    <section  id="how-it-works" className="bg-[var(--bidora-primary)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">

        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--bidora-accent)]">
            How Bidora Works
          </p>

          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            From discovery to winning bid.
          </h2>

          <p className="mt-5 text-base sm:text-lg text-white/70 leading-relaxed">
            Find something you love, join the auction and compete for the winning bid.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="
                  group
                  border-t
                  border-white/20
                  pt-6
                "
              >
                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-[var(--bidora-accent)]">
                    {step.number}
                  </span>

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-white/10
                      transition
                      duration-300
                      group-hover:bg-[var(--bidora-accent)]
                      group-hover:-translate-y-1
                    "
                  >
                    <Icon size={20} />
                  </div>

                </div>

                <h3 className="mt-7 text-2xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 text-white/65 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}