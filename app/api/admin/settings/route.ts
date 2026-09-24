import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

const editableFields = [
  "company_name",
  "slogan",
  "company_description",
  "address",
  "primary_phone",
  "secondary_phone",
  "whatsapp",
  "email",
  "linkedin_url",
  "facebook_url",
  "instagram_url",
  "twitter_url",
  "youtube_url",
  "website_title",
  "seo_description",
  "footer_text",
] as const;

type EditableField = (typeof editableFields)[number];

export async function PATCH(request: Request) {
  const admin = await isAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const updates: Partial<Record<EditableField, string | null>> = {};

    for (const field of editableFields) {
      if (body[field] !== undefined) {
        if (body[field] !== null && typeof body[field] !== "string") {
          return NextResponse.json(
            { error: `${field} must be text.` },
            { status: 400 },
          );
        }

        if (body[field] === null) {
          updates[field] = null;
          continue;
        }

        const value = body[field].trim();

        if (
          [
            "company_name",
            "slogan",
            "company_description",
            "address",
            "primary_phone",
            "secondary_phone",
            "whatsapp",
            "email",
            "website_title",
            "seo_description",
            "footer_text",
          ].includes(field) &&
          !value
        ) {
          return NextResponse.json(
            { error: `${field} cannot be empty.` },
            { status: 400 },
          );
        }

        updates[field] = value || null;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No fields were provided." },
        { status: 400 },
      );
    }

    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("website_settings")
      .update(updateData)
      .not("id", "is", null)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Website settings update error:", error);

      return NextResponse.json(
        { error: "Failed to update website settings." },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Website settings were not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      settings: data,
    });
  } catch (error) {
    console.error("Website settings PATCH error:", error);

    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 },
    );
  }
}