import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  request: Request,
  { params }: RouteContext,
) {
  const admin = await isAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 403 },
    );
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Team member ID is required." },
      { status: 400 },
    );
  }

  const { data: member, error: memberError } =
    await supabaseAdmin
      .from("team_members")
      .select("id, name, image_path")
      .eq("id", id)
      .single();

  if (memberError || !member) {
    return NextResponse.json(
      { error: "Team member not found." },
      { status: 404 },
    );
  }

  // Delete the member's image from Supabase Storage first.
  if (member.image_path) {
    const { error: storageError } =
      await supabaseAdmin.storage
        .from("team-members")
        .remove([member.image_path]);

    if (storageError) {
      console.error(
        "Team member image deletion error:",
        storageError,
      );

      return NextResponse.json(
        {
          error:
            "Unable to delete the team member's image.",
        },
        { status: 500 },
      );
    }
  }

  // Delete the database record.
  const { error: deleteError } =
    await supabaseAdmin
      .from("team_members")
      .delete()
      .eq("id", id);

  if (deleteError) {
    console.error(
      "Team member deletion error:",
      deleteError,
    );

    return NextResponse.json(
      {
        error: "Unable to delete team member.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: `${member.name} was deleted successfully.`,
  });
}