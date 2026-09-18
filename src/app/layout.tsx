import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { SetuProvider } from "@/context/SetuContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

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
    <html lang="en" className={`${newsreader.variable} ${jakarta.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Newsreader:ital,opsz,wght@0,6..72,400..800;1,6..72,400..800&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAF8F3] text-stone-900 font-sans min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-stone-900">
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

