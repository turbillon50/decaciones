import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata = { title: "Crear cuenta" };

export default function SignUpPage() {
  return (
    <AuthShell eyebrow="Arma tu rockola" title="Decaciones">
      <SignUp appearance={clerkAppearance} />
    </AuthShell>
  );
}
