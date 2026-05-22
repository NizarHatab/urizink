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
  icons: {
    icon: [{ url: "/images/logo.PNG", type: "image/png" }],
    apple: [{ url: "/images/logo.PNG", type: "image/png" }],
  },
};

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${barlow.variable}`}>
      <body className="min-h-screen overflow-x-clip bg-black font-sans text-white antialiased">
        <AppToaster position="top-right" />
        <Header />
        <main className="w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
