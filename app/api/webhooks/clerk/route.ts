import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users } from "@/lib/schema";
import { getOrCreateUser, softDeleteUser } from "@/lib/users";

export const dynamic = "force-dynamic";

type ClerkEmail = { id: string; email_address: string };
type ClerkUserData = {
  id: string;
  email_addresses?: ClerkEmail[];
  primary_email_address_id?: string;
};
type ClerkEvent = {
  type: string;
  data: ClerkUserData;
};

function primaryEmail(data: ClerkUserData): string | null {
  const list = data.email_addresses ?? [];
  const primary = list.find((e) => e.id === data.primary_email_address_id);
  return (primary ?? list[0])?.email_address ?? null;
}

export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret || secret.includes("placeholder")) {
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 500 });
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "missing_svix_headers" }, { status: 400 });
  }

  const payload = await request.text();

  let event: ClerkEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkEvent;
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    // Sin base de datos no hay nada que persistir; respondemos 200 para
    // que Clerk no reintente indefinidamente.
    return NextResponse.json({ ok: true, skipped: "no_database" });
  }

  try {
    const { type, data } = event;
    if (type === "user.created") {
      await getOrCreateUser(data.id, primaryEmail(data));
    } else if (type === "user.updated") {
      await getOrCreateUser(data.id, primaryEmail(data));
      await db
        .update(users)
        .set({ email: primaryEmail(data) })
        .where(eq(users.clerkId, data.id));
    } else if (type === "user.deleted") {
      await softDeleteUser(data.id);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "webhook_failed" },
      { status: 500 },
    );
  }
}
