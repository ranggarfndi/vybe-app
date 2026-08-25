"use client";

import { useState } from "react";
import type { Drop, DropResponse, StoryTheme } from "@/types";

interface StoryModalProps {
  response: DropResponse;
  drop: Drop;
  onClose: () => void;
}

const THEMES: {
  id: StoryTheme;
  label: string;
  bg: string;
}[] = [
  { id: "sunshine", label: "Kuning", bg: "#FFE600" },
  { id: "bubblegum", label: "Pink", bg: "#FF6584" },
  { id: "mint", label: "Mint", bg: "#4ADE80" },
  { id: "lavender", label: "Lavender", bg: "#C084FC" },
];

export default function StoryModal({ response, drop, onClose }: StoryModalProps) {
  const [selectedTheme, setSelectedTheme] = useState<StoryTheme>("sunshine");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showIgGuide, setShowIgGuide] = useState(false);

  const imageUrl = `/api/stories/generate?responseId=${response.id}&theme=${selectedTheme}`;
  const dropPublicUrl = typeof window !== "undefined" ? `${window.location.origin}/d/${drop.id}` : "";

  async function handleDownload() {
    setIsDownloading(true);
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vybe-${drop.instagram_username}-${selectedTheme}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      if (dropPublicUrl) {
        await navigator.clipboard.writeText(dropPublicUrl);
      }
      setShowIgGuide(true);
    } catch {
      window.open(imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleShare() {
    setIsSharing(true);
    try {
      // 1. Always copy drop link to clipboard
      if (dropPublicUrl) {
        try {
          await navigator.clipboard.writeText(dropPublicUrl);
        } catch {
          // ignore
        }
      }

      // 2. Fetch image blob
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], `vybe-${drop.instagram_username}.png`, { type: "image/png" });

      // 3. Try native Web Share API with image file
      if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `VYBE @${drop.instagram_username}`,
            text: `Kirim pesan anonim & lagu ke @${drop.instagram_username}: ${dropPublicUrl}`,
            files: [file],
          });
          setShowIgGuide(true);
        } catch (err: any) {
          if (err.name !== "AbortError") {
            await handleDownload();
          }
        }
      } else {
        // Fallback: auto download + show guide
        await handleDownload();
      }
    } catch {
      await handleDownload();
    } finally {
      setIsSharing(false);
    }
  }

  function handleCopyLink() {
    if (dropPublicUrl) {
      void navigator.clipboard.writeText(dropPublicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  function handleOpenInstagram() {
    // Deep-link to open Instagram story camera on mobile
    window.location.href = "instagram://story-camera";
    setTimeout(() => {
      window.location.href = "https://instagram.com";
    }, 1500);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-pop overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal Dialog Container (Max 700px on Desktop, Centered) */}
      <div className="v-card max-w-[700px] w-full p-5 sm:p-6 bg-white shadow-[8px_8px_0px_#000] max-h-[92vh] overflow-y-auto my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b-2 border-zinc-100">
          <div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-zinc-900">
              Bikin Story Card (9:16)
            </h3>
            <p className="text-xs text-zinc-500 font-semibold mt-0.5">
              Tampilan persis sesuai dengan hasil download untuk Instagram Stories
            </p>
          </div>
          <button
            onClick={onClose}
            className="v-btn v-btn-sm bg-zinc-100 px-3 py-1 text-xs font-black"
            aria-label="Tutup"
          >
            Tutup
          </button>
        </div>

        {/* 2-Column Grid on Desktop / Stack on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Direct High-Res Image Preview (100% Genuine File Render) */}
          <div className="sm:col-span-6 flex flex-col items-center justify-center">
            <div className="w-[230px] sm:w-[250px] aspect-[9/16] rounded-[24px] border-[3px] border-zinc-900 shadow-[6px_6px_0px_#000] overflow-hidden bg-zinc-100 relative flex items-center justify-center">
              
              {/* Spinner while image generates/loads */}
              {isImageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/90 z-10">
                  <span className="text-xs font-bold text-zinc-600">Menyiapkan kartu...</span>
                </div>
              )}

              {/* Real 1080x1920 Story Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={imageUrl}
                src={imageUrl}
                alt={`VYBE Story @${drop.instagram_username}`}
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
                className="w-full h-full object-cover select-none"
              />
            </div>
          </div>

          {/* Right Column: Controls, Theme Selection, Actions */}
          <div className="sm:col-span-6 flex flex-col gap-4">
            
            {/* Theme Picker */}
            <div>
              <label className="block text-xs font-display font-bold text-zinc-600 mb-2 uppercase tracking-wider">
                Pilih Warna Tema:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((t) => {
                  const isSelected = selectedTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        if (selectedTheme !== t.id) {
                          setIsImageLoading(true);
                          setSelectedTheme(t.id);
                        }
                      }}
                      style={{ backgroundColor: t.bg }}
                      className={`py-2.5 px-2 rounded-xl text-xs font-display font-bold border-2 border-zinc-900 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? "shadow-[3px_3px_0px_#000] -translate-y-0.5 ring-2 ring-black font-black"
                          : "opacity-80 hover:opacity-100 shadow-[1px_1px_0px_#000]"
                      }`}
                    >
                      <span className="text-zinc-900">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="v-btn v-btn-pink w-full py-3.5 text-sm sm:text-base font-display font-black shadow-[3.5px_3.5px_0px_#000]"
              >
                {isSharing ? "Menyiapkan..." : "Share ke Instagram Story"}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="v-btn bg-white v-btn-sm flex-1 text-xs font-bold"
                >
                  {isDownloading ? "Mengunduh..." : "Simpan Gambar"}
                </button>
                <button
                  onClick={handleCopyLink}
                  className="v-btn bg-white v-btn-sm flex-1 text-xs font-bold"
                >
                  {copied ? "Link Tersalin!" : "Salin Link Drop"}
                </button>
              </div>
            </div>

            {/* Step-by-Step IG Story Guide Banner */}
            {showIgGuide ? (
              <div className="p-4 bg-[#FFE600] rounded-2xl border-2 border-zinc-900 text-zinc-900 shadow-[3px_3px_0px_#000] animate-pop space-y-2.5">
                <p className="font-display font-black text-sm text-black">
                  Langkah Share ke Instagram Story:
                </p>
                <ol className="text-xs font-semibold space-y-1.5 list-decimal list-inside text-zinc-800 leading-relaxed">
                  <li>Gambar sudah tersimpan di galeri HP kamu.</li>
                  <li>Link Drop kamu sudah <strong>otomatis tersalin</strong> di Clipboard.</li>
                  <li>Buka Instagram Story, pilih gambar tadi, lalu tempel link via <strong>Stiker Tautan (Link Sticker)</strong>!</li>
                </ol>
                <button
                  onClick={handleOpenInstagram}
                  className="v-btn bg-white w-full py-2.5 text-xs font-display font-black border-2 border-black mt-2 shadow-[2px_2px_0px_#000]"
                >
                  Buka Aplikasi Instagram
                </button>
              </div>
            ) : (
              <div className="p-3 bg-[#FFFDF5] rounded-xl border border-zinc-200 text-[11px] text-zinc-600 font-medium leading-relaxed">
                <strong className="text-zinc-900 font-bold block mb-0.5">Cara Pasang Link di IG Story:</strong>
                Klik tombol <strong>Share</strong>, sistem akan otomatis menyimpan gambar dan menyalin link drop kamu. Di Instagram Story, pasang link via <strong>Stiker Tautan (Link Sticker)</strong> agar temanmu bisa klik langsung!
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
