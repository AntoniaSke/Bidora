"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Bid = {
  id: number;
  amount: number;
  createdAt: string;

  user: {
    id: number;
    username: string;
  };
};

type BidHistoryModalProps = {
  auctionId: number;
  bidCount: number;
  currentUserId: number | null;
};

export default function BidHistoryModal({
  auctionId,
  bidCount,
  currentUserId,
}: BidHistoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    async function loadBids() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:4000/api/bids/auctions/${auctionId}`
        );

        if (!response.ok) {
          const result = await response.json();

          setError(
            result.message ||
              "Could not load bid history."
          );

          return;
        }

        const data = await response.json();

        setBids(data);
      } catch (error) {
        console.error(
          "Could not load bid history:",
          error
        );

        setError(
          "Could not connect to the server."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadBids();
  }, [isOpen, auctionId, bidCount]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="
          text-sm
          font-medium
          text-[var(--bidora-primary)]
          transition
          hover:text-[var(--bidora-accent)]
          hover:underline
        "
      >
        View history
      </button>

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/30
            px-4
          "
          onClick={() => setIsOpen(false)}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-[var(--bidora-border)]
              bg-white
              shadow-xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* HEADER */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[var(--bidora-border)]
                px-5
                py-4
              "
            >
              <div>
                <h2 className="text-lg font-bold text-[var(--bidora-text)]">
                  Bid history
                </h2>

                <p className="mt-0.5 text-sm text-[var(--bidora-text-secondary)]">
                  {bidCount}{" "}
                  {bidCount === 1
                    ? "bid"
                    : "bids"}{" "}
                  placed
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsOpen(false)
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  transition
                  hover:bg-gray-100
                "
                aria-label="Close bid history"
              >
                <X size={18} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="max-h-[420px] overflow-y-auto">

              {isLoading ? (
                <p className="px-5 py-8 text-sm text-[var(--bidora-text-secondary)]">
                  Loading bid history...
                </p>
              ) : error ? (
                <p className="px-5 py-8 text-sm text-red-500">
                  {error}
                </p>
              ) : bids.length === 0 ? (
                <p className="px-5 py-8 text-sm text-[var(--bidora-text-secondary)]">
                  No bids have been placed yet.
                </p>
              ) : (
                <div>
                  {bids.map((bid, index) => {
                    const isCurrentUser =
                      currentUserId ===
                      bid.user.id;

                    return (
                      <div
                        key={bid.id}
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          border-b
                          border-[var(--bidora-border)]
                          px-5
                          py-4
                          last:border-b-0
                        "
                      >
                        <div>
                          <p className="font-medium text-[var(--bidora-text)]">
                            {isCurrentUser
                              ? "You"
                              : bid.user.username}
                          </p>

                          <p className="mt-1 text-xs text-[var(--bidora-text-secondary)]">
                            {new Date(
                              bid.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-[var(--bidora-primary)]">
                            €{bid.amount}
                          </p>

                          {index === 0 && (
                            <p className="mt-1 text-xs font-medium text-green-600">
                              Highest
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}