import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  const admin = await isAdmin();

  if (!admin) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();

    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();
    const description = String(
      formData.get("description") ?? "",
    ).trim();

    const yearsOfService = String(
      formData.get("yearsOfService") ?? "",
    ).trim();

    const biography = String(
      formData.get("biography") ?? "",
    ).trim();

    const displayOrderValue = String(
      formData.get("displayOrder") ?? "0",
    ).trim();

    const activeValue = String(
      formData.get("active") ?? "true",
    ).trim();

    const qualificationValues = formData
      .getAll("qualifications")
      .map((value) => String(value).trim())
      .filter(Boolean);

    const image = formData.get("image");

    if (!name) {
      return Response.json(
        { error: "Name is required." },
        { status: 400 },
      );
    }

    if (!role) {
      return Response.json(
        { error: "Role is required." },
        { status: 400 },
      );
    }

    if (!description) {
      return Response.json(
        { error: "Description is required." },
        { status: 400 },
      );
    }

    if (!(image instanceof File) || image.size === 0) {
      return Response.json(
        { error: "A team member photo is required." },
        { status: 400 },
      );
    }

    if (image.size > MAX_IMAGE_SIZE) {
      return Response.json(
        { error: "Image must not exceed 10 MB." },
        { status: 400 },
      );
    }

    if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
      return Response.json(
        {
          error:
            "Only JPG, PNG, and WEBP images are allowed.",
        },
        { status: 400 },
      );
    }

    const displayOrder = Number.parseInt(
      displayOrderValue,
      10,
    );

    if (Number.isNaN(displayOrder)) {
      return Response.json(
        { error: "Display order must be a valid number." },
        { status: 400 },
      );
    }

    const active = activeValue === "true";

    const extension =
      image.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeName =
      sanitizeFileName(
        image.name.replace(/\.[^/.]+$/, ""),
      ) || "team-member";

    const uniqueFileName = `${Date.now()}-${safeName}.${extension}`;

    const storagePath = `team/${uniqueFileName}`;

    const imageBuffer = Buffer.from(
      await image.arrayBuffer(),
    );

    const { error: uploadError } =
      await supabaseAdmin.storage
        .from("team-members")
        .upload(storagePath, imageBuffer, {
          contentType: image.type,
          upsert: false,
        });

    if (uploadError) {
      console.error(
        "Team image upload error:",
        uploadError,
      );

      return Response.json(
        { error: "Failed to upload team member photo." },
        { status: 500 },
      );
    }

    const { data: member, error: insertError } =
      await supabaseAdmin
        .from("team_members")
        .insert({
          name,
          role,
          description,
          years_of_service: yearsOfService || null,
          biography: biography || null,
          qualifications: qualificationValues,
          image_path: storagePath,
          display_order: displayOrder,
          active,
        })
        .select()
        .single();

    if (insertError) {
      console.error(
        "Team member insert error:",
        insertError,
      );

      await supabaseAdmin.storage
        .from("team-members")
        .remove([storagePath]);

      return Response.json(
        { error: "Failed to create team member." },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        member,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Create team member error:",
      error,
    );

    return Response.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}