import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import AccountSection from "@/src/components/profile/AccountSection";
import NotificationsList from "@/src/components/profile/NotificationsList";

export default function NotificationsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <AccountSection
          title="Notifications"
          description="Stay updated on your auctions and bids."
        >
          <NotificationsList />
        </AccountSection>
      </main>

      <Footer />
    </>
  );
}