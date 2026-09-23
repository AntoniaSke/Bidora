"use client";

import { useEffect, useState } from "react";

type AuctionCountdownProps = {
  endsAt: string;
  compact?: boolean;
};

function calculateTimeLeft(endsAt: string) {
  if (!endsAt) {
    return "No end date";
  }

  const endTime = new Date(endsAt).getTime();

  if (Number.isNaN(endTime)) {
    return "Invalid date";
  }

  const difference = endTime - Date.now();

  if (difference <= 0) {
    return "Ended";
  }

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  return `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function AuctionCountdown({
  endsAt,
  compact = false,
}: AuctionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(endsAt)
  );

  useEffect(() => {
    function updateCountdown() {
      setTimeLeft(calculateTimeLeft(endsAt));
    }

    updateCountdown();

    const interval = setInterval(
      updateCountdown,
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [endsAt]);

  if (timeLeft === "Ended") {
    return (
      <span className="font-semibold text-[var(--bidora-text-secondary)]">
        Ended
      </span>
    );
  }

  if (
    timeLeft === "No end date" ||
    timeLeft === "Invalid date"
  ) {
    return (
      <span className="text-red-500">
        {timeLeft}
      </span>
    );
  }

  return (
    <span className="font-semibold text-[var(--bidora-accent)]">
      {timeLeft}
      {compact ? " left" : ""}
    </span>
  );
}