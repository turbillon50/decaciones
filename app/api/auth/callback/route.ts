import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  exchangeCodeForToken,
  getCurrentSpotifyUser,
  getSpotifyCallbackUrl,
} from "@/lib/spotify";
import { saveSpotifyTokens } from "@/lib/users";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const storedState = request.cookies.get("spotify_oauth_state")?.value;

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${error}`, url.origin));
  }

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(
      new URL("/?error=invalid_spotify_state", url.origin),
    );
  }

  try {
    const token = await exchangeCodeForToken(
      code,
      getSpotifyCallbackUrl(request.url),
    );
    // Persistimos tokens en DB: asi el modo PRECARGADO puede usar la cuenta
    // host (Luis) aunque la cookie muera.
    try {
      const { userId } = await auth();
      if (userId) {
        const spotifyUser = await getCurrentSpotifyUser(token.access_token);
        await saveSpotifyTokens(
          userId,
          token.access_token,
          token.refresh_token,
          spotifyUser.email,
        );
        console.log(
          `[spotify] tokens guardados en DB para ${spotifyUser.email ?? userId}`,
        );
      }
    } catch (persistError) {
      console.error("[spotify] no se pudo persistir tokens", persistError);
    }

    const response = NextResponse.redirect(
      new URL("/?connected=true", url.origin),
    );
    response.cookies.delete("spotify_oauth_state");
    response.cookies.set("spotify_access_token", token.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: token.expires_in,
      path: "/",
    });

    if (token.refresh_token) {
      response.cookies.set("spotify_refresh_token", token.refresh_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    return response;
  } catch (tokenError) {
    const message =
      tokenError instanceof Error ? tokenError.message : "token_exchange_failed";
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(message)}`, url.origin),
    );
  }
}
