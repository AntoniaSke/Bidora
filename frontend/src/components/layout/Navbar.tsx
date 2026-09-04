import { Menu } from "lucide-react";
import AuthNavActions from "@/src/components/auth/AuthNavActions";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-[var(--bidora-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">

        {/* Brand */}
        <a
          href="/"
          className="text-2xl sm:text-3xl font-black tracking-[-0.055em]"
        >
          <span className="text-[var(--bidora-primary)]">BID</span>
          <span className="text-[var(--bidora-accent)]">ORA</span>
        </a>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/" className="font-medium hover:text-[var(--bidora-primary)]">
            Home
          </a>

          <a
            href="/auctions"
            className="font-medium hover:text-[var(--bidora-primary)]"
          >
            Auctions
          </a>

          <a
            href="/categories"
            className="font-medium hover:text-[var(--bidora-primary)]"
          >
            Categories
          </a>

          <a
            href="#how-it-works"
            className="font-medium hover:text-[var(--bidora-primary)]" 
          >
            How It Works
          </a>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href="/sell"
            className="
      rounded-xl
      bg-[var(--bidora-accent)]
      px-5
      py-2.5
      font-semibold
      text-white
      transition
      hover:opacity-90
    "
          >
            Sell an Item
          </a>

          <AuthNavActions />
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              className="p-2"
              aria-label="Open menu"
            >
              <Menu size={27} />
            </SheetTrigger>

            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-10 ml-2">

                <a href="/" className="text-lg font-medium">
                  Home
                </a>

                <a href="/auctions" className="text-lg font-medium">
                  Auctions
                </a>

                <a href="/categories" className="text-lg font-medium">
                  Categories
                </a>

                <a href="#how-it-works" className="text-lg font-medium">
                  How It Works
                </a>

                <div className="border-t border-[var(--bidora-border)] pt-6">

                  <a
                    href="/sell"
                    className="
                      block
                      text-center
                      bg-[var(--bidora-accent)]
                      text-white
                      py-3
                      rounded-xl
                      font-semibold
                    "
                  >
                    Sell an Item
                  </a>

                  <div className="flex gap-3 mt-4">

                    <AuthNavActions mobile />

                  </div>
                </div>

              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  );
}