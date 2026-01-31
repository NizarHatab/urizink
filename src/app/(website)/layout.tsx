import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UrizInk — Blackwork Tattoo Studio",
  description: "Luxury blackwork tattoo studio in Beirut.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en" className={inter.variable}>
      <body className="bg-black text-white font-sans antialiased">
        {/* TOASTER */}
        <Toaster
          position="top-right"
          richColors
          duration={3000}
        />
        {/* MAIN */}
        <main className="flex flex-col items-center py-12 px-4 md:px-10">
          {children}
        </main>
      </body>
    </html>
  );
}
