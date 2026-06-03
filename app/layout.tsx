import type { Metadata, Viewport } from "next";
import {
  Bebas_Neue,
  Chivo,
  Inter,
  Playfair_Display,
  Space_Grotesk,
} from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

// Headlines elegantes para las decadas (Cover Flow / heroes).
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  display: "swap",
});

// Numeros y anios con impacto retro.
const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Decaciones",
    template: "%s | Decaciones",
  },
  description:
    "La musica de tu vida organizada por decadas en una PWA premium con alma de iPod Classic y rockola.",
  applicationName: "Decaciones",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Decaciones",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/decaciones-icon.svg",
    apple: "/icons/decaciones-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${chivo.variable} ${spaceGrotesk.variable} ${playfair.variable} ${bebas.variable} h-full dark`}
    >
      <body className="min-h-full antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
