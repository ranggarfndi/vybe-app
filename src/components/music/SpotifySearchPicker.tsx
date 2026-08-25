"use client";

import { useState, useEffect, useRef } from "react";
import type { SpotifyTrack } from "@/types";

interface SpotifySearchPickerProps {
  onSelectTrack: (track: SpotifyTrack | null) => void;
  selectedTrack?: SpotifyTrack | null;
}

export default function SpotifySearchPicker({
  onSelectTrack,
  selectedTrack: initialTrack,
}: SpotifySearchPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(
    initialTrack ?? null
  );
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialTrack !== undefined) {
      setSelectedTrack(initialTrack);
    }
  }, [initialTrack]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/spotify/search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data.tracks || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  function handleSelect(track: SpotifyTrack) {
    setSelectedTrack(track);
    onSelectTrack(track);
    setQuery("");
    setResults([]);
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
    }
  }

  function handleRemove() {
    setSelectedTrack(null);
    onSelectTrack(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
    }
  }

  function handlePlayPreview(track: SpotifyTrack, e: React.MouseEvent) {
    e.stopPropagation();
    if (!track.previewUrl) return;

    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(track.previewUrl);
      audioRef.current = audio;
      audio.play();
      setPlayingId(track.id);
      audio.onended = () => setPlayingId(null);
    }
  }

  return (
    <div className="v-search-box">
      {/* Selected track preview card */}
      {selectedTrack ? (
        <div className="v-card-yellow p-4 sm:p-5 flex items-center justify-between gap-3 animate-pop w-full min-w-0 overflow-hidden">
          <div className="v-track-info">
            {selectedTrack.artworkUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedTrack.artworkUrl}
                alt={selectedTrack.title}
                className="v-track-art shadow-[2px_2px_0px_#000]"
              />
            )}
            <div className="v-track-text">
              <span className="text-[10px] v-badge bg-white px-2 py-0.2 mb-0.5 inline-block shrink-0">
                Lagu Terpilih
              </span>
              <span className="v-track-title">
                {selectedTrack.title}
              </span>
              <span className="v-track-artist">
                {selectedTrack.artist}
              </span>
            </div>
          </div>

          <div className="v-track-actions">
            {selectedTrack.previewUrl && (
              <button
                type="button"
                onClick={(e) => handlePlayPreview(selectedTrack, e)}
                className="v-btn v-btn-sm v-btn-cyan text-xs"
                title="Dengar Preview"
              >
                {playingId === selectedTrack.id ? "Pause" : "Play"}
              </button>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="v-btn v-btn-sm v-btn-pink text-xs"
              title="Hapus / Ganti Lagu"
            >
              Ganti
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full min-w-0">
          {/* Search input with input group */}
          <div className="v-input-group">
            <div className="v-input-addon text-xs font-black">
              CARI
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik judul lagu atau nama artis..."
              className="v-input-field font-medium text-base"
            />
            {isLoading && (
              <div className="flex items-center pr-4 text-xs font-bold text-zinc-400">
                Loading...
              </div>
            )}
          </div>

          {/* Results dropdown with guaranteed truncation */}
          {results.length > 0 && (
            <div className="v-search-dropdown">
              {results.map((track) => (
                <div
                  key={track.id}
                  onClick={() => handleSelect(track)}
                  className="v-track-item"
                >
                  <div className="v-track-info">
                    {track.artworkUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={track.artworkUrl}
                        alt={track.title}
                        className="v-track-art"
                      />
                    )}
                    <div className="v-track-text">
                      <span className="v-track-title">
                        {track.title}
                      </span>
                      <span className="v-track-artist">
                        {track.artist}
                      </span>
                    </div>
                  </div>

                  <div className="v-track-actions">
                    {track.previewUrl && (
                      <button
                        type="button"
                        onClick={(e) => handlePlayPreview(track, e)}
                        className="v-btn v-btn-sm bg-zinc-100 text-xs px-2.5"
                        title="Dengar preview"
                      >
                        {playingId === track.id ? "Pause" : "Play"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSelect(track)}
                      className="v-btn v-btn-sm v-btn-yellow text-xs px-3 font-bold"
                    >
                      Pilih
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
