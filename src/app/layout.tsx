import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { SetuProvider } from "@/context/SetuContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "SETU | सेतु - Ministry of Tribal Affairs Scholarship & Fellowship Platform",
  description:
    "AI-Enabled Scholarship & Fellowship Transparency Management Platform for Ministry of Tribal Affairs (NFST, NOS, Pre-Matric, Post-Matric schemes).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
        {/* Puter.js keyless AI client library */}
        <Script src="https://js.puter.com/v2/" strategy="beforeInteractive" />
        <ConvexClientProvider>
          <SetuProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </SetuProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
