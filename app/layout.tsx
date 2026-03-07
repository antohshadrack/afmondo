import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MantineProvider, ColorSchemeScript, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import ScrollToTop from "./components/shared/ScrollToTop";
import PageTracker from "./components/shared/PageTracker";
import { TranslationProvider } from "./contexts/TranslationContext";
import { CartProvider } from "./contexts/CartContext";

const theme = createTheme({
  primaryColor: "orange",
  colors: {
    orange: [
      "#fff8ec",
      "#ffeed3",
      "#ffdba5",
      "#ffc772",
      "#ffb44b",
      "#F5A623",
      "#e5951a",
      "#c97d0d",
      "#ac6606",
      "#8e5103",
    ],
    green: [
      "#edfff0",
      "#d5f5da",
      "#a8e8b0",
      "#78da84",
      "#52cf5f",
      "#1BA632",
      "#089226",
      "#027020",
      "#005518",
      "#003912",
    ],
  },
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  headings: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  defaultRadius: "md",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4CAF50",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://afmondo.com"),
  title: "Afmondo - Votre Destination Shopping au Sénégal",
  description:
    "Véhicules, tracteurs, électronique, meubles et électroménager de qualité à prix compétitifs.",
  keywords: [
    "shopping sénégal",
    "électronique",
    "meubles dakar",
    "vente véhicules",
    "tracteurs sénégal",
    "électroménager",
    "afonda",
    "afmondo",
  ],
  authors: [{ name: "Afmondo" }],
  creator: "Afmondo",
  publisher: "Afmondo",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: "https://afmondo.com",
    title: "Afmondo - Votre Destination Shopping au Sénégal",
    description:
      "Véhicules, tracteurs, électronique, meubles et électroménager de qualité à prix compétitifs.",
    siteName: "Afmondo",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Afmondo Shopping",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Afmondo - Votre Destination Shopping au Sénégal",
    description:
      "Véhicules, tracteurs, électronique, meubles et électroménager de qualité.",
    images: ["/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications position="top-right" zIndex={9999} />
          <TranslationProvider>
            <CartProvider>
              {children}
              <ScrollToTop />
              <PageTracker />
            </CartProvider>
          </TranslationProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
