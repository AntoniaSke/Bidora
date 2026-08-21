export default function Footer() {
  return (
    <footer className="bg-[#f8f8f6] border-t border-[var(--bidora-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-10
          "
        >
          {/* Brand */}
          <div>
            <a
              href="/"
              className="text-2xl font-black tracking-[-0.055em]"
            >
              <span className="text-[var(--bidora-primary)]">BID</span>
              <span className="text-[var(--bidora-accent)]">ORA</span>
            </a>

            <p
              className="
                mt-4
                max-w-xs
                text-sm
                leading-relaxed
                text-[var(--bidora-text-secondary)]
              "
            >
              Discover unique items, join live auctions and place your bid.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-[var(--bidora-text)]">
              Explore
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <a
                href="/auctions"
                className="text-sm text-[var(--bidora-text-secondary)] hover:text-[var(--bidora-primary)] transition"
              >
                Auctions
              </a>

              <a
                href="/categories"
                className="text-sm text-[var(--bidora-text-secondary)] hover:text-[var(--bidora-primary)] transition"
              >
                Categories
              </a>

              <a
                href="#how-it-works"
                className="text-sm text-[var(--bidora-text-secondary)] hover:text-[var(--bidora-primary)] transition"
              >
                How It Works
              </a>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-[var(--bidora-text)]">
              Account
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <a
                href="/login"
                className="text-sm text-[var(--bidora-text-secondary)] hover:text-[var(--bidora-primary)] transition"
              >
                Log In
              </a>

              <a
                href="/register"
                className="text-sm text-[var(--bidora-text-secondary)] hover:text-[var(--bidora-primary)] transition"
              >
                Sign Up
              </a>

              <a
                href="/sell"
                className="text-sm text-[var(--bidora-text-secondary)] hover:text-[var(--bidora-primary)] transition"
              >
                Sell an Item
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-[var(--bidora-text)]">
              Legal
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <a
                href="/terms"
                className="text-sm text-[var(--bidora-text-secondary)] hover:text-[var(--bidora-primary)] transition"
              >
                Terms
              </a>

              <a
                href="/privacy"
                className="text-sm text-[var(--bidora-text-secondary)] hover:text-[var(--bidora-primary)] transition"
              >
                Privacy
              </a>

              <a
                href="/contact"
                className="text-sm text-[var(--bidora-text-secondary)] hover:text-[var(--bidora-primary)] transition"
              >
                Contact
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div
          className="
            mt-12
            pt-6
            border-t
            border-[var(--bidora-border)]
            flex
            flex-col
            sm:flex-row
            gap-3
            sm:items-center
            sm:justify-between
          "
        >
          <p className="text-sm text-[var(--bidora-text-secondary)]">
            © 2026 Bidora. All rights reserved.
          </p>

          <p className="text-sm text-[var(--bidora-text-secondary)]">
            Built for modern auctions.
          </p>
        </div>

      </div>
    </footer>
  );
}