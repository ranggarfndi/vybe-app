import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ImageResponse } from "@vercel/og";
import QRCode from "qrcode";

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
  let targetDropId = dropId;

  if (responseId) {
    const { data: response } = await supabase
      .from("responses")
      .select("*, drops(id, instagram_username, question)")
      .eq("id", responseId)
      .single();

    if (!response) {
      return NextResponse.json({ error: "Response not found" }, { status: 404 });
    }

    const drop = response.drops;
    targetDropId = drop?.id || response.drop_id;
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

    targetDropId = drop.id;
    instagramUsername = drop.instagram_username;
    question = drop.question;
    songTitle = drop.initial_song_title || null;
    songArtist = drop.initial_song_artist || null;
    artworkUrl = drop.initial_song_artwork || null;
    message = "Kirim lagu & pesan anonim kamu ke stiker link di bawah!";
  }

  // Generate QR Code data URL
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vybe-app-lime.vercel.app";
  const targetUrl = targetDropId ? `${appBaseUrl}/d/${targetDropId}` : `${appBaseUrl}`;
  
  let qrDataUrl = "";
  try {
    qrDataUrl = await QRCode.toDataURL(targetUrl, {
      margin: 1,
      width: 280,
      color: {
        dark: "#18181B",
        light: "#FFFFFF",
      },
    });
  } catch (err) {
    console.error("QR Generation error:", err);
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
          padding: "85px 65px 75px",
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
              padding: "14px 34px",
              boxShadow: "8px 8px 0px #18181B",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "38px", fontWeight: 900, color: "#18181B", letterSpacing: "-1px" }}>
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
              padding: "14px 34px",
              boxShadow: "8px 8px 0px #18181B",
              fontSize: "34px",
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
            borderRadius: "44px",
            boxShadow: "14px 14px 0px #18181B",
            padding: "50px 44px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            textAlign: "center",
          }}
        >
          {/* Prompt Question */}
          <div
            style={{
              backgroundColor: t.bg,
              border: "4px solid #18181B",
              borderRadius: "24px",
              padding: "16px 32px",
              boxShadow: "5px 5px 0px #18181B",
              fontSize: "32px",
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
                gap: "20px",
                width: "100%",
              }}
            >
              {artworkUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={artworkUrl}
                  alt="Album artwork"
                  style={{
                    width: "330px",
                    height: "330px",
                    borderRadius: "32px",
                    border: "6px solid #18181B",
                    boxShadow: "10px 10px 0px #18181B",
                    objectFit: "cover",
                  }}
                />
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: "6px",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    fontSize: "48px",
                    fontWeight: 900,
                    color: "#18181B",
                    letterSpacing: "-1.5px",
                    lineHeight: 1.15,
                    textAlign: "center",
                    maxWidth: "850px",
                  }}
                >
                  {songTitle || "Lagu Favorit"}
                </span>
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: 700,
                    color: "#71717A",
                    textAlign: "center",
                    maxWidth: "850px",
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
                borderRadius: "30px",
                padding: "30px 40px",
                boxShadow: "8px 8px 0px #18181B",
                fontSize: hasSong ? "36px" : "46px",
                fontWeight: 700,
                color: "#18181B",
                lineHeight: 1.35,
                maxWidth: "850px",
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              &ldquo;{message}&rdquo;
            </div>
          )}
        </div>

        {/* Bottom Footer Call to Action with Scannable QR Code */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            width: "100%",
          }}
        >
          {/* Scannable QR Code Box */}
          {qrDataUrl && (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "6px solid #18181B",
                borderRadius: "28px",
                padding: "12px",
                boxShadow: "8px 8px 0px #18181B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="QR Code"
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "12px",
                }}
              />
            </div>
          )}

          {/* Scan Instructions Pill */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              backgroundColor: "#FFFFFF",
              border: "6px solid #18181B",
              borderRadius: "32px",
              padding: "18px 36px",
              boxShadow: "8px 8px 0px #18181B",
            }}
          >
            <span style={{ fontSize: "30px", fontWeight: 900, color: "#18181B" }}>
              Scan QR untuk kirim lagu & pesan
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "24px", fontWeight: 700, color: "#71717A" }}>
                atau buka link:
              </span>
              <span style={{ fontSize: "25px", fontWeight: 900, color: "#FF6584" }}>
                vybe-app-lime.vercel.app
              </span>
            </div>
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
