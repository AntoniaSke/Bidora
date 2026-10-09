import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { categories } from "../../data/categories";

export default function PopularCategories({ showAll = false }: { showAll?: boolean }) {
  const displayedCategories = showAll ? categories : categories.filter((category) => category.popular);
  return (
    <section id="categories" className="hero-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--bidora-accent)]">
              {showAll ? "Browse the marketplace" : "Popular categories"}
            </p>

            {showAll ? (
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-[var(--bidora-text)]">All categories</h1>
            ) : (
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[var(--bidora-text)]">Explore by category</h2>
            )}
            {showAll && (
              <p className="mt-4 text-[var(--bidora-text-secondary)]">
                Explore {categories.length} categories and find your next winning bid.
              </p>
            )}
          </div>

          {!showAll && (
          <Link
            href="/categories"
            className="hidden sm:block font-semibold text-[var(--bidora-primary)] hover:underline"
          >
            View all categories →
          </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCategories.map((category) => (
            <Link
              key={category.id}
              href={`/auctions?category=${encodeURIComponent(category.name)}`}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                aspect-[4/3]
                bg-[var(--bidora-surface-muted)]
              "
            >

              <img
                src={category.image}
                alt=""
                loading="lazy"
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/60
                  via-black/10
                  to-transparent
                "
              />

              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">

                <div>
                  <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                  {showAll && <p className="mt-2 text-sm text-white/90">{category.description}</p>}
                </div>

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[var(--bidora-surface)]
                    text-[var(--bidora-primary)]
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                  "
                >
                  <ArrowUpRight size={20} />
                </div>

              </div>
            </Link>
          ))}
        </div>
        {!showAll && (
          <Link href="/categories" className="mt-6 inline-block font-semibold text-[var(--bidora-primary)] sm:hidden">
            View all categories →
          </Link>
        )}

      </div>
    </section>
  );
}
