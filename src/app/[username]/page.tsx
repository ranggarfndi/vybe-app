import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import type { Drop } from "@/types";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const cleanUsername = decodeURIComponent(username).replace(/^@/, "").toLowerCase();

  return {
    title: `@${cleanUsername} di VYBE`,
    description: `Kirim lagu dan pesan anonim ke @${cleanUsername}!`,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const cleanUsername = decodeURIComponent(username).replace(/^@/, "").toLowerCase();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: drops } = await supabase
    .from("drops")
    .select("*")
    .eq("instagram_username", cleanUsername)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (!drops || drops.length === 0) {
    // If no drops found for this username, invite them to create one!
    return (
      <main className="min-h-screen bg-white text-zinc-900 pb-20">
        <header className="border-b-[2.5px] border-black bg-white px-4 py-3 sticky top-0 z-40">
          <div className="main-container flex items-center justify-between">
            <Link href="/" className="no-underline flex items-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="VYBE Logo"
                className="h-9 w-auto rounded-lg border-2 border-black object-contain shadow-[1.5px_1.5px_0px_#000]"
              />
            </Link>
          </div>
        </header>

        <div className="main-container pt-12 px-4 text-center">
          <div className="neo-box p-8 bg-[#FFFDF5] text-center max-w-md mx-auto">
            <h1 className="font-display font-black text-2xl mb-2 text-black">
              @{cleanUsername} belum punya VYBE
            </h1>
            <p className="text-sm text-zinc-600 font-medium mb-6">
              Apakah ini kamu? Buat link VYBE kamu sekarang dan bagikan ke Instagram Story!
            </p>
            <Link href="/" className="neo-btn neo-btn-yellow w-full py-3.5 font-bold">
              Buat VYBE @{cleanUsername} Sekarang
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900 pb-20">
      {/* Top Bar */}
      <header className="border-b-[2.5px] border-black bg-white px-4 py-3 sticky top-0 z-40">
        <div className="main-container flex items-center justify-between">
          <Link href="/" className="no-underline flex items-center group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="VYBE Logo"
              className="h-9 w-auto rounded-lg border-2 border-black object-contain shadow-[1.5px_1.5px_0px_#000]"
            />
          </Link>

          <Link href="/" className="neo-btn neo-btn-sm neo-btn-yellow text-xs">
            + Bikin VYBE
          </Link>
        </div>
      </header>

      <div className="main-container pt-8 px-4">
        {/* Profile Card */}
        <div className="neo-box p-6 bg-[#FFFDF5] text-center mb-6 relative">
          <div className="tape" />

          <div className="inline-flex items-center gap-1.5 neo-badge bg-[#FF6584] text-white px-3 py-1 text-sm mb-3">
            <span>@{cleanUsername}</span>
          </div>

          <h1 className="font-display font-black text-3xl text-black mb-1">
            @{cleanUsername}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 font-medium">
            Pilih pertanyaan di bawah untuk kirim lagu atau pesan anonim!
          </p>
        </div>

        {/* Drops List */}
        <div className="space-y-3.5">
          {drops.map((drop: Drop) => (
            <Link
              key={drop.id}
              href={`/d/${drop.id}`}
              className="block no-underline"
            >
              <div className="neo-box p-4 sm:p-5 bg-white neo-box-interactive flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs neo-badge bg-[#FFE600] px-2 py-0.5 mb-1.5 inline-block">
                    Pertanyaan
                  </span>
                  <p className="font-display font-bold text-base sm:text-lg text-black truncate">
                    {drop.question}
                  </p>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">
                    Kirim lagu &amp; pesan anonim →
                  </p>
                </div>
                <span className="neo-btn neo-btn-sm neo-btn-pink shrink-0 text-sm">
                  Jawab
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
