import { supabaseAdmin } from "@/lib/supabase/server";

const SIGNED_URL_EXPIRES_IN = 60 * 60;

export async function createTeamMediaUrl(
  storagePath: string,
) {
  const { data, error } =
    await supabaseAdmin.storage
      .from("team-members")
      .createSignedUrl(
        storagePath,
        SIGNED_URL_EXPIRES_IN,
      );

  if (error) {
    console.error(
      "Team media signed URL error:",
      error,
    );

    return null;
  }

  return data.signedUrl;
}