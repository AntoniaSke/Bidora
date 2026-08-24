import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout//Footer";
import LoginForm from "@/src/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <section className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--bidora-accent)]">
              Welcome back
            </p>

            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-[var(--bidora-text)]">
              Log in to Bidora.
            </h1>

            <p className="mt-4 text-[var(--bidora-text-secondary)]">
              Continue bidding, selling and following your favourite auctions.
            </p>
          </div>

          <div className="mt-10">
            <LoginForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}