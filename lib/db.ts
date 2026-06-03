import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/schema";

/**
 * Cliente Drizzle sobre Neon (HTTP serverless).
 * `getDb()` devuelve null si no hay DATABASE_URL configurada, para que la
 * app siga funcionando (modo demo / sin persistencia) sin romper el build.
 */
let cached: ReturnType<typeof drizzle<typeof schema>> | null | undefined;

export function getDb() {
  if (cached !== undefined) return cached;

  const url = process.env.DATABASE_URL;
  if (!url || url.includes("placeholder")) {
    cached = null;
    return cached;
  }

  const sql = neon(url);
  cached = drizzle(sql, { schema });
  return cached;
}

export { schema };
