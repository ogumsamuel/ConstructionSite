import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const admin = await isAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const slug =
      typeof body.slug === "string"
        ? body.slug.trim().toLowerCase()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const displayOrder = Number(body.display_order);

    const active =
      typeof body.active === "boolean"
        ? body.active
        : true;

    if (!title) {
      return NextResponse.json(
        { error: "Service title is required." },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Service slug is required." },
        { status: 400 },
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Service description is required." },
        { status: 400 },
      );
    }

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

    const { data, error } = await supabaseAdmin
      .from("services")
      .insert({
        title,
        slug,
        description,
        display_order: displayOrder,
        active,
      })
      .select()
      .single();

    if (error) {
      console.error("Service creation error:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "A service with this slug already exists.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Failed to create service." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        service: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Service POST error:", error);

    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 },
    );
  }
}