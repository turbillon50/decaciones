import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Entrar" };

export default function SignInPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 pb-24 pt-24">
      <h1 className="font-headline text-4xl font-black gold-text">Decaciones</h1>
      <SignIn />
    </main>
  );
}
