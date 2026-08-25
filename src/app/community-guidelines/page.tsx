import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Panduan Komunitas — VYBE",
};

export default function CommunityGuidelinesPage() {
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
          <Link href="/" className="neo-btn neo-btn-sm bg-white text-xs">
            ← Kembali
          </Link>
        </div>
      </header>

      <div className="main-container pt-8 px-4">
        <div className="neo-box p-6 sm:p-8 bg-white relative">
          <div className="tape" />
          <h1 className="font-display font-black text-3xl mb-1 text-black">
            Panduan Komunitas
          </h1>
          <p className="text-xs text-zinc-500 font-medium mb-6">
            Menciptakan ruang berekspresi musik yang aman &amp; menyenangkan.
          </p>

          <div className="space-y-6 text-sm sm:text-base font-medium text-zinc-800 leading-relaxed">
            <section className="p-4 rounded-xl border-2 border-black bg-[#FFFDF5]">
              <h2 className="font-display font-bold text-lg text-black mb-1.5 flex items-center gap-2">
                Saling Menghormati
              </h2>
              <p className="text-sm">
                VYBE diciptakan untuk seru-seruan berbagi selera musik dan pesan baik antar teman. Gunakan kesempatan ini untuk menyebarkan energi positif!
              </p>
            </section>

            <section className="p-4 rounded-xl border-2 border-black bg-[#FFFDF5]">
              <h2 className="font-display font-bold text-lg text-black mb-1.5 flex items-center gap-2">
                Zero Tolerance untuk Bullying
              </h2>
              <p className="text-sm">
                Segala bentuk intimidasi, cyberbullying, doxxing, pelecehan seksual, maupun ujaran kebencian tidak memiliki tempat di VYBE dan akan ditindak tegas.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
