import { NextResponse, type NextRequest } from "next/server";
import { fetchSpotifyMetadata } from "@/lib/spotify";
import { isValidSpotifyUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  if (!isValidSpotifyUrl(url)) {
    return NextResponse.json({ error: "Invalid Spotify URL" }, { status: 400 });
  }

  const metadata = await fetchSpotifyMetadata(url);

  if (!metadata) {
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 502 });
  }

  return NextResponse.json(metadata, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
