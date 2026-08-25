import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createResponseSchema } from "@/lib/validations";
import { isValidSpotifyUrl } from "@/lib/utils";
import { fetchSpotifyMetadata } from "@/lib/spotify";
import {
  checkAnonResponseLimit,
  checkIpLimit,
  getClientIp,
} from "@/lib/rate-limit";
import {
  generateAnonSessionId,
  hashAnonSessionId,
  ANON_SESSION_COOKIE,
  ANON_SESSION_OPTIONS,
} from "@/lib/anon-session";

// Service client for server-side inserts (bypasses RLS for responses table)
function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createResponseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { dropId, message, spotifyUrl } = parsed.data;

    // Validate Spotify URL if provided
    if (spotifyUrl && !isValidSpotifyUrl(spotifyUrl)) {
      return NextResponse.json(
        { error: "Invalid Spotify URL. Please use open.spotify.com/track/..." },
        { status: 400 }
      );
    }

    // ── Anonymous session ─────────────────────────────────────
    const cookieStore = await cookies();
    let sessionId = cookieStore.get(ANON_SESSION_COOKIE)?.value;
    let isNewSession = false;

    if (!sessionId) {
      sessionId = generateAnonSessionId();
      isNewSession = true;
    }

    const sessionHash = hashAnonSessionId(sessionId);

    // ── Rate limiting ─────────────────────────────────────────
    const ip = getClientIp(request.headers);
    const ipLimit = checkIpLimit(ip);
    const anonLimit = checkAnonResponseLimit(sessionHash);

    if (!ipLimit.allowed || !anonLimit.allowed) {
      return NextResponse.json(
        { error: "You're sending responses too quickly. Try again later." },
        { status: 429 }
      );
    }

    // ── Get authenticated user (optional) ─────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // ── Fetch drop info ───────────────────────────────────────
    const { data: drop } = await supabase
      .from("drops")
      .select("id, owner_id, requires_song, allows_anonymous, is_active, expires_at")
      .eq("id", dropId)
      .single();

    if (!drop || !drop.is_active) {
      return NextResponse.json({ error: "Drop not found or inactive." }, { status: 404 });
    }

    if (!drop.allows_anonymous && !user) {
      return NextResponse.json(
        { error: "This drop requires an account to respond." },
        { status: 403 }
      );
    }

    if (drop.expires_at && new Date(drop.expires_at) < new Date()) {
      return NextResponse.json({ error: "This drop has expired." }, { status: 410 });
    }

    if (drop.requires_song && !spotifyUrl) {
      return NextResponse.json(
        { error: "This drop requires a Spotify link." },
        { status: 400 }
      );
    }

    // ── Check block list ──────────────────────────────────────
    const { data: block } = await supabase
      .from("blocks")
      .select("id")
      .eq("owner_user_id", drop.owner_id)
      .eq("blocked_anon_hash", sessionHash)
      .single();

    if (block) {
      // Silently drop blocked senders (don't reveal they're blocked)
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // ── Fetch Spotify metadata ────────────────────────────────
    let songTitle: string | undefined;
    let songArtist: string | undefined;
    let songArtworkUrl: string | undefined;

    if (spotifyUrl) {
      const meta = await fetchSpotifyMetadata(spotifyUrl);
      if (meta) {
        songTitle = meta.title;
        songArtist = meta.artist;
        songArtworkUrl = meta.artworkUrl ?? undefined;
      }
    }

    // ── Insert response via service role ──────────────────────
    const serviceClient = getServiceClient();
    const { error: insertError } = await serviceClient
      .from("responses")
      .insert({
        drop_id: dropId,
        owner_id: drop.owner_id,
        sender_user_id: user?.id ?? null,
        anonymous_session_hash: user ? null : sessionHash,
        message: message ?? null,
        music_provider: spotifyUrl ? "spotify" : null,
        music_url: spotifyUrl ?? null,
        song_title: songTitle ?? null,
        song_artist: songArtist ?? null,
        song_artwork_url: songArtworkUrl ?? null,
        status: "active",
      });

    if (insertError) {
      console.error("[responses] insert error:", insertError);
      return NextResponse.json(
        { error: "We couldn't send your response. Please try again." },
        { status: 500 }
      );
    }

    // ── Increment response_count ──────────────────────────────
    await serviceClient.rpc("increment_response_count", { drop_id: dropId }).maybeSingle();

    // ── Build response with session cookie ───────────────────
    const response = NextResponse.json({ success: true }, { status: 200 });

    if (isNewSession) {
      response.cookies.set(ANON_SESSION_COOKIE, sessionId, ANON_SESSION_OPTIONS);
    }

    return response;
  } catch (err) {
    console.error("[responses] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
