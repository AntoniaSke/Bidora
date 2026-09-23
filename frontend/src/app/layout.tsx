import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Bidora",
  description: "Discover unique items and compete in live auctions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head />
      <body>
        <Toaster
          position="top-right"
          richColors
        />
        {children}
      </body>
    </html>
  );
}