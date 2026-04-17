import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Providers from "../components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Laboratory of Plant Systematic",
  description: "Plant identification and research management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-white text-gray-900 overflow-x-hidden`}
      >
        {/* Global providers */}
        <Providers>{children}</Providers>

        <Analytics />
      </body>
    </html>
  );
}
