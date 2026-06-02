"use client";

import { useState } from "react";
import { Mic, Play, Sparkles } from "lucide-react";
import { aiPrompts } from "@/data/music";
import { withAudioCategory } from "@/lib/audio";
import { usePlayer } from "@/lib/player-store";

export function AICommandPanel() {
  const { playTrack } = usePlayer();
  const [activePromptId, setActivePromptId] = useState(aiPrompts[0].id);
  const activePrompt =
    aiPrompts.find((prompt) => prompt.id === activePromptId) ?? aiPrompts[0];
  const activeQueue = withAudioCategory(
    activePrompt.tracks,
    activePrompt.audioCategory,
  );

  const selectPrompt = (promptId: string) => {
    const nextPrompt =
      aiPrompts.find((prompt) => prompt.id === promptId) ?? aiPrompts[0];
    const nextQueue = withAudioCategory(
      nextPrompt.tracks,
      nextPrompt.audioCategory,
    );
    setActivePromptId(nextPrompt.id);
    playTrack(nextQueue[0], nextQueue);
  };

  return (
    <section className="space-y-8">
      <div className="flex justify-center">
        <div className="relative grid h-28 w-28 place-items-center rounded-full bg-amber/10">
          <span
            className="absolute h-full w-full rounded-full border border-primary/30"
            style={{ animation: "slow-spin 12s linear infinite" }}
            aria-hidden="true"
          />
          <button
            type="button"
            className="metal-button grid h-20 w-20 place-items-center rounded-full text-primary"
            aria-label="Activar comando de voz"
          >
            <Mic className="h-8 w-8" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex h-12 items-end justify-center gap-2" aria-hidden="true">
        {[0.1, 0.25, 0.05, 0.3, 0.15, 0.22, 0.08].map((delay) => (
          <span
            key={delay}
            className="w-2 rounded-full bg-primary"
            style={{ animation: `waveform 1.2s ease-in-out ${delay}s infinite` }}
          />
        ))}
      </div>

      <div className="space-y-5">
        <div className="ml-auto max-w-[88%] rounded-3xl rounded-tr-md border border-line/50 bg-surface-2/80 px-5 py-4 text-lg leading-7 text-foreground">
          {activePrompt.prompt}
        </div>
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber text-black">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="rounded-3xl rounded-tl-md bg-surface-2 px-5 py-4 text-lg leading-8 text-foreground">
            <p className="text-primary">{activePrompt.response}</p>
            <p className="mt-3 text-muted">
              {activePrompt.tracks[0].artist} abre la sesion con{" "}
              {activePrompt.tracks[0].title}.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {aiPrompts.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectPrompt(item.id)}
            className="rounded-full border border-line/60 bg-surface-2/70 px-5 py-4 font-readout text-sm font-bold text-muted transition hover:border-primary/60 hover:text-primary"
          >
            &quot;{item.prompt}&quot;
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => playTrack(activeQueue[0], activeQueue)}
        className="metal-button flex h-14 w-full items-center justify-center gap-3 rounded-full text-base font-black text-primary"
      >
        <Play className="h-5 w-5" fill="currentColor" aria-hidden="true" />
        Iniciar seleccion
      </button>
    </section>
  );
}
