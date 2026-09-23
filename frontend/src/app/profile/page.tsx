import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import ProfileForm from "@/src/components/profile/ProfileForm";
import AccountSection from "@/src/components/profile/AccountSection";

export default function ProfilePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <AccountSection
          title="Your profile"
          description="Manage your personal information, delivery details and account preferences."
        >
          <ProfileForm />
        </AccountSection>
      </main>

      <Footer />
    </>
  );
}