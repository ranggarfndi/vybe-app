import { isValidSpotifyUrl, extractSpotifyId } from "@/lib/utils";

export interface SpotifyMetadata {
  provider: "spotify";
  url: string;
  title: string;
  artist: string;
  artworkUrl: string | null;
  embedUrl: string;
}

/**
 * Fetch basic Spotify track metadata using oEmbed (no auth required)
 * Falls back gracefully if oEmbed is unavailable.
 */
export async function fetchSpotifyMetadata(
  url: string
): Promise<SpotifyMetadata | null> {
  if (!isValidSpotifyUrl(url)) return null;

  try {
    const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
    const response = await fetch(oembedUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!response.ok) return buildFallbackMetadata(url);

    const data = await response.json();
    const trackId = extractSpotifyId(url);
    const embedUrl = trackId
      ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`
      : url;

    return {
      provider: "spotify",
      url,
      title: data.title ?? "Unknown Track",
      artist: data.provider_name ?? "Unknown Artist",
      artworkUrl: data.thumbnail_url ?? null,
      embedUrl,
    };
  } catch {
    return buildFallbackMetadata(url);
  }
}

function buildFallbackMetadata(url: string): SpotifyMetadata {
  const trackId = extractSpotifyId(url);
  return {
    provider: "spotify",
    url,
    title: "Spotify Track",
    artist: "Unknown Artist",
    artworkUrl: null,
    embedUrl: trackId
      ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`
      : url,
  };
}
