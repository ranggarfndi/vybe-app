import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — VYBE",
};

export default function TermsPage() {
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
            Syarat &amp; Ketentuan
          </h1>
          <p className="text-xs text-zinc-500 font-medium mb-6">
            Terakhir diperbarui: Agustus 2026
          </p>

          <div className="space-y-5 text-sm sm:text-base font-medium text-zinc-800 leading-relaxed">
            <section>
              <h2 className="font-display font-bold text-lg text-black mb-1.5">
                1. Penggunaan Layanan
              </h2>
              <p>
                VYBE adalah platform interaksi sosial berbasis musik dan pesan anonim yang menyenangkan. Dengan menggunakan layanan ini, kamu setuju untuk menggunakan VYBE secara positif dan bertanggung jawab.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-black mb-1.5">
                2. Larangan Konten
              </h2>
              <p>
                Dilarang keras mengirimkan ujaran kebencian, pelecehan, ancaman kekerasan, pornografi, atau konten yang melanggar hukum.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
