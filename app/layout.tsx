import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Bodoni_Moda, Inter } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Titulares: Didone editorial fina (estilo revista de moda / lujo).
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#ff8c00",
          colorBackground: "#0d0d0d",
          colorText: "#f2e7df",
          colorInputBackground: "#1a1918",
          borderRadius: "0.9rem",
        },
      }}
    >
      <html
        lang="es"
        className={`${inter.variable} ${bodoni.variable} h-full dark`}
      >
        <body className="min-h-full antialiased">
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var t=localStorage.getItem('decaciones:theme')||'dark';var r=document.documentElement;r.classList.toggle('light',t==='light');r.classList.toggle('dark',t!=='light');}catch(e){}})();`,
            }}
          />
          <AppShell>{children}</AppShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
