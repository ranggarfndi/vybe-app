// ============================================================
// VYBE — Global Types (2D Vector / No-Auth Edition)
// ============================================================

export type MusicProvider = "spotify" | "apple_music" | "youtube_music";

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  spotifyUrl: string;
  previewUrl?: string | null;
}

export type StoryTheme = "sunshine" | "bubblegum" | "mint" | "lavender";

export interface Drop {
  id: string;
  instagram_username: string;
  secret_key: string;
  type: DropType;
  question: string;
  theme: StoryTheme;
  initial_song_title?: string | null;
  initial_song_artist?: string | null;
  initial_song_artwork?: string | null;
  initial_song_url?: string | null;
  is_active: boolean;
  response_count: number;
  created_at: string;
  updated_at: string;
}

export type DropType =
  | "SEND_ME_A_SONG"
  | "DESCRIBE_ME_WITH_A_SONG"
  | "ANONYMOUS_MESSAGE"
  | "FIRST_IMPRESSION"
  | "SECRET_CONFESSION"
  | "VIBE_CHECK";

export interface DropResponse {
  id: string;
  drop_id: string;
  message: string | null;
  music_provider: MusicProvider | null;
  music_url: string | null;
  song_title: string | null;
  song_artist: string | null;
  song_artwork_url: string | null;
  preview_url: string | null;
  is_read: boolean;
  status: "active" | "hidden" | "deleted";
  created_at: string;
}

// Preset Prompts
export interface PromptTemplate {
  type: DropType;
  emoji: string;
  label: string;
  defaultQuestion: string;
  badgeColor: string;
  buttonBg: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    type: "SEND_ME_A_SONG",
    emoji: "",
    label: "Kirim Lagu",
    defaultQuestion: "Kirim lagu yang menurut kamu cocok banget buat aku!",
    badgeColor: "#FFE600",
    buttonBg: "neo-btn-yellow",
  },
  {
    type: "DESCRIBE_ME_WITH_A_SONG",
    emoji: "",
    label: "Describe Me",
    defaultQuestion: "Gambarkan aku dengan 1 lagu yang paling pas!",
    badgeColor: "#FF6584",
    buttonBg: "neo-btn-pink",
  },
  {
    type: "ANONYMOUS_MESSAGE",
    emoji: "",
    label: "Pesan Rahasia",
    defaultQuestion: "Katakan sesuatu yang belum pernah kamu bilang ke aku...",
    badgeColor: "#38BDF8",
    buttonBg: "neo-btn-cyan",
  },
  {
    type: "FIRST_IMPRESSION",
    emoji: "",
    label: "First Impression",
    defaultQuestion: "Apa kesan pertama kamu pas pertama kali liat / kenal aku?",
    badgeColor: "#4ADE80",
    buttonBg: "neo-btn-green",
  },
  {
    type: "SECRET_CONFESSION",
    emoji: "",
    label: "Confession",
    defaultQuestion: "Ada hal yang pengen kamu confess ke aku? Aku gak bakal tau ini siapa!",
    badgeColor: "#C084FC",
    buttonBg: "neo-btn-purple",
  },
];
