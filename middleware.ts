import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk se aplica a toda la app salvo:
// - assets internos de Next y archivos estaticos
// - /api/webhooks/* (verificados con svix)
// - /api/auth/* (flujo OAuth de Spotify, basado en cookies)
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|api/auth|.*\\.(?:ico|png|jpg|jpeg|svg|gif|webp|css|js|json|txt|xml|woff|woff2|ttf|wav|mp3)$).*)",
  ],
};
