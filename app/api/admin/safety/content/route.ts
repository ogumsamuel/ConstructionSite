import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

const fields = [
  "hero_label",
  "hero_title",
  "hero_description",
  "commitment_label",
  "commitment_title",
  "commitment_description",
  "commitment_description_secondary",
  "highlight_title",
  "highlight_description",
  "approach_label",
  "approach_title",
  "approach_description",
] as const;

type ContentField = (typeof fields)[number];

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

    const updates: Partial<Record<ContentField, string>> = {};

    for (const field of fields) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== "string") {
          return NextResponse.json(
            { error: `${field} must be text.` },
            { status: 400 },
          );
        }

        const value = body[field].trim();

        if (!value) {
          return NextResponse.json(
            { error: `${field} cannot be empty.` },
            { status: 400 },
          );
        }

        updates[field] = value;
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
      .from("safety_content")
      .update(updateData)
      .not("id", "is", null)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Safety content update error:", error);

      return NextResponse.json(
        { error: "Failed to update safety content." },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Safety content was not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      content: data,
    });
  } catch (error) {
    console.error("Safety content PATCH error:", error);

    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 },
    );
  }
}