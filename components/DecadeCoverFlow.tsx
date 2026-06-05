"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CoverFlow, type CoverFlowItem } from "@/components/CoverFlow";
import { decadeMeta } from "@/data/decades-meta";

const items: CoverFlowItem[] = decadeMeta.map((meta) => ({
  id: meta.id,
  title: meta.label,
  subtitle: meta.epoch,
  accent: meta.accent,
  gradient: meta.gradient,
}));

/** Cover Flow de decadas: el selector central de la rockola. */
export function DecadeCoverFlow() {
  // Arrancamos en los 80s (centro visual del carrusel).
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(items.length / 2),
  );
  const router = useRouter();

  return (
    <CoverFlow
      items={items}
      activeIndex={activeIndex}
      onActiveChange={setActiveIndex}
      onSelect={(item) => router.push(`/genres?decade=${item.id}`)}
    />
  );
}
