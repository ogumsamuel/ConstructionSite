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
        { error: "Title is required." },
        { status: 400 },
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Description is required." },
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
      .from("safety_principles")
      .insert({
        title,
        description,
        display_order: displayOrder,
        active,
      })
      .select()
      .single();

    if (error) {
      console.error("Safety principle creation error:", error);

      return NextResponse.json(
        { error: "Failed to create safety principle." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        principle: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Safety principle POST error:", error);

    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 },
    );
  }
}