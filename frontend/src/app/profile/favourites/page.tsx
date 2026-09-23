import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import AccountSection from "@/src/components/profile/AccountSection";
import FavouritesList from "@/src/components/profile/favourites/FavouritesList";

export default function FavouritesPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <AccountSection
          title="Favourites"
          description="Auctions you have saved for later."
        >
          <FavouritesList />
        </AccountSection>
      </main>

      <Footer />
    </>
  );
}