"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PROMPT_TEMPLATES, type PromptTemplate, type SpotifyTrack } from "@/types";
import SpotifySearchPicker from "@/components/music/SpotifySearchPicker";
import Footer from "@/components/common/Footer";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [instagramUsername, setInstagramUsername] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate>(PROMPT_TEMPLATES[0]);
  const [customQuestion, setCustomQuestion] = useState(PROMPT_TEMPLATES[0].defaultQuestion);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [recentDrops, setRecentDrops] = useState<{ id: string; ig: string; question: string }[]>([]);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("vybe_my_drops");
      if (saved) {
        setRecentDrops(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  function handleSelectTemplate(template: PromptTemplate) {
    setSelectedTemplate(template);
    setCustomQuestion(template.defaultQuestion);
  }

  async function handleCreateDrop(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const cleanIg = instagramUsername.trim().replace(/^@/, "").toLowerCase();
    if (!cleanIg || cleanIg.length < 2) {
      setErrorMsg("Masukkan username Instagram kamu dulu ya! (contoh: @username)");
      return;
    }

    if (!customQuestion.trim()) {
      setErrorMsg("Tuliskan pertanyaan / prompt untuk VYBE kamu!");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const secretKey = "key_" + Math.random().toString(36).substring(2, 15);

      const { data, error } = await supabase
        .from("drops")
        .insert({
          instagram_username: cleanIg,
          secret_key: secretKey,
          type: selectedTemplate.type,
          question: customQuestion.trim(),
          theme: "sunshine",
          initial_song_title: selectedTrack?.title || null,
          initial_song_artist: selectedTrack?.artist || null,
          initial_song_artwork: selectedTrack?.artworkUrl || null,
          initial_song_url: selectedTrack?.spotifyUrl || null,
          is_active: true,
        })
        .select("id")
        .single();

      if (error || !data) {
        console.error("Drop creation error:", error);
        setErrorMsg(error?.message || "Gagal membuat VYBE. Silakan coba lagi sebentar.");
        setIsSubmitting(false);
        return;
      }

      // Save to localStorage for instant inbox access
      try {
        const existing = JSON.parse(localStorage.getItem("vybe_my_drops") || "[]");
        const updated = [
          { id: data.id, ig: cleanIg, question: customQuestion.trim(), key: secretKey },
          ...existing.filter((d: any) => d.id !== data.id),
        ].slice(0, 10);
        localStorage.setItem("vybe_my_drops", JSON.stringify(updated));
      } catch {
        // ignore
      }

      router.push(`/d/${data.id}?created=1`);
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kendala koneksi. Coba lagi ya!");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900" suppressHydrationWarning>
      {/* Top Navbar with explicit CSS class */}
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
            {mounted && recentDrops.length > 0 && (
              <Link
                href={`/d/${recentDrops[0].id}/inbox`}
                className="v-btn v-btn-sm v-btn-pink"
              >
                Inbox Saya ({recentDrops.length})
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero & Creator Section with explicit spacious class */}
      <section className="v-hero-section">
        <div className="v-container-wide">
          <div className="v-grid-hero">
            
            {/* Left Column: Headline, Subtitle, Story Mockup */}
            <div className="flex flex-col gap-8">
              <div>
                <div className="inline-flex items-center gap-2 v-badge bg-[#FFE600] mb-6 text-sm">
                  <span>Say it with a song on Instagram Stories</span>
                </div>

                <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-[3.5rem] text-zinc-900 leading-[1.15] mb-6">
                  Kirim Lagu &amp; Pesan{" "}
                  <span className="bg-[#FF6584] text-white px-4 py-1 rounded-2xl border-2 border-zinc-900 inline-block shadow-[3.5px_3.5px_0px_#000] rotate-[-1deg]">
                    Anonim
                  </span>{" "}
                  ke Teman IG Kamu!
                </h1>

                <p className="text-zinc-600 font-medium text-lg leading-relaxed mb-7">
                  Tanpa perlu login. Cukup masukkan IG kamu, bagikan link ke IG Stories, dan terima lagu serta pesan rahasia dari teman-temanmu!
                </p>

                {/* Value Prop Badges */}
                <div className="flex flex-wrap gap-3">
                  <span className="v-sticker text-sm bg-[#FFFDF9]">
                    100% Anonim
                  </span>
                  <span className="v-sticker text-sm bg-[#FFFDF9]">
                    Cari Lagu Spotify
                  </span>
                  <span className="v-sticker text-sm bg-[#FFFDF9]">
                    9:16 Story Card
                  </span>
                </div>
              </div>

              {/* Real-time Story Card Mockup (Desktop) */}
              <div className="hidden lg:block">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                  Preview Kartu IG Story (Real-Time):
                </p>

                <div className="v-card-yellow p-6 max-w-[360px]">
                  <div className="v-card p-6 bg-white flex flex-col gap-4 text-center">
                    {/* IG Pill Badge */}
                    <div className="inline-flex items-center justify-center gap-1.5 v-badge bg-[#FF6584] text-white text-xs py-1 px-3 mx-auto">
                      <span>@{instagramUsername.trim() || "username_kamu"}</span>
                    </div>

                    {/* Question Bubble */}
                    <div className="p-4 bg-[#FFFDF9] rounded-2xl border-2 border-zinc-900 font-display font-bold text-sm text-zinc-900 leading-snug">
                      &ldquo;{customQuestion || "Kirim lagu yang cocok buat aku!"}&rdquo;
                    </div>

                    {/* Song Mockup if picked */}
                    {selectedTrack ? (
                      <div className="v-card-sm p-3.5 bg-[#FFE600] flex items-center gap-3 text-left">
                        {selectedTrack.artworkUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={selectedTrack.artworkUrl}
                            alt="Song Art"
                            className="w-11 h-11 rounded-xl border-2 border-zinc-900 object-cover shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-display font-bold text-xs truncate text-zinc-900">
                            {selectedTrack.title}
                          </p>
                          <p className="text-[11px] text-zinc-700 truncate">
                            {selectedTrack.artist}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 border-2 border-dashed border-zinc-300 rounded-2xl text-xs font-bold text-zinc-400">
                        Temanmu bisa kirim lagu dari Spotify
                      </div>
                    )}

                    <div className="text-[11px] font-bold text-zinc-400 pt-1">
                      vybe.app/@{instagramUsername.trim() || "kamu"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Clean & Spacious Creator Card */}
            <div>
              <div className="v-card bg-white">
                <form onSubmit={handleCreateDrop} className="v-form">
                  
                  {/* Step 1: Instagram Username */}
                  <div className="v-form-group">
                    <label className="v-label">
                      <span className="v-step-badge bg-[#FF6584] text-white">1</span>
                      <span>Username Instagram Kamu:</span>
                    </label>
                    
                    <div className="v-input-group">
                      <div className="v-input-addon">
                        @
                      </div>
                      <input
                        type="text"
                        value={instagramUsername}
                        onChange={(e) => setInstagramUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ""))}
                        placeholder="username_kamu"
                        className="v-input-field font-display font-bold text-lg"
                        required
                      />
                    </div>
                    <p className="text-xs text-zinc-500 font-medium px-1">
                      Identitas agar teman-temanmu tahu ini link milik siapa di Instagram Story.
                    </p>
                  </div>

                  {/* Step 2: Prompt / Question Selection */}
                  <div className="v-form-group">
                    <label className="v-label">
                      <span className="v-step-badge bg-[#38BDF8] text-black">2</span>
                      <span>Pilih Tema Pertanyaan:</span>
                    </label>

                    {/* Template chips grid */}
                    <div className="v-prompt-grid">
                      {PROMPT_TEMPLATES.map((tmpl) => {
                        const isSelected = selectedTemplate.type === tmpl.type;
                        return (
                          <button
                            key={tmpl.type}
                            type="button"
                            onClick={() => handleSelectTemplate(tmpl)}
                            className={`v-prompt-btn ${isSelected ? "v-prompt-btn-active" : ""}`}
                          >
                            <span className="truncate">{tmpl.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Question Textarea */}
                    <div className="relative">
                      <textarea
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        rows={2}
                        maxLength={160}
                        className="v-textarea"
                        placeholder="Tulis pertanyaanmu sendiri..."
                      />
                      <span className="absolute right-4 bottom-3 text-xs font-bold text-zinc-400">
                        {customQuestion.length}/160
                      </span>
                    </div>
                  </div>

                  {/* Step 3: Spotify Track Selection */}
                  <div className="v-form-group">
                    <label className="v-label">
                      <span className="v-step-badge bg-[#4ADE80] text-black">3</span>
                      <span>Pasang Lagu Favoritmu (Opsional):</span>
                    </label>
                    <SpotifySearchPicker
                      onSelectTrack={setSelectedTrack}
                      selectedTrack={selectedTrack}
                    />
                  </div>

                  {/* Error Alert */}
                  {errorMsg && (
                    <div className="p-4 bg-[#FF6584]/15 border-2 border-[#FF6584] rounded-2xl text-[#FF6584] font-bold text-sm">
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="v-btn v-btn-yellow v-btn-lg w-full py-4 text-xl font-display font-black tracking-wide"
                  >
                    {isSubmitting ? (
                      <span>Membuat VYBE...</span>
                    ) : (
                      <span>Bikin VYBE Sekarang</span>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Recent Drops (if any) */}
      {mounted && recentDrops.length > 0 && (
        <section className="v-container-wide my-12">
          <h3 className="font-display font-black text-2xl text-zinc-900 mb-6 flex items-center gap-2.5">
            <span>VYBE yang Pernah Kamu Buat:</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDrops.map((drop) => (
              <div
                key={drop.id}
                className="v-card-sm bg-[#FFFDF9] flex flex-col justify-between gap-4"
              >
                <div>
                  <span className="v-badge bg-[#FF6584] text-white text-xs py-0.5 px-3 mb-2 inline-block">
                    @{drop.ig}
                  </span>
                  <p className="font-display font-bold text-base text-zinc-900 line-clamp-2">
                    {drop.question}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-200">
                  <Link
                    href={`/d/${drop.id}`}
                    className="v-btn v-btn-sm bg-white text-xs flex-1"
                  >
                    Buka Drop
                  </Link>
                  <Link
                    href={`/d/${drop.id}/inbox`}
                    className="v-btn v-btn-sm v-btn-pink text-xs flex-1"
                  >
                    Inbox
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How it Works Section with explicit spacious CSS classes */}
      <section className="v-how-section">
        <div className="v-container-wide">
          <div className="text-center mb-14">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-zinc-900 mb-3">
              Cara Pakainya <span className="bg-[#FFE600] px-3.5 py-1 rounded-2xl border-2 border-zinc-900 inline-block">Gampang Banget!</span>
            </h2>
            <p className="text-zinc-600 font-medium text-lg">
              Hanya butuh 3 langkah sederhana untuk mulai menerima lagu dan pesan seru.
            </p>
          </div>

          <div className="v-how-grid">
            <div className="v-card-cream text-center space-y-4">
              <span className="v-step-badge bg-[#FFE600] text-black text-lg w-10 h-10 mx-auto">1</span>
              <h4 className="font-display font-black text-xl text-zinc-900">Buat Link</h4>
              <p className="text-sm text-zinc-600 font-medium leading-relaxed">
                Masukkan username Instagram kamu &amp; pilih pertanyaan seru yang ingin kamu tanyakan ke followers.
              </p>
            </div>

            <div className="v-card-cream text-center space-y-4">
              <span className="v-step-badge bg-[#FF6584] text-white text-lg w-10 h-10 mx-auto">2</span>
              <h4 className="font-display font-black text-xl text-zinc-900">Share ke IG Story</h4>
              <p className="text-sm text-zinc-600 font-medium leading-relaxed">
                Salin link VYBE dan tempelkan di stiker tautan (Link Sticker) Instagram Story kamu.
              </p>
            </div>

            <div className="v-card-cream text-center space-y-4">
              <span className="v-step-badge bg-[#38BDF8] text-black text-lg w-10 h-10 mx-auto">3</span>
              <h4 className="font-display font-black text-xl text-zinc-900">Share Hasilnya!</h4>
              <p className="text-sm text-zinc-600 font-medium leading-relaxed">
                Buka respons di Inbox, klik tombol Story Card, dan download/share kartu 2D kartun 9:16 yang aesthetic!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />
    </main>
  );
}
