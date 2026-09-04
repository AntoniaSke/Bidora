"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Logout failed");
        return;
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="
        flex
        items-center
        gap-2
        text-sm
        font-semibold
        text-[var(--bidora-text-secondary)]
        transition
        hover:text-[var(--bidora-accent)]
      "
    >
      <LogOut size={18} />
      Log out
    </button>
  );
}