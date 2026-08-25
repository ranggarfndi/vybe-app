"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Drop, SpotifyTrack } from "@/types";
import SpotifySearchPicker from "@/components/music/SpotifySearchPicker";
import Footer from "@/components/common/Footer";

interface DropResponseClientProps {
  drop: Drop;
  isJustCreated: boolean;
}

export default function DropResponseClient({
  drop,
  isJustCreated,
}: DropResponseClientProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(isJustCreated);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("vybe_my_drops");
      if (saved) {
        const drops = JSON.parse(saved);
        if (drops.some((d: any) => d.id === drop.id)) {
          setIsOwner(true);
        }
      }
    } catch {
      // ignore
    }
  }, [drop.id]);

  async function handleCopy() {
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(window.location.href.split("?")[0]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  async function handleShareNative() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `@${drop.instagram_username} di VYBE`,
          text: drop.question,
          url: window.location.href.split("?")[0],
        });
      } catch {
        // User cancelled
      }
    } else {
      await handleCopy();
    }
  }

  async function handleSubmitResponse(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTrack && !message.trim()) {
      setErrorMsg("Pilih lagu atau tulis pesan terlebih dahulu ya!");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const supabase = createClient();

      const { error } = await supabase.from("responses").insert({
        drop_id: drop.id,
        message: message.trim() || null,
        music_provider: selectedTrack ? "spotify" : null,
        music_url: selectedTrack?.spotifyUrl || null,
        song_title: selectedTrack?.title || null,
        song_artist: selectedTrack?.artist || null,
        song_artwork_url: selectedTrack?.artworkUrl || null,
        preview_url: selectedTrack?.previewUrl || null,
        status: "active",
      });

      if (error) {
        console.error("Submission error:", error);
        setErrorMsg(error?.message || "Gagal mengirim respons. Coba lagi sebentar.");
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kendala koneksi.");
      setIsSubmitting(false);
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

          <div className="flex items-center gap-3">
            {mounted && isOwner ? (
              <Link
                href={`/d/${drop.id}/inbox`}
                className="v-btn v-btn-sm v-btn-pink"
              >
                Buka Inbox
              </Link>
            ) : (
              <Link
                href="/"
                className="v-btn v-btn-sm v-btn-yellow"
              >
                + Bikin VYBE Baru
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Section with Spacious Stack Layout */}
      <section className="v-hero-section">
        <div className="v-container-medium">
          <div className="v-stack-cards">
            
            {/* Creator Share Banner (If viewing own drop) */}
            {mounted && isOwner && (
              <div className="v-card-yellow animate-pop">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="font-display font-bold text-lg text-zinc-900">
                    Link VYBE Kamu Sudah Siap!
                  </span>
                  <span className="text-xs v-badge bg-white px-2.5 py-0.5 text-zinc-900 shrink-0">
                    Mode Pembuat
                  </span>
                </div>
                <p className="text-sm text-zinc-800 font-medium mb-6 leading-relaxed">
                  Bagikan link ini ke Instagram Story kamu agar teman-temanmu bisa kirim lagu &amp; pesan anonim!
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCopy}
                    className="v-btn bg-white v-btn-sm flex-1 text-sm font-bold"
                  >
                    {copied ? "Link Tersalin!" : "Salin Link"}
                  </button>
                  <button
                    onClick={handleShareNative}
                    className="v-btn v-btn-pink v-btn-sm flex-1 text-sm font-bold"
                  >
                    Share ke IG Story
                  </button>
                  <Link
                    href={`/d/${drop.id}/inbox`}
                    className="v-btn v-btn-cyan v-btn-sm text-sm font-bold"
                  >
                    Buka Inbox
                  </Link>
                </div>
              </div>
            )}

            {/* Drop Question Card */}
            <div className="v-card-cream text-center">
              {/* IG Profile Badge */}
              <div className="inline-flex items-center gap-1.5 v-badge bg-[#FF6584] text-white px-4 py-1 text-sm mb-5">
                <span>@{drop.instagram_username}</span>
              </div>

              {/* Prompt Question */}
              <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-900 leading-snug mb-5">
                {drop.question}
              </h1>

              {/* Initial Favorite Song (if attached by creator) */}
              {drop.initial_song_title && (
                <div className="v-card-sm bg-white p-4 inline-flex items-center gap-3.5 text-left max-w-md mx-auto my-3 shadow-[3px_3px_0px_#000]">
                  {drop.initial_song_artwork && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={drop.initial_song_artwork}
                      alt={drop.initial_song_title}
                      className="w-14 h-14 rounded-2xl border-2 border-zinc-900 object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <span className="text-[10px] v-badge bg-[#FFE600] px-2 py-0.2 mb-1 inline-block">Lagu Pilihan @{drop.instagram_username}</span>
                    <p className="font-display font-bold text-base truncate text-zinc-900">
                      {drop.initial_song_title}
                    </p>
                    <p className="text-xs text-zinc-600 truncate font-semibold">{drop.initial_song_artist}</p>
                  </div>
                </div>
              )}

              <p className="text-xs text-zinc-400 font-bold mt-4">
                Identitasmu 100% anonim (tidak akan diketahui @{drop.instagram_username})
              </p>
            </div>

            {/* Success Screen / Form */}
            {isSuccess ? (
              <div className="v-card-green text-center animate-pop p-10 sm:p-14">
                <h2 className="font-display font-black text-3xl sm:text-4xl text-zinc-900 mb-3">
                  Terkirim Anonim!
                </h2>
                <p className="text-base font-medium text-zinc-800 mb-8 max-w-sm mx-auto leading-relaxed">
                  Lagu dan pesan rahasiamu berhasil dikirim ke <strong>@{drop.instagram_username}</strong>!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setMessage("");
                      setSelectedTrack(null);
                    }}
                    className="v-btn bg-white py-4 text-base font-bold flex-1"
                  >
                    Kirim Pesan Lain
                  </button>
                  <Link
                    href="/"
                    className="v-btn v-btn-yellow py-4 text-base font-bold text-center flex-1"
                  >
                    Bikin VYBE Kamu
                  </Link>
                </div>
              </div>
            ) : (
              /* Response Form Card */
              <div className="v-card bg-white">
                <form onSubmit={handleSubmitResponse} className="v-form">
                  {/* Spotify Track Picker */}
                  <div className="v-form-group">
                    <label className="v-label justify-between">
                      <span>Pilih Lagu Spotify:</span>
                      <span className="text-xs text-zinc-400 font-normal">Ketik judul / artis</span>
                    </label>
                    <SpotifySearchPicker
                      onSelectTrack={setSelectedTrack}
                      selectedTrack={selectedTrack}
                    />
                  </div>

                  {/* Anonymous Message Textarea */}
                  <div className="v-form-group">
                    <label className="v-label">
                      <span>Tulis Pesan / Alasan (Opsional):</span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        maxLength={300}
                        placeholder="Ketik pesan rahasiamu di sini..."
                        className="v-textarea"
                      />
                      <div className="flex justify-between items-center mt-2 text-xs text-zinc-400 font-bold px-1">
                        <span>Pesan ini dikirim secara anonim</span>
                        <span>{message.length}/300</span>
                      </div>
                    </div>
                  </div>

                  {/* Error Alert */}
                  {errorMsg && (
                    <div className="p-4 bg-[#FF6584]/15 border-2 border-[#FF6584] rounded-2xl text-[#FF6584] font-bold text-sm">
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="v-btn v-btn-pink v-btn-lg w-full py-4 text-xl font-display font-black tracking-wide"
                  >
                    {isSubmitting ? (
                      <span>Mengirim Anonim...</span>
                    ) : (
                      <span>Kirim Pesan Anonim</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Footer Link */}
            <div className="text-center pt-4 pb-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 v-badge bg-white px-6 py-2.5 text-xs text-zinc-700 hover:text-black transition-colors"
              >
                Mau punya VYBE sendiri? Buat gratis di sini
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />
    </main>
  );
}
