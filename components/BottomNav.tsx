"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoMode } from "@/lib/demo-context";

const navBase = [
  { href: "/", label: "Inicio", emoji: "🏠" },
  { href: "/decades", label: "Décadas", emoji: "📅" },
  { href: "/genres", label: "Géneros", emoji: "🎸" },
  { href: "/favorites", label: "Favoritas", emoji: "❤️" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { mode } = useDemoMode();

  const nav = [...navBase];
  if (mode === "admin") {
    nav.push({ href: "/admin", label: "Admin", emoji: "🎛️" });
  } else if (mode === "user") {
    nav.push({ href: "/perfil", label: "Perfil", emoji: "👤" });
  }

  return (
    <nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:40,background:"rgba(5,5,5,0.92)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(75,57,45,0.4)",padding:"8px 0 max(8px,env(safe-area-inset-bottom))"}}>
      <div style={{display:"flex",justifyContent:"space-around",maxWidth:"480px",margin:"0 auto"}}>
        {nav.slice(0,5).map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",padding:"4px 8px",textDecoration:"none",opacity:active?1:0.5,transition:"opacity 0.2s"}}>
              <span style={{fontSize:"22px"}}>{item.emoji}</span>
              <span style={{fontSize:"10px",color:active?"#e9c349":"#ddc1ae",fontWeight:active?700:400}}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
