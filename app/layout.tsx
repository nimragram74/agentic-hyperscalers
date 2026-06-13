import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Agentic Hyper Scalers — The AI Cloud Command Centre",
    template: "%s · Agentic Hyper Scalers",
  },
  description:
    "The definitive enterprise AI intelligence hub — services, certifications, training paths, and live news across Microsoft Azure, Google Cloud, AWS & Anthropic.",
  keywords: [
    "Azure AI",
    "Google Cloud AI",
    "AWS AI",
    "Anthropic Claude",
    "AI certifications",
    "enterprise AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full`}
    >
      <body className="font-body min-h-full bg-base-900 text-ink-100 antialiased">
        <Navbar />
        <PageTransition>
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
        </PageTransition>
      </body>
    </html>
  );
}
