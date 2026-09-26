"use client";

import { API_URL } from "@/lib/api";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import AuctionCountdown from "./AuctionCountdown";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AuctionCardProps = {
  id: number;
  title: string;
  category: string;
  currentBid: number;
  bids: number;
  image: string;
  endsAt: string;

  isFavourite?: boolean;

  bidStatus?:
  | "highest"
  | "outbid"
  | "won"
  | "lost";

  showFavouriteButton?: boolean;

  showEditButton?: boolean;
  canEdit?: boolean;

  showDeleteButton?: boolean;
  canDelete?: boolean;

  sellerResult?: {
    username: string;
    amount: number;
  } | null;

  showNoBidsResult?: boolean;

  onFavouriteChange?: (
    auctionId: number,
    isFavourite: boolean
  ) => void;

  onDelete?: (
    auctionId: number
  ) => void;
};

type AuctionStatus =
  | "active"
  | "ending-soon"
  | "ended";

function getAuctionStatus(
  endsAt: string
): AuctionStatus {
  const endTime =
    new Date(endsAt).getTime();

  if (Number.isNaN(endTime)) {
    return "active";
  }

  const difference =
    endTime - Date.now();

  if (difference <= 0) {
    return "ended";
  }

  const oneDay =
    24 * 60 * 60 * 1000;

  if (difference <= oneDay) {
    return "ending-soon";
  }

  return "active";
}

