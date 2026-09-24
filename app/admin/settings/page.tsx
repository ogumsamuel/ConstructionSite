import Link from "next/link";
import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

import WebsiteSettingsForm from "./WebsiteSettingsForm";

export const dynamic = "force-dynamic";

export default async function WebsiteSettingsPage() {
  const admin = await isAdmin();

  if (!admin) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            Access Denied
          </h1>

          <p className="mt-2 text-slate-600">
            You do not have permission to access Website Settings.
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const { data: settings, error } = await supabaseAdmin
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
      footer_text
    `)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load website settings: ${error.message}`,
    );
  }

  if (!settings) {
    throw new Error(
      "Website settings have not been configured.",
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Website Management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Website Settings
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Manage general company information, contact details, social
              links, SEO information, and website settings.
            </p>
          </div>
        </div>

        {/* Settings */}
        <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <WebsiteSettingsForm settings={settings} />
        </section>
      </div>
    </main>
  );
}