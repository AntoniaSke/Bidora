import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout//Footer";
import ProfileForm from "@/src/components/profile/ProfileForm";
import ProfileNav from "@/src/components/profile/ProfileNav";

export default function ProfilePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--bidora-accent)]">
              Your account
            </p>

            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-[var(--bidora-text)]">
              Your profile
            </h1>

            <p className="mt-4 max-w-2xl text-[var(--bidora-text-secondary)]">
              Manage your personal information, delivery details and account preferences.
            </p>
          </div>

          <div className="mt-10">
            <ProfileNav/>
            <ProfileForm />
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}