import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { LogIn, Music, Sparkles } from "lucide-react";
import { GoldenParticles } from "@/components/GoldenParticles";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Si ya hay sesion (Clerk) o conexion de Spotify, ir directo a la biblioteca.
  const { userId } = await auth();
  const cookieStore = await cookies();
  if (userId || cookieStore.get("spotify_access_token")?.value) {
    redirect("/decades");
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-44 pt-24 sm:px-6 lg:pb-16">
      <section className="relative grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
        <GoldenParticles />
        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-line/60 bg-surface-2/70 px-4 py-2 text-sm text-muted">
            <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
            <span className="font-readout">Biblioteca premium por decadas</span>
          </div>
          <div className="space-y-3">
            <h1 className="font-headline max-w-3xl text-5xl font-black leading-[1.05] gold-text sm:text-6xl">
              Decaciones
            </h1>
            <p className="max-w-2xl text-xl leading-8 text-muted">
              Tu musica por decadas. Elige una epoca, un genero o una memoria
              y deja que la rockola haga el resto.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/api/auth/spotify"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#1DB954] px-7 text-base font-black text-black transition hover:brightness-110"
            >
              <Music className="h-5 w-5" aria-hidden="true" />
              Conectar con Spotify
            </a>
            <Link
              href="/sign-in"
              className="metal-button inline-flex h-14 items-center justify-center gap-3 rounded-full px-7 text-base font-black text-primary"
            >
              <LogIn className="h-5 w-5" aria-hidden="true" />
              Entrar
            </Link>
          </div>
        </div>
        <div className="metal-panel relative overflow-hidden rounded-2xl p-4">
          <div className="relative grid aspect-square place-items-center rounded-xl border border-line/40 bg-black">
            <Image
              src="/images/decaciones-hero.svg"
              alt="Decaciones iPod Classic y rockola"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 352px"
              className="rounded-xl object-cover opacity-70"
            />
            <div
              className="vinyl-disc animate-slow-spin relative h-40 w-40 rounded-full shadow-2xl"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            k: "Decadas",
            t: "Cover Flow 3D",
            d: "Viaja por los 60s a los 2000s en un carrusel premium.",
            grad: "from-amber/20",
          },
          {
            k: "Generos",
            t: "Por epoca y estilo",
            d: "Synth-pop de los 80s, salsa de los 70s, grunge de los 90s.",
            grad: "from-teal/20",
          },
          {
            k: "Spotify",
            t: "Busca y arma playlists",
            d: "Encuentra cualquier cancion y guardala en tu cuenta.",
            grad: "from-gold/20",
          },
        ].map((f) => (
          <article
            key={f.k}
            className={`rounded-2xl bg-gradient-to-br ${f.grad} to-transparent p-5 metal-panel`}
          >
            <p className="font-readout text-xs font-bold uppercase text-gold">
              {f.k}
            </p>
            <h3 className="mt-2 font-headline text-xl font-black text-foreground">
              {f.t}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">{f.d}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
