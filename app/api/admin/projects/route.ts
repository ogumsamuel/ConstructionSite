import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: Request) {
  const uploadedStoragePaths: string[] = [];

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

    const formData = await request.formData();

    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const projectType = String(formData.get("projectType") || "").trim();
    const status = String(formData.get("status") || "Completed").trim();
    const featured =
      String(formData.get("featured") || "false") === "true";

    const coverImageEntry = formData.get("coverImage");

    const projectImageEntries = formData
      .getAll("projectImages")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    const projectVideoEntries = formData
      .getAll("projectVideos")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "Project title and description are required.",
        },
        { status: 400 },
      );
    }

    const slug = createSlug(title);

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid project title.",
        },
        { status: 400 },
      );
    }

    // Check whether the slug already exists.
    const { data: existingProject, error: slugCheckError } =
      await supabaseAdmin
        .from("projects")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

    if (slugCheckError) {
      console.error("Project slug check error:", slugCheckError);

      return NextResponse.json(
        {
          success: false,
          message: "Unable to validate the project.",
        },
        { status: 500 },
      );
    }

    if (existingProject) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A project with this title already exists. Please use a different title.",
        },
        { status: 409 },
      );
    }

    /*
     * ------------------------------------------------------------
     * Validate cover image
     * ------------------------------------------------------------
     */

    if (
      coverImageEntry instanceof File &&
      coverImageEntry.size > 0
    ) {
      if (coverImageEntry.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: "The cover image must not exceed 10 MB.",
          },
          { status: 400 },
        );
      }

      if (!ALLOWED_IMAGE_TYPES.includes(coverImageEntry.type)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Unsupported cover image type. Please upload JPG, PNG, or WEBP.",
          },
          { status: 400 },
        );
      }
    }

    /*
     * ------------------------------------------------------------
     * Validate project images
     * ------------------------------------------------------------
     */

    for (const file of projectImageEntries) {
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: `Project image "${file.name}" exceeds the 10 MB limit.`,
          },
          { status: 400 },
        );
      }

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message: `Project image "${file.name}" is not supported. Use JPG, PNG, or WEBP.`,
          },
          { status: 400 },
        );
      }
    }

    /*
     * ------------------------------------------------------------
     * Validate project videos
     * ------------------------------------------------------------
     */

    for (const file of projectVideoEntries) {
      if (file.size > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: `Project video "${file.name}" exceeds the 50 MB limit.`,
          },
          { status: 400 },
        );
      }

      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message: `Project video "${file.name}" is not supported. Use MP4, WebM, or MOV.`,
          },
          { status: 400 },
        );
      }
    }

    /*
     * ------------------------------------------------------------
     * Upload cover image
     * ------------------------------------------------------------
     */

    let coverImagePath: string | null = null;
    let coverImageName: string | null = null;

    if (
      coverImageEntry instanceof File &&
      coverImageEntry.size > 0
    ) {
      const fileExtension =
        coverImageEntry.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const storagePath = `projects/${crypto.randomUUID()}/cover/${fileName}`;

      const fileBuffer = Buffer.from(
        await coverImageEntry.arrayBuffer(),
      );

      const { error: uploadError } = await supabaseAdmin.storage
        .from("project-media")
        .upload(storagePath, fileBuffer, {
          contentType: coverImageEntry.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Project cover image upload error:", uploadError);

        return NextResponse.json(
          {
            success: false,
            message: "Unable to upload the project cover image.",
          },
          { status: 500 },
        );
      }

      coverImagePath = storagePath;
      coverImageName = coverImageEntry.name;

      uploadedStoragePaths.push(storagePath);
    }

    /*
     * ------------------------------------------------------------
     * Create project record
     * ------------------------------------------------------------
     */

    const { data: project, error: insertError } = await supabaseAdmin
      .from("projects")
      .insert({
        title,
        slug,
        description,
        location: location || null,
        project_type: projectType || null,
        status,
        featured,
        cover_image_path: coverImagePath,
        cover_image_name: coverImageName,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Project insert error:", insertError);

      if (uploadedStoragePaths.length > 0) {
        await supabaseAdmin.storage
          .from("project-media")
          .remove(uploadedStoragePaths);
      }

      return NextResponse.json(
        {
          success: false,
          message: "Unable to create the project.",
        },
        { status: 500 },
      );
    }

    /*
     * ------------------------------------------------------------
     * Upload additional project images
     * ------------------------------------------------------------
     */

    const mediaRecords: {
      project_id: string;
      media_type: "image" | "video";
      storage_path: string;
      file_name: string;
    }[] = [];

    for (const file of projectImageEntries) {
      const fileExtension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const storagePath = `projects/${project.id}/images/${fileName}`;

      const fileBuffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabaseAdmin.storage
        .from("project-media")
        .upload(storagePath, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error(
          "Project gallery image upload error:",
          uploadError,
        );

        throw new Error(
          `Unable to upload project image "${file.name}".`,
        );
      }

      uploadedStoragePaths.push(storagePath);

      mediaRecords.push({
        project_id: project.id,
        media_type: "image",
        storage_path: storagePath,
        file_name: file.name,
      });
    }

    /*
     * ------------------------------------------------------------
     * Upload project videos
     * ------------------------------------------------------------
     */

    for (const file of projectVideoEntries) {
      const fileExtension =
        file.name.split(".").pop()?.toLowerCase() || "mp4";

      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const storagePath = `projects/${project.id}/videos/${fileName}`;

      const fileBuffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabaseAdmin.storage
        .from("project-media")
        .upload(storagePath, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error(
          "Project video upload error:",
          uploadError,
        );

        throw new Error(
          `Unable to upload project video "${file.name}".`,
        );
      }

      uploadedStoragePaths.push(storagePath);

      mediaRecords.push({
        project_id: project.id,
        media_type: "video",
        storage_path: storagePath,
        file_name: file.name,
      });
    }

    /*
     * ------------------------------------------------------------
     * Save media records
     * ------------------------------------------------------------
     */

    if (mediaRecords.length > 0) {
      const { error: mediaInsertError } = await supabaseAdmin
        .from("project_media")
        .insert(mediaRecords);

      if (mediaInsertError) {
        console.error(
          "Project media database error:",
          mediaInsertError,
        );

        throw new Error(
          "The project was created, but its media could not be saved.",
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully.",
        project,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create project error:", error);

    /*
     * Remove every file that was successfully uploaded if
     * something fails later in the process.
     */
    if (uploadedStoragePaths.length > 0) {
      const { error: cleanupError } = await supabaseAdmin.storage
        .from("project-media")
        .remove(uploadedStoragePaths);

      if (cleanupError) {
        console.error(
          "Project media cleanup error:",
          cleanupError,
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating the project.",
      },
      { status: 500 },
    );
  }
}