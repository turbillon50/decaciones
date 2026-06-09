import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata = { title: "Entrar" };

export default function SignInPage() {
  return (
    <AuthShell eyebrow="Bienvenido de vuelta" title="Decaciones">
      <SignIn appearance={clerkAppearance} />
    </AuthShell>
  );
}
