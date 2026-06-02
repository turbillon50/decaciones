import type { Metadata, Viewport } from "next";
import { Chivo, Inter, Space_Grotesk } from "next/font/google";
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
      className={`${inter.variable} ${chivo.variable} ${spaceGrotesk.variable} h-full dark`}
    >
      <body className="min-h-full antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
