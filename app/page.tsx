import { JukeboxHome } from "@/components/JukeboxHome";
import { getSpotifySession } from "@/lib/spotify-session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSpotifySession();
  return <JukeboxHome preloaded={session?.mode === "preloaded"} />;
}
