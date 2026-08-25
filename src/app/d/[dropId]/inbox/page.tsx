import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DropInboxClient from "@/components/inbox/DropInboxClient";
import type { Drop, DropResponse } from "@/types";

interface Props {
  params: Promise<{ dropId: string }>;
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

  if (!drop) return { title: "Inbox Not Found" };

  return {
    title: `Inbox @${drop.instagram_username} — VYBE`,
    robots: { index: false },
  };
}

export default async function DropInboxPage({ params }: Props) {
  const { dropId } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: drop } = await supabase
    .from("drops")
    .select("*")
    .eq("id", dropId)
    .single();

  if (!drop) notFound();

  // Fetch all responses for this drop
  const { data: responses } = await supabase
    .from("responses")
    .select("*")
    .eq("drop_id", dropId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <DropInboxClient
      drop={drop as Drop}
      initialResponses={(responses || []) as DropResponse[]}
    />
  );
}
