import Navbar from "../components/layout/Navbar";
import AuctionMarketplace from "../components/home/AuctionMarketplace";
import PopularCategories from "../components/home/PopularCategories";
import HowItWorks from "../components/home/HowItWorks";
import SellerCTA from "../components/home/SellerCTA";
import Footer from "../components/layout/Footer";


export default function HomePage() {

    return (
        <div className="home-dark">
            <Navbar />

            <main>
                <AuctionMarketplace />
                <PopularCategories />
                <HowItWorks/>
                <SellerCTA />
            </main>
            <Footer/>
        </div>
    );
}