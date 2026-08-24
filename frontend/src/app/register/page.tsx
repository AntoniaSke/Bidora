import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout//Footer";
import RegisterForm from "@/src/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <section className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--bidora-accent)]">
              Join Bidora
            </p>

            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-[var(--bidora-text)]">
              Create your account.
            </h1>

            <p className="mt-4 text-[var(--bidora-text-secondary)]">
              Start bidding, save favourites and create your own auctions.
            </p>
          </div>

          <div className="mt-10">
            <RegisterForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}