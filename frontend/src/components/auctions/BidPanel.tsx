"use client";

import { API_URL } from "@/lib/api";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { socket } from "@/lib/socket";
import AuctionCountdown from "./AuctionCountdown";
import BidHistoryModal from "./BidHistoryModal";

type BidPanelProps = {
  auctionId: number;
  currentBid: number;
  bids: number;
  endsAt: string;
  sellerId: number;
};

type MyBid = {
  id: number;
  amount: number;
  auctionId: number;
  createdAt: string;
};

type BidPlacedEvent = {
  auctionId: number;

  currentBid: number;

  bids: number;

  bid: {
    id: number;
    amount: number;
    createdAt: string;

    user: {
      id: number;
      username: string;
    };
  };
};

export default function BidPanel({
  auctionId,
  currentBid,
  bids,
  endsAt,
  sellerId,
}: BidPanelProps) {
  const [currentUserId, setCurrentUserId] =
    useState<number | null>(null);

  const [localCurrentBid, setLocalCurrentBid] =
    useState(currentBid);

  const [localBids, setLocalBids] =
    useState(bids);

  const [myLatestBid, setMyLatestBid] =
    useState<number | null>(null);

  const [isHighestBidder, setIsHighestBidder] =
    useState(false);

  const [bidAmount, setBidAmount] =
    useState("");

  const [bidError, setBidError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [
    isLoadingBidStatus,
    setIsLoadingBidStatus,
  ] = useState(true);

  const isOwnAuction =
    currentUserId !== null &&
    currentUserId === sellerId;

  const hasEnded =
    new Date(endsAt).getTime() <=
    Date.now();

  /*
    Load logged-in user and their
    latest bid for this auction.
  */
  useEffect(() => {
    async function loadBidStatus() {
      try {
        const userResponse =
          await fetch(
            `${API_URL}/api/auth/me`,
            {
              credentials: "include",
            }
          );

        /*
          Guest user.
          They can still view auctions
          and receive realtime updates.
        */
        if (!userResponse.ok) {
          return;
        }

        const user =
          await userResponse.json();

        setCurrentUserId(
          user.id
        );

        const bidsResponse =
          await fetch(
            `${API_URL}/api/bids/mine`,
            {
              credentials: "include",
            }
          );

        if (!bidsResponse.ok) {
          return;
        }

        const myBids: MyBid[] =
          await bidsResponse.json();

        /*
          Backend returns newest bids first,
          so the first matching bid is the
          user's latest bid on this auction.
        */
        const latestBid =
          myBids.find(
            (bid) =>
              bid.auctionId ===
              auctionId
          );

        if (!latestBid) {
          return;
        }

        setMyLatestBid(
          latestBid.amount
        );

        setIsHighestBidder(
          latestBid.amount ===
            currentBid
        );
      } catch (error) {
        console.error(
          "Could not load bid status:",
          error
        );
      } finally {
        setIsLoadingBidStatus(
          false
        );
      }
    }

    loadBidStatus();

    socket.connect();

  function handleBidPlaced(
    data: BidPlacedEvent
  ) {
    if (
      data.auctionId !==
      auctionId
    ) {
      return;
    }

    setLocalCurrentBid(
      data.currentBid
    );

    setLocalBids(
      data.bids
    );

    setBidError("");

    /*
      Αν το bid έγινε από τον
      τρέχοντα user.
    */
    if (
      currentUserId !== null &&
      data.bid.user.id ===
        currentUserId
    ) {
      setMyLatestBid(
        data.bid.amount
      );

      setIsHighestBidder(
        true
      );

      return;
    }

    /*
      Αν έκανε bid άλλος user,
      ο προηγούμενος highest bidder
      έχει πλέον γίνει outbid.
    */
    setIsHighestBidder(
      false
    );
  }

  function handleConnectError(
    error: Error
  ) {
    console.error(
      "Socket connection error:",
      error
    );
  }

  socket.on(
    "bid-placed",
    handleBidPlaced
  );

  socket.on(
    "connect_error",
    handleConnectError
  );

  return () => {
    socket.off(
      "bid-placed",
      handleBidPlaced
    );

    socket.off(
      "connect_error",
      handleConnectError
    );
  };
  }, [
    auctionId,
    currentBid,
  ]);

  /*
    REALTIME BIDDING

    Connect to Socket.io and join
    only this auction's room.
  */
  useEffect(() => {
    const socket = io(
      `${API_URL}`,
      {
        withCredentials: true,
      }
    );

    socket.on("connect", () => {
      console.log(
        "Socket connected:",
        socket.id
      );

      socket.emit(
        "join-auction",
        auctionId
      );
    });

    socket.on(
      "bid-placed",
      (
        data: BidPlacedEvent
      ) => {
        /*
          Extra safeguard.
          The room should already ensure
          this, but we verify the auction id.
        */
        if (
          data.auctionId !==
          auctionId
        ) {
          return;
        }

        /*
          Update price and bid count
          immediately without refresh.
        */
        setLocalCurrentBid(
          data.currentBid
        );

        setLocalBids(
          data.bids
        );

        setBidError("");

        /*
          If THIS user placed the bid,
          they are now the highest bidder.
        */
        if (
          currentUserId !== null &&
          data.bid.user.id ===
            currentUserId
        ) {
          setMyLatestBid(
            data.bid.amount
          );

          setIsHighestBidder(
            true
          );

          return;
        }

        /*
          Someone else placed a bid.

          If this user was winning,
          they have now been outbid.
          For users who never bid,
          false is already the correct state.
        */
        setIsHighestBidder(
          false
        );
      }
    );

    socket.on(
      "connect_error",
      (error) => {
        console.error(
          "Socket connection error:",
          error
        );
      }
    );

    return () => {
      socket.emit(
        "leave-auction",
        auctionId
      );

      socket.off(
        "bid-placed"
      );

      socket.disconnect();
    };
  }, [
    auctionId,
    currentUserId,
  ]);

  async function handleBid() {
    setBidError("");

    const amount =
      Number(bidAmount);

    if (
      !bidAmount ||
      Number.isNaN(amount)
    ) {
      setBidError(
        "Enter a valid bid amount."
      );

      return;
    }

    if (
      amount <=
      localCurrentBid
    ) {
      setBidError(
        `Your bid must be higher than €${localCurrentBid}.`
      );

      return;
    }

    if (hasEnded) {
      setBidError(
        "This auction has ended."
      );

      return;
    }

    if (isOwnAuction) {
      setBidError(
        "You cannot bid on your own auction."
      );

      return;
    }

    if (isHighestBidder) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response =
        await fetch(
          `${API_URL}/api/bids/auctions/${auctionId}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body: JSON.stringify({
              amount,
            }),
          }
        );

      const result =
        await response.json();

      if (
        response.status === 401
      ) {
        window.location.href =
          "/login";

        return;
      }

      if (!response.ok) {
        setBidError(
          result.message ||
            "Could not place bid."
        );

        return;
      }

      /*
        We still update immediately
        from REST response.

        Socket.io will send the same values,
        but setting them twice is harmless.

        This makes the bidder's own UI feel
        instant even if the socket event arrives
        a few milliseconds later.
      */
      setLocalCurrentBid(
        result.auction.currentBid
      );

      setLocalBids(
        result.auction.bids
      );

      setMyLatestBid(
        amount
      );

      setIsHighestBidder(
        true
      );

      setBidAmount("");

      toast.success(
        "Your bid was placed successfully."
      );
    } catch (error) {
      console.error(
        "Bid request failed:",
        error
      );

      toast.error(
        "Could not connect to the server."
      );

      setBidError(
        "Could not connect to the server."
      );
    } finally {
      setIsSubmitting(
        false
      );
    }
  }

  return (
    <div
      className="
        mt-8
        rounded-2xl
        border
        border-[var(--bidora-border)]
        bg-white
        p-6
      "
    >
      {/* BID INFORMATION */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-sm text-[var(--bidora-text-secondary)]">
            Current bid
          </p>

          <p className="mt-1 text-4xl font-bold text-[var(--bidora-primary)]">
            €{localCurrentBid}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-[var(--bidora-text-secondary)]">
              {localBids}{" "}
              {localBids === 1
                ? "bid"
                : "bids"}
            </span>

            {localBids > 0 && (
              <>
                <span className="text-[var(--bidora-text-secondary)]">
                  ·
                </span>

                <BidHistoryModal
                  auctionId={
                    auctionId
                  }
                  bidCount={
                    localBids
                  }
                  currentUserId={
                    currentUserId
                  }
                />
              </>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-[var(--bidora-text-secondary)]">
            Time remaining
          </p>

          <div className="mt-1">
            <AuctionCountdown
              endsAt={
                endsAt
              }
            />
          </div>
        </div>
      </div>

      {/* BID AREA */}
      <div className="mt-7">
        {isOwnAuction ? (
          <div
            className="
              rounded-xl
              bg-[var(--bidora-background)]
              px-4
              py-4
              text-sm
              text-[var(--bidora-text-secondary)]
            "
          >
            This is your auction.
            You cannot place a bid
            on your own item.
          </div>
        ) : hasEnded ? (
          <div
            className="
              rounded-xl
              bg-[var(--bidora-background)]
              px-4
              py-4
              text-sm
              font-medium
              text-[var(--bidora-text-secondary)]
            "
          >
            This auction has ended.
          </div>
        ) : (
          <>
            {/* HIGHEST BIDDER */}
            {isHighestBidder && (
              <div
                className="
                  mb-5
                  rounded-xl
                  border
                  border-green-200
                  bg-green-50
                  px-4
                  py-4
                "
              >
                <p className="font-semibold text-green-700">
                  You currently have
                  the highest bid.
                </p>

                {myLatestBid !==
                  null && (
                  <p className="mt-1 text-sm text-green-700">
                    Your bid: €
                    {myLatestBid}
                  </p>
                )}
              </div>
            )}

            {/* OUTBID */}
            {!isHighestBidder &&
              myLatestBid !==
                null && (
                <div
                  className="
                    mb-5
                    rounded-xl
                    border
                    border-orange-200
                    bg-orange-50
                    px-4
                    py-4
                  "
                >
                  <p className="font-semibold text-orange-700">
                    You have been
                    outbid.
                  </p>

                  <p className="mt-1 text-sm text-orange-700">
                    Your latest bid
                    was €
                    {myLatestBid}.
                  </p>
                </div>
              )}

            <label
              htmlFor="bid"
              className="text-sm font-medium text-[var(--bidora-text)]"
            >
              Your bid
            </label>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <span
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[var(--bidora-text-secondary)]
                  "
                >
                  €
                </span>

                <input
                  id="bid"
                  type="number"
                  step="0.01"
                  min={
                    localCurrentBid +
                    0.01
                  }
                  value={bidAmount}
                  disabled={
                    isHighestBidder
                  }
                  onChange={(
                    event
                  ) =>
                    setBidAmount(
                      event.target
                        .value
                    )
                  }
                  placeholder={`${(
                    localCurrentBid +
                    1
                  ).toFixed(2)}`}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[var(--bidora-border)]
                    bg-white
                    py-3.5
                    pl-8
                    pr-4
                    outline-none
                    transition
                    focus:border-[var(--bidora-primary)]
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:opacity-60
                  "
                />
              </div>

              <button
                type="button"
                onClick={
                  handleBid
                }
                disabled={
                  isSubmitting ||
                  isHighestBidder ||
                  isLoadingBidStatus
                }
                className="
                  rounded-xl
                  bg-[var(--bidora-primary)]
                  px-7
                  py-3.5
                  font-semibold
                  text-white
                  transition
                  hover:bg-[var(--bidora-primary-hover)]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isSubmitting
                  ? "Placing..."
                  : isHighestBidder
                    ? "Highest bid"
                    : "Place bid"}
              </button>
            </div>

            {!isHighestBidder && (
              <p className="mt-2 text-xs text-[var(--bidora-text-secondary)]">
                Enter an amount higher
                than the current bid.
              </p>
            )}

            {bidError && (
              <p className="mt-3 text-sm font-medium text-red-500">
                {bidError}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}