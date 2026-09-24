import { supabaseAdmin } from "@/lib/supabase/server";

const SIGNED_URL_EXPIRES_IN = 60 * 60; // 1 hour

export async function createProjectMediaUrl(
  storagePath: string,
) {
  const { data, error } = await supabaseAdmin.storage
    .from("project-media")
    .createSignedUrl(
      storagePath,
      SIGNED_URL_EXPIRES_IN,
    );

  if (error) {
    console.error(
      "Project media signed URL error:",
      error,
    );

    return null;
  }

  return data.signedUrl;
}