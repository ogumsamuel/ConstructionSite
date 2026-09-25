import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function PATCH(
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

  const { data: existingMember, error: memberError } =
    await supabaseAdmin
      .from("team_members")
      .select(
        "id, name, image_path",
      )
      .eq("id", id)
      .single();

  if (memberError || !existingMember) {
    return NextResponse.json(
      { error: "Team member not found." },
      { status: 404 },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data." },
      { status: 400 },
    );
  }

  const name = formData.get("name");
  const role = formData.get("role");
  const description =
    formData.get("description");

  const yearsOfService =
    formData.get("yearsOfService");

  const biography =
    formData.get("biography");

  const displayOrder =
    formData.get("displayOrder");

  const active =
    formData.get("active");

  const qualifications =
    formData
      .getAll("qualifications")
      .map((qualification) =>
        String(qualification).trim(),
      )
      .filter(Boolean);

  const image = formData.get("image");

  if (
    typeof name !== "string" ||
    !name.trim()
  ) {
    return NextResponse.json(
      { error: "Name is required." },
      { status: 400 },
    );
  }

  if (
    typeof role !== "string" ||
    !role.trim()
  ) {
    return NextResponse.json(
      { error: "Role is required." },
      { status: 400 },
    );
  }

  if (
    typeof description !== "string" ||
    !description.trim()
  ) {
    return NextResponse.json(
      {
        error:
          "Description is required.",
      },
      { status: 400 },
    );
  }

  const parsedDisplayOrder =
    Number(displayOrder);

  if (
    !Number.isInteger(
      parsedDisplayOrder,
    ) ||
    parsedDisplayOrder < 0
  ) {
    return NextResponse.json(
      {
        error:
          "Display order must be a non-negative number.",
      },
      { status: 400 },
    );
  }

  const isActive =
    active === "true";

  let newImagePath =
    existingMember.image_path;

  let uploadedNewImage = false;

  /*
   * Handle optional replacement image.
   *
   * If no new image is selected, the existing
   * image remains unchanged.
   */
  if (
    image instanceof File &&
    image.size > 0
  ) {
    if (image.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        {
          error:
            "Image size cannot exceed 10 MB.",
        },
        { status: 400 },
      );
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        image.type,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG, and WEBP images are allowed.",
        },
        { status: 400 },
      );
    }

    const fileExtension =
      image.type === "image/jpeg"
        ? "jpg"
        : image.type === "image/png"
          ? "png"
          : "webp";

    const filePath = `team/${crypto.randomUUID()}.${fileExtension}`;

    const imageBuffer =
      Buffer.from(
        await image.arrayBuffer(),
      );

    const { error: uploadError } =
      await supabaseAdmin.storage
        .from("team-members")
        .upload(
          filePath,
          imageBuffer,
          {
            contentType: image.type,
            upsert: false,
          },
        );

    if (uploadError) {
      console.error(
        "Team member image upload error:",
        uploadError,
      );

      return NextResponse.json(
        {
          error:
            "Unable to upload the new team member image.",
        },
        { status: 500 },
      );
    }

    newImagePath = filePath;
    uploadedNewImage = true;
  }

  const updateData = {
    name: name.trim(),
    role: role.trim(),
    description: description.trim(),
    years_of_service:
      typeof yearsOfService ===
        "string" &&
      yearsOfService.trim()
        ? yearsOfService.trim()
        : null,
    biography:
      typeof biography ===
        "string" &&
      biography.trim()
        ? biography.trim()
        : null,
    qualifications,
    image_path: newImagePath,
    display_order:
      parsedDisplayOrder,
    active: isActive,
    updated_at:
      new Date().toISOString(),
  };

  const {
    data: member,
    error: updateError,
  } = await supabaseAdmin
    .from("team_members")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (updateError || !member) {
    console.error(
      "Team member update error:",
      updateError,
    );

    /*
     * If the database update failed after
     * uploading a new image, remove the
     * newly uploaded image so we don't leave
     * an orphaned file in Storage.
     */
    if (
      uploadedNewImage &&
      newImagePath
    ) {
      await supabaseAdmin.storage
        .from("team-members")
        .remove([newImagePath]);
    }

    return NextResponse.json(
      {
        error:
          "Unable to update team member.",
      },
      { status: 500 },
    );
  }

  /*
   * The database update succeeded.
   *
   * Now remove the old image if a replacement
   * was uploaded.
   */
  if (
    uploadedNewImage &&
    existingMember.image_path &&
    existingMember.image_path !==
      newImagePath
  ) {
    const {
      error: oldImageDeleteError,
    } = await supabaseAdmin.storage
      .from("team-members")
      .remove([
        existingMember.image_path,
      ]);

    if (oldImageDeleteError) {
      console.error(
        "Old team member image deletion error:",
        oldImageDeleteError,
      );

      /*
       * The member was already updated,
       * so we don't fail the whole request.
       */
    }
  }

  return NextResponse.json({
    success: true,
    message: `${member.name} was updated successfully.`,
    member,
  });
}

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
      {
        error:
          "Team member ID is required.",
      },
      { status: 400 },
    );
  }

  const {
    data: member,
    error: memberError,
  } =
    await supabaseAdmin
      .from("team_members")
      .select(
        "id, name, image_path",
      )
      .eq("id", id)
      .single();

  if (memberError || !member) {
    return NextResponse.json(
      {
        error:
          "Team member not found.",
      },
      { status: 404 },
    );
  }

  // Delete the member's image from Supabase Storage first.
  if (member.image_path) {
    const {
      error: storageError,
    } =
      await supabaseAdmin.storage
        .from("team-members")
        .remove([
          member.image_path,
        ]);

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
  const {
    error: deleteError,
  } =
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
        error:
          "Unable to delete team member.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: `${member.name} was deleted successfully.`,
  });
}