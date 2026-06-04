import { Suspense } from "react";
import { PlayerExperience, PlayerSkeleton } from "@/components/PlayerExperience";

export default function PlayerPage() {
  return (
    <Suspense fallback={<PlayerSkeleton />}>
      <PlayerExperience />
    </Suspense>
  );
}
