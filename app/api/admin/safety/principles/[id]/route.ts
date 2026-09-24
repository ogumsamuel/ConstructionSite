import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const admin = await isAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  try {
    const body = await request.json();

    const updates: {
      title?: string;
      description?: string;
      display_order?: number;
      active?: boolean;
      updated_at: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) {
      if (
        typeof body.title !== "string" ||
        !body.title.trim()
      ) {
        return NextResponse.json(
          { error: "Title is required." },
          { status: 400 },
        );
      }

      updates.title = body.title.trim();
    }

    if (body.description !== undefined) {
      if (
        typeof body.description !== "string" ||
        !body.description.trim()
      ) {
        return NextResponse.json(
          { error: "Description is required." },
          { status: 400 },
        );
      }

      updates.description = body.description.trim();
    }

    if (body.display_order !== undefined) {
      const displayOrder = Number(body.display_order);

      if (
        !Number.isInteger(displayOrder) ||
        displayOrder < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Display order must be a non-negative integer.",
          },
          { status: 400 },
        );
      }

      updates.display_order = displayOrder;
    }

    if (body.active !== undefined) {
      if (typeof body.active !== "boolean") {
        return NextResponse.json(
          { error: "Active must be a boolean." },
          { status: 400 },
        );
      }

      updates.active = body.active;
    }

    const { data, error } = await supabaseAdmin
      .from("safety_principles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Safety principle update error:", error);

      return NextResponse.json(
        { error: "Failed to update safety principle." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      principle: data,
    });
  } catch (error) {
    console.error("Safety principle PATCH error:", error);

    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  const admin = await isAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  try {
    const { data: principle, error: fetchError } =
      await supabaseAdmin
        .from("safety_principles")
        .select("id, title")
        .eq("id", id)
        .maybeSingle();

    if (fetchError) {
      console.error(fetchError);

      return NextResponse.json(
        { error: "Failed to find safety principle." },
        { status: 500 },
      );
    }

    if (!principle) {
      return NextResponse.json(
        { error: "Safety principle not found." },
        { status: 404 },
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from("safety_principles")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Safety principle delete error:", deleteError);

      return NextResponse.json(
        { error: "Failed to delete safety principle." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Safety principle "${principle.title}" deleted successfully.`,
    });
  } catch (error) {
    console.error("Safety principle DELETE error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}