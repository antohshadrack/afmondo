import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "./components/shared/ScrollToTop";
import { TranslationProvider } from "./contexts/TranslationContext";
import { CartProvider } from "./contexts/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Afmondo - Votre Destination Shopping au Sénégal",
  description: "Véhicules, tracteurs, électronique, meubles et électroménager de qualité à prix compétitifs.",
  keywords: ["shopping sénégal", "électronique", "meubles dakar", "vente véhicules", "tracteurs sénégal", "électroménager", "afonda", "afmondo"],
  authors: [{ name: "Afmondo" }],
  creator: "Afmondo",
  publisher: "Afmondo",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: "https://afmondo.com",
    title: "Afmondo - Votre Destination Shopping au Sénégal",
    description: "Véhicules, tracteurs, électronique, meubles et électroménager de qualité à prix compétitifs.",
    siteName: "Afmondo",
    images: [
      {
        url: "/og-image.jpg", // We should ensure this exists or use a default
        width: 1200,
        height: 630,
        alt: "Afmondo Shopping",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Afmondo - Votre Destination Shopping au Sénégal",
    description: "Véhicules, tracteurs, électronique, meubles et électroménager de qualité.",
    // images: ["/twitter-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5, // Allow zooming for accessibility
  },
  themeColor: "#4CAF50", // Afmondo green
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* External CSS Libraries */}
        <link
          href="https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TranslationProvider>
          <CartProvider>
            {children}
            <ScrollToTop />
          </CartProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
