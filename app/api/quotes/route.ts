import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: Request) {
  let uploadedDocumentPath: string | null = null;

  try {
    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const projectType = String(formData.get("projectType") || "").trim();
    const budget = String(formData.get("budget") || "").trim();
    const preferredStartDate = String(
      formData.get("preferredStartDate") || "",
    ).trim();
    const description = String(formData.get("description") || "").trim();

    const documentEntry = formData.get("document");

    if (
      !name ||
      !phone ||
      !email ||
      !location ||
      !projectType ||
      !description
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        { status: 400 },
      );
    }

    let documentPath: string | null = null;
    let documentName: string | null = null;

    if (documentEntry instanceof File && documentEntry.size > 0) {
      if (documentEntry.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: "The attached document must not exceed 10 MB.",
          },
          { status: 400 },
        );
      }

      if (!ALLOWED_FILE_TYPES.includes(documentEntry.type)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Unsupported document type. Please upload PDF, JPG, PNG, WEBP, DOC, or DOCX.",
          },
          { status: 400 },
        );
      }

      const fileExtension =
        documentEntry.name.split(".").pop()?.toLowerCase() || "file";

      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const storagePath = `quote-requests/${fileName}`;

      const fileBuffer = Buffer.from(await documentEntry.arrayBuffer());

      const { error: uploadError } = await supabaseAdmin.storage
        .from("quote-documents")
        .upload(storagePath, fileBuffer, {
          contentType: documentEntry.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Quote document upload error:", uploadError);

        return NextResponse.json(
          {
            success: false,
            message: "Unable to upload the project document.",
          },
          { status: 500 },
        );
      }

      documentPath = storagePath;
      documentName = documentEntry.name;
      uploadedDocumentPath = storagePath;
    }

    const { data, error } = await supabaseAdmin
      .from("quote_requests")
      .insert({
        name,
        phone,
        email,
        location,
        project_type: projectType,
        budget: budget || null,
        preferred_start_date: preferredStartDate || null,
        description,
        document_path: documentPath,
        document_name: documentName,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase quote error:", error);

      // Clean up the uploaded document if database insertion fails.
      if (uploadedDocumentPath) {
        await supabaseAdmin.storage
          .from("quote-documents")
          .remove([uploadedDocumentPath]);
      }

      return NextResponse.json(
        {
          success: false,
          message: "Unable to submit your quote request.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your quote request has been submitted successfully.",
        quote: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Quote API error:", error);

    if (uploadedDocumentPath) {
      await supabaseAdmin.storage
        .from("quote-documents")
        .remove([uploadedDocumentPath]);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while submitting your request.",
      },
      { status: 500 },
    );
  }
}