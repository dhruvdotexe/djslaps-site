import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/fanart-admin";

export const revalidate = 60;

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.json([]);
  }
  const supabase = createPublicClient(url, anonKey);
  const { data, error } = await supabase
    .from("fan_art_gallery")
    .select("id, artist_name, storage_path, created_at")
    .limit(100);
  if (error) {
    return NextResponse.json([], { status: 500 });
  }

  const withUrls = (data ?? []).map((row) => ({
    ...row,
    url: supabase.storage.from("fan-art").getPublicUrl(row.storage_path)
      .data.publicUrl,
  }));
  return NextResponse.json(withUrls);
}
