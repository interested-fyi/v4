import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import Navbar from "@/components/composed/Navbar";
import PrivyProviderWrapper from "@/context/PrivyProvider";

const fontHeading = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: "700",
});

const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Interested.fyi",
  description: "Find the best web3 jobs and employees",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >
        <PrivyProviderWrapper>
          <Navbar />
          {children}
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
