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

  if (!id) {
    return NextResponse.json(
      { error: "Service ID is required." },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();

    const updates: {
      title?: string;
      slug?: string;
      description?: string;
      active?: boolean;
      display_order?: number;
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
          { error: "Service title is required." },
          { status: 400 },
        );
      }

      updates.title = body.title.trim();
    }

    if (body.slug !== undefined) {
      if (
        typeof body.slug !== "string" ||
        !body.slug.trim()
      ) {
        return NextResponse.json(
          { error: "Service slug is required." },
          { status: 400 },
        );
      }

      updates.slug = body.slug.trim().toLowerCase();
    }

    if (body.description !== undefined) {
      if (
        typeof body.description !== "string" ||
        !body.description.trim()
      ) {
        return NextResponse.json(
          { error: "Service description is required." },
          { status: 400 },
        );
      }

      updates.description = body.description.trim();
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

    if (body.display_order !== undefined) {
      const displayOrder = Number(body.display_order);

      if (
        !Number.isInteger(displayOrder) ||
        displayOrder < 0
      ) {
        return NextResponse.json(
          { error: "Display order must be a non-negative integer." },
          { status: 400 },
        );
      }

      updates.display_order = displayOrder;
    }

    const { data, error } = await supabaseAdmin
      .from("services")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Service update error:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A service with this slug already exists." },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Failed to update service." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      service: data,
    });
  } catch (error) {
    console.error("Service PATCH error:", error);

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

  if (!id) {
    return NextResponse.json(
      { error: "Service ID is required." },
      { status: 400 },
    );
  }

  try {
    const { data: service, error: fetchError } = await supabaseAdmin
      .from("services")
      .select("id, title")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.error("Service lookup error:", fetchError);

      return NextResponse.json(
        { error: "Failed to find service." },
        { status: 500 },
      );
    }

    if (!service) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 },
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from("services")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Service deletion error:", deleteError);

      return NextResponse.json(
        { error: "Failed to delete service." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Service "${service.title}" deleted successfully.`,
    });
  } catch (error) {
    console.error("Service DELETE error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}