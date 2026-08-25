import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ImageResponse } from "@vercel/og";

const STORY_THEMES = {
  sunshine: {
    bg: "#FFE600",
    cardBg: "#FFFFFF",
    badgeBg: "#FF6584",
    badgeText: "#FFFFFF",
    accent: "#18181B",
  },
  bubblegum: {
    bg: "#FF6584",
    cardBg: "#FFFFFF",
    badgeBg: "#FFE600",
    badgeText: "#18181B",
    accent: "#18181B",
  },
  mint: {
    bg: "#4ADE80",
    cardBg: "#FFFFFF",
    badgeBg: "#38BDF8",
    badgeText: "#18181B",
    accent: "#18181B",
  },
  lavender: {
    bg: "#C084FC",
    cardBg: "#FFFFFF",
    badgeBg: "#FFE600",
    badgeText: "#18181B",
    accent: "#18181B",
  },
};

type ThemeKey = keyof typeof STORY_THEMES;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const responseId = searchParams.get("responseId");
  const dropId = searchParams.get("dropId");
  const themeParam = (searchParams.get("theme") ?? "sunshine") as ThemeKey;

  if (!responseId && !dropId) {
    return NextResponse.json({ error: "Missing responseId or dropId" }, { status: 400 });
  }

  const theme = STORY_THEMES[themeParam] ? themeParam : "sunshine";
  const t = STORY_THEMES[theme];

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let instagramUsername = "someone";
  let question = "Kirim lagu atau pesan anonim!";
  let message: string | null = null;
  let songTitle: string | null = null;
  let songArtist: string | null = null;
  let artworkUrl: string | null = null;

  if (responseId) {
    const { data: response } = await supabase
      .from("responses")
      .select("*, drops(instagram_username, question)")
      .eq("id", responseId)
      .single();

    if (!response) {
      return NextResponse.json({ error: "Response not found" }, { status: 404 });
    }

    const drop = response.drops;
    instagramUsername = drop?.instagram_username || "someone";
    question = drop?.question || "What's your vibe?";
    message = response.message
      ? response.message.length > 180
        ? response.message.slice(0, 177) + "..."
        : response.message
      : null;
    songTitle = response.song_title || null;
    songArtist = response.song_artist || null;
    artworkUrl = response.song_artwork_url || null;
  } else if (dropId) {
    const { data: drop } = await supabase
      .from("drops")
      .select("*")
      .eq("id", dropId)
      .single();

    if (!drop) {
      return NextResponse.json({ error: "Drop not found" }, { status: 404 });
    }

    instagramUsername = drop.instagram_username;
    question = drop.question;
    songTitle = drop.initial_song_title || null;
    songArtist = drop.initial_song_artist || null;
    artworkUrl = drop.initial_song_artwork || null;
    message = "Kirim lagu & pesan anonim kamu ke stiker link di bawah!";
  }

  const hasSong = !!(songTitle || artworkUrl);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1920px",
          backgroundColor: t.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "100px 70px 90px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Logo badge */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "6px solid #18181B",
              borderRadius: "28px",
              padding: "16px 36px",
              boxShadow: "8px 8px 0px #18181B",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "40px", fontWeight: 900, color: "#18181B", letterSpacing: "-1px" }}>
              VYBE
            </span>
          </div>

          {/* IG Username Pill */}
          <div
            style={{
              backgroundColor: t.badgeBg,
              color: t.badgeText,
              border: "6px solid #18181B",
              borderRadius: "999px",
              padding: "16px 36px",
              boxShadow: "8px 8px 0px #18181B",
              fontSize: "36px",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>@{instagramUsername}</span>
          </div>
        </div>

        {/* Center Main Card */}
        <div
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
            border: "8px solid #18181B",
            borderRadius: "48px",
            boxShadow: "14px 14px 0px #18181B",
            padding: "60px 50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "36px",
            textAlign: "center",
          }}
        >
          {/* Prompt Question */}
          <div
            style={{
              backgroundColor: t.bg,
              border: "4px solid #18181B",
              borderRadius: "24px",
              padding: "18px 36px",
              boxShadow: "5px 5px 0px #18181B",
              fontSize: "34px",
              fontWeight: 800,
              color: "#18181B",
              maxWidth: "850px",
            }}
          >
            {question}
          </div>

          {/* Song Card (if song attached) */}
          {hasSong && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "24px",
                width: "100%",
              }}
            >
              {artworkUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={artworkUrl}
                  alt="Album artwork"
                  style={{
                    width: "360px",
                    height: "360px",
                    borderRadius: "36px",
                    border: "6px solid #18181B",
                    boxShadow: "10px 10px 0px #18181B",
                    objectFit: "cover",
                  }}
                />
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span
                  style={{
                    fontSize: "52px",
                    fontWeight: 900,
                    color: "#18181B",
                    letterSpacing: "-1.5px",
                    lineHeight: 1.1,
                  }}
                >
                  {songTitle || "Lagu Favorit"}
                </span>
                <span
                  style={{
                    fontSize: "36px",
                    fontWeight: 700,
                    color: "#71717A",
                  }}
                >
                  {songArtist || "Unknown Artist"}
                </span>
              </div>
            </div>
          )}

          {/* Message Box */}
          {message && (
            <div
              style={{
                backgroundColor: "#FFFDF5",
                border: "5px solid #18181B",
                borderRadius: "32px",
                padding: "36px 44px",
                boxShadow: "8px 8px 0px #18181B",
                fontSize: hasSong ? "38px" : "48px",
                fontWeight: 700,
                color: "#18181B",
                lineHeight: 1.35,
                maxWidth: "850px",
                display: "flex",
              }}
            >
              &ldquo;{message}&rdquo;
            </div>
          )}
        </div>

        {/* Bottom Footer Call to Action */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "6px solid #18181B",
              borderRadius: "999px",
              padding: "18px 48px",
              boxShadow: "8px 8px 0px #18181B",
              fontSize: "34px",
              fontWeight: 800,
              color: "#18181B",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span>Buka link di stiker:</span>
            <span style={{ color: "#FF6584" }}>vybe-app-lime.vercel.app</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
