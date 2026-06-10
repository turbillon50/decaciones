import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Decaciones", template: "%s | Decaciones" },
  description: "La música de tu vida organizada por décadas y géneros.",
  applicationName: "Decaciones",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Decaciones" },
  icons: { icon: "/icons/decaciones-icon.svg", apple: "/icons/decaciones-icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body style={{
        minHeight:"100dvh",background:"#000",color:"#fff",margin:0,
        fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif",
        WebkitFontSmoothing:"antialiased",overflowX:"hidden",
      }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