export default function AuctionCard({
  id,
  title,
  category,
  currentBid,
  bids,
  image,
  endsAt,

  isFavourite = false,
  bidStatus,

  showFavouriteButton = true,

  showEditButton = false,
  canEdit = true,

  showDeleteButton = false,
  canDelete = false,

  sellerResult,
  showNoBidsResult = false,

  onFavouriteChange,
  onDelete,
}: AuctionCardProps) {
  const [favourite, setFavourite] =
    useState(isFavourite);

  const [
    isUpdatingFavourite,
    setIsUpdatingFavourite,
  ] = useState(false);

  const [status, setStatus] =
    useState<AuctionStatus>(
      () =>
        getAuctionStatus(endsAt)
    );

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const [
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  ] = useState(false);

  /*
    Sync favourite state
    όταν αλλάζει το prop από τον parent.
  */
  useEffect(() => {
    setFavourite(
      isFavourite
    );
  }, [isFavourite]);

  /*
    Update auction status every minute.
  */
  useEffect(() => {
    setStatus(
      getAuctionStatus(endsAt)
    );

    const interval =
      setInterval(() => {
        setStatus(
          getAuctionStatus(
            endsAt
          )
        );
      }, 60_000);

    return () =>
      clearInterval(
        interval
      );
  }, [endsAt]);

  async function handleFavourite(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (
      isUpdatingFavourite
    ) {
      return;
    }

    setIsUpdatingFavourite(
      true
    );

    try {
      const response =
        await fetch(
          `${API_URL}/api/favourites/${id}`,
          {
            method: favourite
              ? "DELETE"
              : "POST",

            credentials:
              "include",
          }
        );

      if (
        response.status ===
        401
      ) {
        window.location.href =
          "/login";

        return;
      }

      if (!response.ok) {
        const result = await response.json();

        toast.error(
          result.message ||
          "Could not update favourite."
        );

        return;
      }

      const newFavouriteState =
        !favourite;

      setFavourite(
        newFavouriteState
      );

      onFavouriteChange?.(
        id,
        newFavouriteState
      );
    } catch (error) {
      console.error(
        "Favourite request failed:",
        error
      );

      toast.error(
        "Could not update favourite."
      );
    } finally {
      setIsUpdatingFavourite(
        false
      );
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true);

      const response =
        await fetch(
          `${API_URL}/api/auctions/${id}`,
          {
            method: "DELETE",
            credentials:
              "include",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        toast.error(
          result.message ||
          "Could not delete auction."
        );

        return;
      }

      /*
        Κλείνουμε πρώτα
        το dialog.
      */
      setIsDeleteDialogOpen(
        false
      );

      toast.success(
        "Auction deleted successfully."
      );

      /*
        Περιμένουμε λίγο πριν
        αφαιρεθεί το card από
        τον parent ώστε να προλάβει
        το dialog να κάνει cleanup.
      */
      setTimeout(() => {
        onDelete?.(id);
      }, 150);
    } catch (error) {
      console.error(
        "DELETE AUCTION ERROR:",
        error
      );

      toast.error(
        "Could not connect to the server."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <article
        className="
          group
          w-full
          max-w-[320px]
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
        {/* IMAGE */}
        <div
          className="
            relative
            aspect-[4/3]
            overflow-hidden
            bg-gray-100
          "
        >
          <Link
            href={`/auctions/${id}`}
          >
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
              <div
                className="
                  flex
                  h-full
                  items-center
                  justify-center
                  text-sm
                  text-gray-400
                "
              >
                Auction image
              </div>
            )}
          </Link>

          {/* STATUS */}
          <span
            className={`
              absolute
              left-3
              top-3
              rounded-full
              px-3
              py-1
              text-xs
              font-semibold

              ${status ===
                "ending-soon"
                ? "bg-[var(--bidora-accent)] text-white"
                : status ===
                  "ended"
                  ? "bg-gray-500 text-white"
                  : "bg-[var(--bidora-primary)] text-white"
              }
            `}
          >
            {status ===
              "ending-soon"
              ? "Ending soon"
              : status ===
                "ended"
                ? "Ended"
                : "Active"}
          </span>

          {/* BID STATUS */}
          {bidStatus && (
            <span
              className={`
                absolute
                bottom-3
                left-3
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold

                ${bidStatus ===
                  "highest"
                  ? "bg-green-100 text-green-700"
                  : bidStatus ===
                    "outbid"
                    ? "bg-orange-100 text-orange-700"
                    : bidStatus ===
                      "won"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                }
              `}
            >
              {bidStatus ===
                "highest"
                ? "Highest bid"
                : bidStatus ===
                  "outbid"
                  ? "Outbid"
                  : bidStatus ===
                    "won"
                    ? "Won"
                    : "Lost"}
            </span>
          )}

          {/* FAVOURITE */}
          {showFavouriteButton && (
            <button
              type="button"
              onClick={
                handleFavourite
              }
              disabled={
                isUpdatingFavourite
              }
              aria-label={
                favourite
                  ? "Remove from favourites"
                  : "Add to favourites"
              }
              className="
                absolute
                right-3
                top-3
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white
                shadow-sm
                transition
                hover:scale-105
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <Heart
                size={20}
                className={
                  favourite
                    ? "fill-[var(--bidora-accent)] text-[var(--bidora-accent)]"
                    : "text-[var(--bidora-text)]"
                }
              />
            </button>
          )}

          {/* SELLER ACTIONS */}
          {(showEditButton ||
            showDeleteButton) &&
            (canEdit ||
              canDelete) && (
              <div
                className="
                  absolute
                  bottom-3
                  right-3
                  flex
                  items-center
                  gap-2
                "
              >
                {showDeleteButton &&
                  canDelete && (
                    <button
                      type="button"
                      onClick={(
                        event
                      ) => {
                        event.preventDefault();
                        event.stopPropagation();

                        setIsDeleteDialogOpen(
                          true
                        );
                      }}
                      disabled={
                        isDeleting
                      }
                      className="
                        rounded-lg
                        bg-white
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        text-red-600
                        shadow-sm
                        transition
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      Delete
                    </button>
                  )}

                {showEditButton &&
                  canEdit && (
                    <Link
                      href={`/profile/auctions/${id}/edit`}
                      className="
                        rounded-lg
                        bg-white
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        text-[var(--bidora-primary)]
                        shadow-sm
                        transition
                        hover:bg-[var(--bidora-background)]
                      "
                    >
                      Edit
                    </Link>
                  )}
              </div>
            )}
        </div>

        {/* CONTENT */}
        <Link
          href={`/auctions/${id}`}
        >
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
                  {bids}{" "}
                  {bids === 1
                    ? "bid"
                    : "bids"}
                </p>

                <div className="mt-1 text-sm">
                  <AuctionCountdown
                    endsAt={
                      endsAt
                    }
                    compact
                  />
                </div>
              </div>
            </div>

            {/* SELLER RESULT */}
            {status ===
              "ended" &&
              sellerResult && (
                <div
                  className="
                    mt-4
                    border-t
                    border-[var(--bidora-border)]
                    pt-4
                  "
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-[var(--bidora-text-secondary)]">
                        Sold to
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[var(--bidora-text)]">
                        {
                          sellerResult.username
                        }
                      </p>
                    </div>

                    <p className="text-sm font-bold text-[var(--bidora-primary)]">
                      €
                      {
                        sellerResult.amount
                      }
                    </p>
                  </div>
                </div>
              )}

            {status ===
              "ended" &&
              showNoBidsResult && (
                <div
                  className="
                    mt-4
                    border-t
                    border-[var(--bidora-border)]
                    pt-4
                  "
                >
                  <p className="text-sm font-medium text-[var(--bidora-text-secondary)]">
                    Ended with no bids
                  </p>
                </div>
              )}
          </div>
        </Link>
      </article>

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={
          isDeleteDialogOpen
        }
        onOpenChange={
          setIsDeleteDialogOpen
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this auction?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot
              be undone. The auction
              will be permanently
              removed from Bidora.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={
                isDeleting
              }
            >
              Keep auction
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={
                handleDelete
              }
              disabled={
                isDeleting
              }
              className="
                bg-red-600
                text-white
                hover:bg-red-700
                disabled:opacity-60
              "
            >
              {isDeleting
                ? "Deleting..."
                : "Delete auction"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}