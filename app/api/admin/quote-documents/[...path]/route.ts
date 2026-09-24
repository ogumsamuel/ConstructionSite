import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 403 },
      );
    }

    const { path } = await context.params;

    if (!path || path.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Document path is required.",
        },
        { status: 400 },
      );
    }

    const documentPath = path.join("/");

    const { data, error } = await supabaseAdmin.storage
      .from("quote-documents")
      .createSignedUrl(documentPath, 60);

    if (error || !data?.signedUrl) {
      console.error("Signed URL error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Unable to access the project document.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      url: data.signedUrl,
    });
  } catch (error) {
    console.error("Admin document access error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to access the project document.",
      },
      { status: 500 },
    );
  }
}