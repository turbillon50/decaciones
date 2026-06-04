import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DecadeMeta } from "@/data/decades-meta";
import { cn } from "@/lib/utils";

export function DecadePoster({ meta }: { meta: DecadeMeta }) {
  return (
    <Link
      href={`/genres?decade=${meta.id}`}
      className={cn(
        "group glow-card relative block h-[26rem] w-[70vw] max-w-[17rem] overflow-hidden rounded-[2rem] bg-gradient-to-br sm:h-[28rem] sm:w-72",
        meta.gradient,
      )}
    >
      {/* Glow superior */}
      <div className="pointer-events-none absolute -top-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-white/25 blur-3xl" />
      {/* Grano / surcos de vinilo */}
      <div className="pointer-events-none absolute inset-0 opacity-25 [background:repeating-radial-gradient(circle_at_70%_25%,rgba(0,0,0,0.55)_0_2px,transparent_2px_12px)]" />
      {/* Degradado inferior para legibilidad */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <span className="font-readout rounded-full border border-black/30 bg-black/30 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-widest text-white/90 backdrop-blur">
            {meta.epoch}
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/10 text-white/90 backdrop-blur transition group-hover:bg-white/25">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>

        <div>
          <p className="font-year text-[5.5rem] leading-[0.8] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] sm:text-[6.5rem]">
            {meta.label}
          </p>
          <p className="mt-2 font-headline text-lg font-bold text-white/85">
            Explorar la decada
          </p>
        </div>
      </div>
    </Link>
  );
}
