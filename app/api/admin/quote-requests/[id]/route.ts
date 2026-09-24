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
      { error: "Quote request ID is required." },
      { status: 400 },
    );
  }

  // Find the quote request first.
  const { data: quoteRequest, error: fetchError } =
    await supabaseAdmin
      .from("quote_requests")
      .select("id, name, document_path")
      .eq("id", id)
      .single();

  if (fetchError || !quoteRequest) {
    return NextResponse.json(
      { error: "Quote request not found." },
      { status: 404 },
    );
  }

  // Delete the attached document from private Supabase Storage.
  if (quoteRequest.document_path) {
    const { error: storageError } =
      await supabaseAdmin.storage
        .from("quote-documents")
        .remove([quoteRequest.document_path]);

    if (storageError) {
      console.error(
        "Quote document deletion error:",
        storageError,
      );

      return NextResponse.json(
        {
          error:
            "Unable to delete the attached document.",
        },
        { status: 500 },
      );
    }
  }

  // Delete the quote request from the database.
  const { error: deleteError } =
    await supabaseAdmin
      .from("quote_requests")
      .delete()
      .eq("id", id);

  if (deleteError) {
    console.error(
      "Quote request deletion error:",
      deleteError,
    );

    return NextResponse.json(
      {
        error: "Unable to delete quote request.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: `Quote request from ${quoteRequest.name} was deleted successfully.`,
  });
}