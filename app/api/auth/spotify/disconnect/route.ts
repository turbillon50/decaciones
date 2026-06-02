import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const response = NextResponse.redirect(
    new URL("/spotify?disconnected=true", url.origin),
  );

  response.cookies.delete("spotify_access_token");
  response.cookies.delete("spotify_refresh_token");
  response.cookies.delete("spotify_oauth_state");

  return response;
}
