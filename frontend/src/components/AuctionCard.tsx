type AuctionCardProps = {
  title: string;
  category: string;
  currentBid: number;
  bids: number;
  image?: string;
};

export default function AuctionCard({
  title,
  category,
  currentBid,
  bids,
  image,
}: AuctionCardProps) {
  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-[var(--bidora-border)]
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

        {image ? (
          <img
            src={image}
            alt={title}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Auction image
          </div>
        )}

        {/* Badge */}
        <span
          className="
            absolute
            left-3
            top-3
            rounded-full
            bg-[var(--bidora-accent)]
            px-3
            py-1
            text-xs
            font-semibold
            text-white
          "
        >
          Ending soon
        </span>

        {/* Favourite button */}
        <button
          type="button"
          aria-label={`Add ${title} to favourites`}
          className="
            absolute
            right-3
            top-3
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white/90
            text-lg
            shadow-sm
            backdrop-blur
            transition
            hover:scale-110
          "
        >
          ♡
        </button>
      </div>

      {/* Content */}
      <div className="p-5">

        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.12em]
            text-[var(--bidora-accent)]
          "
        >
          {category}
        </p>

        <h3
          className="
            mt-2
            text-lg
            font-bold
            text-[var(--bidora-text)]
            transition-colors
            group-hover:text-[var(--bidora-primary)]
          "
        >
          {title}
        </h3>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-sm text-[var(--bidora-text-secondary)]">
              Current bid
            </p>

            <p className="mt-1 text-xl font-bold text-[var(--bidora-primary)]">
              €{currentBid}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-[var(--bidora-text-secondary)]">
              {bids} bids
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--bidora-accent)]">
              02:14:36 left
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}