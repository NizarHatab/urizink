import type { Metadata } from "next";
import { Bebas_Neue, Barlow } from "next/font/google";
import "../globals.css";
import AppToaster from "@/components/ui/app-toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "UrizInk — Blackwork Tattoo Studio",
  description: "Luxury blackwork tattoo studio in Beirut.",
};

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${barlow.variable}`}>
      <body className="bg-black text-white font-sans antialiased">
        <AppToaster position="top-right" />
        <main className="flex min-h-screen flex-col items-center">
          <div className="flex w-full min-h-screen flex-col overflow-x-hidden bg-black text-white">
            <Header />
            <div className="flex-1 w-full flex flex-col">
              {children}
            </div>
            <Footer />
          </div>
        </main>
      </body>
    </html>
  );
}
