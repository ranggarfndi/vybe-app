import Link from "next/link";

export default function Footer() {
  return (
    <footer className="v-footer">
      <div className="v-footer-content">
        {/* Brand Tag */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="VYBE Logo"
            className="w-8 h-8 rounded-lg border-2 border-zinc-900 object-cover shadow-[1.5px_1.5px_0px_#000]"
          />
          <span className="font-display font-black text-xl text-zinc-900">
            VYBE
          </span>
          <span className="text-xs sm:text-sm font-bold text-zinc-500">
            — Say it with a song on Instagram Stories
          </span>
        </div>

        {/* Legal & Policy Links */}
        <div className="v-footer-links">
          <Link href="/privacy" className="v-footer-link">
            Privasi
          </Link>
          <Link href="/terms" className="v-footer-link">
            Syarat &amp; Ketentuan
          </Link>
          <Link href="/community-guidelines" className="v-footer-link">
            Panduan Komunitas
          </Link>
        </div>

        {/* Copyright Note */}
        <p className="text-xs text-zinc-400 font-semibold max-w-sm mx-auto leading-relaxed">
          &copy; {new Date().getFullYear()} VYBE. Dibuat untuk seru-seruan musik &amp; pesan rahasia bareng teman.
        </p>
      </div>
    </footer>
  );
}
