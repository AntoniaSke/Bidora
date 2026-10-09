import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import PopularCategories from "@/src/components/home/PopularCategories";

export const metadata: Metadata = {
  title: "Categories | Bidora",
  description: "Browse all Bidora categories and discover active auctions for your interests.",
};

export default function CategoriesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <PopularCategories showAll />
      </main>
      <Footer />
    </>
  );
}
