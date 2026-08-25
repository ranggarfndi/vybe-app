import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Admin Panel — VYBE" };

export default async function AdminPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch stats directly
  const [
    { count: dropCount },
    { count: responseCount },
  ] = await Promise.all([
    supabase.from("drops").select("id", { count: "exact", head: true }),
    supabase.from("responses").select("id", { count: "exact", head: true }),
  ]);

  // Fetch recent 15 drops
  const { data: recentDrops } = await supabase
    .from("drops")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(15);

  return (
    <main className="min-h-screen bg-white text-zinc-900 pb-20">
      <header className="border-b-[2.5px] border-black bg-white px-4 py-3 sticky top-0 z-40">
        <div className="main-container-wide flex items-center justify-between">
          <Link href="/" className="no-underline flex items-center group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="VYBE Logo"
              className="h-9 w-auto rounded-lg border-2 border-black object-contain shadow-[1.5px_1.5px_0px_#000]"
            />
          </Link>
          <Link href="/" className="neo-btn neo-btn-sm bg-white text-xs">
            ← Ke Beranda
          </Link>
        </div>
      </header>

      <div className="main-container-wide pt-8 px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display font-black text-3xl text-black mb-1">
            Dashboard Metrik
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Pantau statistik Drops dan Respons VYBE secara real-time.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="neo-box-yellow p-5">
            <p className="text-xs font-bold text-black uppercase tracking-wide mb-1">
              Total Drops
            </p>
            <p className="font-display font-black text-3xl sm:text-4xl text-black">
              {(dropCount || 0).toLocaleString()}
            </p>
          </div>

          <div className="neo-box-pink p-5">
            <p className="text-xs font-bold text-white uppercase tracking-wide mb-1">
              Total Pesan &amp; Lagu
            </p>
            <p className="font-display font-black text-3xl sm:text-4xl text-white">
              {(responseCount || 0).toLocaleString()}
            </p>
          </div>

          <div className="neo-box-cyan p-5 col-span-2 sm:col-span-1">
            <p className="text-xs font-bold text-black uppercase tracking-wide mb-1">
              Status Sistem
            </p>
            <p className="font-display font-black text-2xl sm:text-3xl text-black">
              100% Online
            </p>
          </div>
        </div>

        {/* Recent Drops List */}
        <div className="neo-box p-6 bg-white">
          <h2 className="font-display font-black text-xl mb-4 text-black flex items-center gap-2">
            Drops Terbaru
          </h2>

          <div className="space-y-3">
            {(recentDrops || []).map((drop: any) => (
              <div
                key={drop.id}
                className="p-3.5 bg-[#FFFDF5] rounded-xl border-2 border-black flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="neo-badge bg-[#FF6584] text-white text-[11px] px-2 py-0.2">
                      @{drop.instagram_username}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-bold">
                      {new Date(drop.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-display font-bold text-sm text-black truncate">
                    {drop.question}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/d/${drop.id}`}
                    target="_blank"
                    className="neo-btn neo-btn-sm bg-white text-xs"
                  >
                    Buka Drop ↗
                  </Link>
                  <Link
                    href={`/d/${drop.id}/inbox`}
                    target="_blank"
                    className="neo-btn neo-btn-sm neo-btn-yellow text-xs"
                  >
                    Inbox
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
