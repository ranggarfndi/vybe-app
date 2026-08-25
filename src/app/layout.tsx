import type { Metadata } from "next";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VYBE — Say it with a song.",
    template: "%s | VYBE",
  },
  description:
    "Kirim & terima lagu atau pesan anonim dari teman-teman Instagram kamu! Langsung share hasilnya ke IG Story.",
  keywords: ["vybe", "instagram", "spotify", "anonymous", "song", "stories", "vibe"],
  openGraph: {
    type: "website",
    siteName: "VYBE",
    title: "VYBE — Say it with a song.",
    description: "Kirim & terima lagu atau pesan anonim dari teman-teman Instagram kamu!",
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    apple: "/logo.png",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png?v=3" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logo.png?v=3" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png?v=3" />
      </head>
      <body
        className={`${fredoka.variable} ${jakarta.variable} antialiased`}
        style={{
          backgroundColor: "#FFFFFF",
          color: "#18181B",
          minHeight: "100dvh",
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
