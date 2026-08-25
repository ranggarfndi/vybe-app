import { NextResponse, type NextRequest } from "next/server";

export interface SearchTrackItem {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  spotifyUrl: string;
  previewUrl: string | null;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ tracks: [] });
  }

  try {
    // 1. Direct search via iTunes Music Search API (ultra-fast, no auth required, high-res artwork & audio preview)
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(
      query
    )}&media=music&entity=song&limit=10`;

    const response = await fetch(itunesUrl, {
      headers: { "User-Agent": "VYBE-App/1.0" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ tracks: [] });
    }

    const data = await response.json();

    const tracks: SearchTrackItem[] = (data.results || []).map((item: any) => {
      const highResArtwork = item.artworkUrl100
        ? item.artworkUrl100.replace("100x100bb.jpg", "600x600bb.jpg")
        : "";

      // Construct a Spotify web search link for easy playback
      const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(
        `${item.trackName} ${item.artistName}`
      )}`;

      return {
        id: String(item.trackId || Math.random()),
        title: item.trackName || "Unknown Track",
        artist: item.artistName || "Unknown Artist",
        artworkUrl: highResArtwork,
        spotifyUrl,
        previewUrl: item.previewUrl || null,
      };
    });

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Spotify search API error:", error);
    return NextResponse.json({ tracks: [] });
  }
}
