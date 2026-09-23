import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import AccountSection from "@/src/components/profile/AccountSection";
import MyBidsList from "@/src/components/profile/MyBidsList";

type MyBidsPageProps = {
  searchParams: Promise<{
    filter?: string;
  }>;
};

export default async function MyBidsPage({
  searchParams,
}: MyBidsPageProps) {
  const params = await searchParams;

  const allowedFilters = [
    "all",
    "highest",
    "outbid",
    "won",
    "lost",
  ];

  const filter = allowedFilters.includes(
    params.filter ?? ""
  )
    ? params.filter!
    : "all";

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <AccountSection
          title="My Bids"
          description="Keep track of the auctions you've participated in."
        >
          <MyBidsList filter={filter} />
        </AccountSection>
      </main>

      <Footer />
    </>
  );
}