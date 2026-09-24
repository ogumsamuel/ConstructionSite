import { supabaseAdmin } from "@/lib/supabase/server";

export type WebsiteSettings = {
  id: string;
  company_name: string;
  slogan: string;
  company_description: string;

  address: string;
  primary_phone: string;
  secondary_phone: string;
  whatsapp: string;
  email: string;

  linkedin_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;

  website_title: string;
  seo_description: string;
  footer_text: string;

  created_at: string;
  updated_at: string;
};

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  const { data, error } = await supabaseAdmin
    .from("website_settings")
    .select(`
      id,
      company_name,
      slogan,
      company_description,
      address,
      primary_phone,
      secondary_phone,
      whatsapp,
      email,
      linkedin_url,
      facebook_url,
      instagram_url,
      twitter_url,
      youtube_url,
      website_title,
      seo_description,
      footer_text,
      created_at,
      updated_at
    `)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Website settings fetch error:", error);
    throw new Error("Failed to load website settings.");
  }

  if (!data) {
    throw new Error("Website settings have not been configured.");
  }

  return data as WebsiteSettings;
}