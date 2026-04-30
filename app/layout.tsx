import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://kp-web-katedral-pontianak.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Katedral Santo Yosef Martapura — Sistem Informasi Paroki",
    template: "%s | Katedral Santo Yosef Martapura",
  },
  description:
    "Portal resmi Paroki Katedral Santo Yosef Martapura. Layanan informasi publik, jadwal misa, berita paroki, dan sistem pendaftaran pernikahan online.",
  keywords: [
    "Katedral Santo Yosef", "Martapura", "Kalimantan Selatan",
    "paroki", "gereja katolik", "pernikahan katolik",
    "jadwal misa", "pendaftaran pernikahan", "sakramen perkawinan"
  ],
  authors: [{ name: "Paroki Katedral Santo Yosef Martapura" }],
  creator: "Paroki Katedral Santo Yosef Martapura",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: APP_URL,
    siteName: "Katedral Santo Yosef Martapura",
    title: "Katedral Santo Yosef Martapura — Sistem Informasi Paroki",
    description:
      "Portal resmi Paroki Katedral Santo Yosef Martapura. Informasi jadwal misa, berita paroki, dan pendaftaran pernikahan.",
  },
  twitter: {
    card: "summary",
    title: "Katedral Santo Yosef Martapura",
    description: "Portal resmi Paroki Katedral Santo Yosef Martapura.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
