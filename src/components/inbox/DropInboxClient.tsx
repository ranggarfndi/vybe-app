"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import type { Drop, DropResponse } from "@/types";
import StoryModal from "@/components/story/StoryModal";
import Footer from "@/components/common/Footer";
import { createClient } from "@/lib/supabase/client";

interface DropInboxClientProps {
  drop: Drop;
  initialResponses: DropResponse[];
}

export default function DropInboxClient({
  drop,
  initialResponses,
}: DropInboxClientProps) {
  const [responses, setResponses] = useState<DropResponse[]>(initialResponses);
  const [selectedResponse, setSelectedResponse] = useState<DropResponse | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [copied, setCopied] = useState(false);

  function handlePlayAudio(resp: DropResponse, e: React.MouseEvent) {
    e.stopPropagation();
    if (!resp.preview_url) return;

    if (playingId === resp.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(resp.preview_url);
      audioRef.current = audio;
      audio.play();
      setPlayingId(resp.id);
      audio.onended = () => setPlayingId(null);
    }
  }

  async function handleDelete(responseId: string) {
    if (!confirm("Hapus pesan ini?")) return;
    const supabase = createClient();
    await supabase
      .from("responses")
      .update({ status: "deleted" })
      .eq("id", responseId);

    setResponses((prev) => prev.filter((r) => r.id !== responseId));
  }

  async function handleCopyDropLink() {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/d/${drop.id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900" suppressHydrationWarning>
      {/* Top Navbar */}
      <header className="v-navbar">
        <div className="v-container-wide flex items-center justify-between">
          <Link href="/" className="no-underline flex items-center group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="VYBE Logo"
              className="h-10 sm:h-11 w-auto rounded-xl border-2 border-zinc-900 object-contain shadow-[2px_2px_0px_#000] transition-transform group-hover:scale-105"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={`/d/${drop.id}`}
              className="v-btn v-btn-sm bg-white text-xs font-bold"
            >
              Lihat Drop
            </Link>
            <Link
              href="/"
              className="v-btn v-btn-sm v-btn-yellow text-xs font-bold"
            >
              + Bikin Baru
            </Link>
          </div>
        </div>
      </header>

      {/* Main Inbox Section with Spacious Stack Layout */}
      <section className="v-hero-section">
        <div className="v-container-medium">
          <div className="v-stack-cards">
            
            {/* Inbox Header Card */}
            <div className="v-card-cream">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 v-badge bg-[#FF6584] text-white px-3.5 py-0.5 text-xs mb-3">
                    <span>@{drop.instagram_username}</span>
                  </div>
                  <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-900">
                    Inbox Respons ({responses.length})
                  </h1>
                </div>

                <button
                  onClick={handleCopyDropLink}
                  className="v-btn v-btn-yellow v-btn-sm text-xs font-bold self-start sm:self-auto"
                >
                  {copied ? "Link Tersalin!" : "Salin Link Drop"}
                </button>
              </div>

              <div className="v-card-sm bg-white text-sm sm:text-base font-medium text-zinc-800 p-4 shadow-[2.5px_2.5px_0px_#000]">
                <strong>Pertanyaan Drop:</strong> &ldquo;{drop.question}&rdquo;
              </div>
            </div>

            {/* Empty State or Responses List */}
            {responses.length === 0 ? (
              <div className="v-card text-center bg-white animate-pop p-10 sm:p-16">
                <h3 className="font-display font-black text-2xl sm:text-3xl mb-3 text-zinc-900">
                  Belum ada respons masuk
                </h3>
                <p className="text-base text-zinc-600 font-medium max-w-md mx-auto mb-8 leading-relaxed">
                  Bagikan link VYBE kamu ke Instagram Story agar teman-temanmu bisa kirim lagu &amp; pesan rahasia!
                </p>
                <button
                  onClick={handleCopyDropLink}
                  className="v-btn v-btn-pink py-4 px-8 text-base font-bold shadow-[4px_4px_0px_#000]"
                >
                  {copied ? "Link Tersalin!" : "Salin Link untuk IG Story"}
                </button>
              </div>
            ) : (
              /* Response Cards List with Mobile-Responsive Song Card */
              <div className="v-stack-responses">
                {responses.map((resp) => {
                  const hasSong = !!(resp.song_title || resp.song_artwork_url);

                  return (
                    <div
                      key={resp.id}
                      className="v-card bg-white flex flex-col gap-5 p-6 sm:p-8 shadow-[5px_5px_0px_#000]"
                    >
                      {/* Song Card — Perfectly Responsive on Mobile & Desktop */}
                      {hasSong && (
                        <div className="v-card-yellow p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Left: Artwork + Title & Artist */}
                          <div className="flex items-center gap-3.5 min-w-0 flex-1 overflow-hidden">
                            {resp.song_artwork_url && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={resp.song_artwork_url}
                                alt={resp.song_title || "Song"}
                                className="w-14 h-14 rounded-2xl border-2 border-zinc-900 object-cover shrink-0 shadow-[2px_2px_0px_#000]"
                              />
                            )}
                            <div className="min-w-0 flex-1 overflow-hidden">
                              <span className="text-[10px] v-badge bg-white px-2 py-0.2 mb-1 inline-block shrink-0">
                                Rekomendasi Lagu
                              </span>
                              <p className="font-display font-bold text-base text-zinc-900 truncate">
                                {resp.song_title}
                              </p>
                              <p className="text-xs text-zinc-800 font-semibold truncate">
                                {resp.song_artist}
                              </p>
                            </div>
                          </div>

                          {/* Right: Audio Preview & Spotify Link */}
                          <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                            {resp.preview_url && (
                              <button
                                onClick={(e) => handlePlayAudio(resp, e)}
                                className="v-btn v-btn-sm v-btn-cyan text-xs flex-1 sm:flex-initial"
                                title="Dengar preview"
                              >
                                {playingId === resp.id ? "Pause" : "Play Preview"}
                              </button>
                            )}
                            {resp.music_url && (
                              <a
                                href={resp.music_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="v-btn v-btn-sm bg-white text-xs flex-1 sm:flex-initial text-center"
                                title="Buka di Spotify"
                              >
                                Spotify
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Message Bubble */}
                      {resp.message && (
                        <div className="p-4 sm:p-5 bg-[#FFFDF9] rounded-2xl border-2 border-zinc-900 font-medium text-base text-zinc-900 leading-relaxed shadow-[2px_2px_0px_#000]">
                          &ldquo;{resp.message}&rdquo;
                        </div>
                      )}

                      {/* Footer Meta & Actions — Clean & Separated */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-100 text-xs">
                        <div className="flex items-center gap-3 text-zinc-500 font-semibold">
                          <span suppressHydrationWarning>
                            Anonim · {formatRelativeTime(resp.created_at)}
                          </span>
                          <span className="text-zinc-300">|</span>
                          <button
                            onClick={() => handleDelete(resp.id)}
                            className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>

                        {/* Story Card Trigger */}
                        <button
                          onClick={() => setSelectedResponse(resp)}
                          className="v-btn v-btn-sm v-btn-pink font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000]"
                        >
                          Bikin Story Card
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Story Generation Modal */}
      {selectedResponse && (
        <StoryModal
          response={selectedResponse}
          drop={drop}
          onClose={() => setSelectedResponse(null)}
        />
      )}

      {/* Shared Footer */}
      <Footer />
    </main>
  );
}
