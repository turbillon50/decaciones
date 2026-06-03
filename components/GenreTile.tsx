import Link from "next/link";
import { Play } from "lucide-react";
import type { DecadeId } from "@/lib/types";
import { cn } from "@/lib/utils";

const accents = [
  "from-amber/30 to-transparent text-amber",
  "from-teal/30 to-transparent text-teal",
  "from-gold/30 to-transparent text-gold",
  "from-rose/30 to-transparent text-rose",
  "from-primary/30 to-transparent text-primary",
];

export function GenreTile({
  genre,
  decade,
  index = 0,
}: {
  genre: string;
  decade: DecadeId;
  index?: number;
}) {
  return (
    <Link
      href={`/player?decade=${decade}&genre=${encodeURIComponent(genre)}`}
      className={cn(
        "group relative flex min-h-32 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-5 metal-panel",
        accents[index % accents.length],
      )}
    >
      <span className="font-readout text-xs font-bold uppercase tracking-wide opacity-90">
        {decade}
      </span>
      <div className="flex items-end justify-between gap-3">
        <h3 className="font-headline text-2xl font-black leading-tight text-foreground">
          {genre}
        </h3>
        <span className="metal-button grid h-11 w-11 shrink-0 place-items-center rounded-full text-primary transition group-hover:scale-105">
          <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
