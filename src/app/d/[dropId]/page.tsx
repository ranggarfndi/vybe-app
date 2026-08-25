import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DropResponseClient from "@/components/drops/DropResponseClient";
import type { Drop } from "@/types";

interface Props {
  params: Promise<{ dropId: string }>;
  searchParams: Promise<{ created?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dropId } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: drop } = await supabase
    .from("drops")
    .select("instagram_username, question")
    .eq("id", dropId)
    .single();

  if (!drop) return { title: "Drop Not Found" };

  return {
    title: `@${drop.instagram_username} di VYBE`,
    description: drop.question || "Kirim lagu dan pesan anonim di VYBE!",
    openGraph: {
      title: `@${drop.instagram_username} di VYBE`,
      description: drop.question || "Kirim lagu dan pesan anonim di VYBE!",
    },
  };
}

export default async function PublicDropPage({ params, searchParams }: Props) {
  const { dropId } = await params;
  const { created } = await searchParams;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: drop } = await supabase
    .from("drops")
    .select("*")
    .eq("id", dropId)
    .eq("is_active", true)
    .single();

  if (!drop) notFound();

  return (
    <DropResponseClient
      drop={drop as Drop}
      isJustCreated={created === "1"}
    />
  );
}
