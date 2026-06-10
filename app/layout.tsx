import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Decaciones", template: "%s | Decaciones" },
  description: "La música de tu vida, organizada por décadas y géneros.",
  applicationName: "Decaciones",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Decaciones" },
  icons: { icon: "/icons/decaciones-icon.svg", apple: "/icons/decaciones-icon.svg" },
};
export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeInit = `(function(){try{var t=localStorage.getItem('decaciones:theme')||'night';document.documentElement.setAttribute('data-theme',t);var s=localStorage.getItem('decaciones:textSize');var m={normal:'1',grande:'1.15',enorme:'1.32'};if(s&&m[s])document.documentElement.style.setProperty('--fz',m[s]);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="night">
      <head><script dangerouslySetInnerHTML={{ __html: themeInit }} /></head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
