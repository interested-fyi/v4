import "./../../../../globals.css";
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import Navbar from "@/components/composed/Navbar";
import PrivyProviderWrapper from "@/context/PrivyProvider";
import QueryProvider from "@/context/QueryProvider";
import dynamic from "next/dynamic";
import { PHProvider } from "@/context/PostHogProvider";
import { Footer } from "@/components/footer";

const PostHogPageView = dynamic(
  () => import("../../../components/PostHogPageView"),
  {
    ssr: false,
  }
);
const fontHeading = Roboto_Mono({
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
      <PHProvider>
        <body
          className={cn(
            "antialiased ",
            fontHeading.variable,
            fontBody.variable
          )}
        >
          <PrivyProviderWrapper>
            <QueryProvider>
              <Navbar />
              <PostHogPageView />
              {children}
              <Toaster />
              <Footer />
            </QueryProvider>
          </PrivyProviderWrapper>
        </body>
      </PHProvider>
    </html>
  );
}
