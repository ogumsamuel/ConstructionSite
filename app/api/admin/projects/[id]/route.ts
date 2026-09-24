import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function sanitizeFileName(fileName: string) {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

function getExtension(fileName: string) {
  const parts = fileName.split(".");

  if (parts.length < 2) {
    return "";
  }

  return parts.pop()?.toLowerCase() ?? "";
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const admin = await isAdmin();

  if (!admin) {
    return NextResponse.json(
      {
        error: "Unauthorized.",
      },
      {
        status: 401,
      },
    );
  }

  const { id } = await context.params;

  try {
    const formData = await request.formData();

    const title = String(
      formData.get("title") ?? "",
    ).trim();

    const description = String(
      formData.get("description") ?? "",
    ).trim();

    const projectType = String(
      formData.get("projectType") ?? "",
    ).trim();

    const location = String(
      formData.get("location") ?? "",
    ).trim();

    const status = String(
      formData.get("status") ?? "Completed",
    ).trim();

    const featured =
      String(formData.get("featured") ?? "false") ===
      "true";

    const coverImage = formData.get("coverImage");

    const projectImages = formData
      .getAll("projectImages")
      .filter(
        (item): item is File =>
          item instanceof File &&
          item.size > 0,
      );

    const projectVideos = formData
      .getAll("projectVideos")
      .filter(
        (item): item is File =>
          item instanceof File &&
          item.size > 0,
      );

    if (!title) {
      return NextResponse.json(
        {
          error: "Project title is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          error: "Project description is required.",
        },
        {
          status: 400,
        },
      );
    }

    const { data: project, error: projectError } =
      await supabaseAdmin
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    if (projectError || !project) {
      return NextResponse.json(
        {
          error: "Project not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Update project information.
     */
    const { error: updateError } =
      await supabaseAdmin
        .from("projects")
        .update({
          title,
          description,
          project_type: projectType || null,
          location: location || null,
          status,
          featured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (updateError) {
      console.error(
        "Project update error:",
        updateError,
      );

      return NextResponse.json(
        {
          error: "Unable to update project.",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * Keep track of newly uploaded files.
     * If something fails later, we can clean them up.
     */
    const uploadedStoragePaths: string[] = [];

    /*
     * Replace cover image.
     */
    if (
      coverImage instanceof File &&
      coverImage.size > 0
    ) {
      if (
        !ALLOWED_IMAGE_TYPES.includes(
          coverImage.type,
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Cover image must be JPG, PNG, or WEBP.",
          },
          {
            status: 400,
          },
        );
      }

      if (coverImage.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          {
            error:
              "Cover image must not exceed 10 MB.",
          },
          {
            status: 400,
          },
        );
      }

      const extension =
        getExtension(coverImage.name) || "jpg";

      const storagePath =
        `projects/${id}/cover-${Date.now()}.${extension}`;

      const arrayBuffer =
        await coverImage.arrayBuffer();

      const { error: uploadError } =
        await supabaseAdmin.storage
          .from("project-media")
          .upload(
            storagePath,
            arrayBuffer,
            {
              contentType: coverImage.type,
              upsert: false,
            },
          );

      if (uploadError) {
        console.error(
          "Cover upload error:",
          uploadError,
        );

        return NextResponse.json(
          {
            error:
              "Unable to upload replacement cover image.",
          },
          {
            status: 500,
          },
        );
      }

      uploadedStoragePaths.push(storagePath);

      /*
       * Delete old cover image after
       * the new image has uploaded successfully.
       */
      if (project.cover_image_path) {
        const { error: deleteOldCoverError } =
          await supabaseAdmin.storage
            .from("project-media")
            .remove([
              project.cover_image_path,
            ]);

        if (deleteOldCoverError) {
          console.error(
            "Old cover deletion error:",
            deleteOldCoverError,
          );
        }
      }

      const { error: coverUpdateError } =
        await supabaseAdmin
          .from("projects")
          .update({
            cover_image_path: storagePath,
            cover_image_name:
              coverImage.name,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", id);

      if (coverUpdateError) {
        console.error(
          "Cover database update error:",
          coverUpdateError,
        );

        await supabaseAdmin.storage
          .from("project-media")
          .remove([storagePath]);

        return NextResponse.json(
          {
            error:
              "Cover image uploaded but could not be saved.",
          },
          {
            status: 500,
          },
        );
      }
    }

    /*
     * Upload additional gallery images.
     */
    for (const file of projectImages) {
      if (
        !ALLOWED_IMAGE_TYPES.includes(file.type)
      ) {
        return NextResponse.json(
          {
            error:
              "Gallery images must be JPG, PNG, or WEBP.",
          },
          {
            status: 400,
          },
        );
      }

      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          {
            error:
              "Each gallery image must not exceed 10 MB.",
          },
          {
            status: 400,
          },
        );
      }

      const safeName = sanitizeFileName(
        file.name,
      );

      const storagePath =
        `projects/${id}/images/${Date.now()}-${safeName}`;

      const arrayBuffer =
        await file.arrayBuffer();

      const { error: uploadError } =
        await supabaseAdmin.storage
          .from("project-media")
          .upload(
            storagePath,
            arrayBuffer,
            {
              contentType: file.type,
              upsert: false,
            },
          );

      if (uploadError) {
        console.error(
          "Gallery image upload error:",
          uploadError,
        );

        await supabaseAdmin.storage
          .from("project-media")
          .remove(uploadedStoragePaths);

        return NextResponse.json(
          {
            error:
              "Unable to upload gallery image.",
          },
          {
            status: 500,
          },
        );
      }

      uploadedStoragePaths.push(storagePath);

      const { error: mediaInsertError } =
        await supabaseAdmin
          .from("project_media")
          .insert({
            project_id: id,
            media_type: "image",
            storage_path: storagePath,
            file_name: file.name,
          });

      if (mediaInsertError) {
        console.error(
          "Gallery media database error:",
          mediaInsertError,
        );

        await supabaseAdmin.storage
          .from("project-media")
          .remove([storagePath]);

        return NextResponse.json(
          {
            error:
              "Image uploaded but could not be saved.",
          },
          {
            status: 500,
          },
        );
      }
    }

    /*
     * Upload additional videos.
     */
    for (const file of projectVideos) {
      if (
        !ALLOWED_VIDEO_TYPES.includes(file.type)
      ) {
        return NextResponse.json(
          {
            error:
              "Videos must be MP4, WebM, or MOV.",
          },
          {
            status: 400,
          },
        );
      }

      if (file.size > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          {
            error:
              "Each video must not exceed 50 MB.",
          },
          {
            status: 400,
          },
        );
      }

      const safeName = sanitizeFileName(
        file.name,
      );

      const storagePath =
        `projects/${id}/videos/${Date.now()}-${safeName}`;

      const arrayBuffer =
        await file.arrayBuffer();

      const { error: uploadError } =
        await supabaseAdmin.storage
          .from("project-media")
          .upload(
            storagePath,
            arrayBuffer,
            {
              contentType: file.type,
              upsert: false,
            },
          );

      if (uploadError) {
        console.error(
          "Video upload error:",
          uploadError,
        );

        await supabaseAdmin.storage
          .from("project-media")
          .remove(uploadedStoragePaths);

        return NextResponse.json(
          {
            error:
              "Unable to upload project video.",
          },
          {
            status: 500,
          },
        );
      }

      uploadedStoragePaths.push(storagePath);

      const { error: mediaInsertError } =
        await supabaseAdmin
          .from("project_media")
          .insert({
            project_id: id,
            media_type: "video",
            storage_path: storagePath,
            file_name: file.name,
          });

      if (mediaInsertError) {
        console.error(
          "Video media database error:",
          mediaInsertError,
        );

        await supabaseAdmin.storage
          .from("project-media")
          .remove([storagePath]);

        return NextResponse.json(
          {
            error:
              "Video uploaded but could not be saved.",
          },
          {
            status: 500,
          },
        );
      }
    }

    /*
     * Delete selected existing media.
     *
     * The edit form can send:
     *
     * removeMediaIds = ["id1", "id2"]
     */
    const removeMediaIdsRaw = formData.get(
      "removeMediaIds",
    );

    let removeMediaIds: string[] = [];

    if (
      typeof removeMediaIdsRaw === "string" &&
      removeMediaIdsRaw.trim()
    ) {
      try {
        const parsed = JSON.parse(
          removeMediaIdsRaw,
        );

        if (Array.isArray(parsed)) {
          removeMediaIds = parsed.filter(
            (item): item is string =>
              typeof item === "string",
          );
        }
      } catch {
        return NextResponse.json(
          {
            error:
              "Invalid media deletion request.",
          },
          {
            status: 400,
          },
        );
      }
    }

    if (removeMediaIds.length > 0) {
      const {
        data: mediaToDelete,
        error: mediaFetchError,
      } = await supabaseAdmin
        .from("project_media")
        .select(
          "id, storage_path, project_id",
        )
        .eq("project_id", id)
        .in("id", removeMediaIds);

      if (mediaFetchError) {
        console.error(
          "Media deletion lookup error:",
          mediaFetchError,
        );

        return NextResponse.json(
          {
            error:
              "Unable to prepare media deletion.",
          },
          {
            status: 500,
          },
        );
      }

      if (mediaToDelete?.length) {
        const storagePaths =
          mediaToDelete.map(
            (item) => item.storage_path,
          );

        const { error: storageDeleteError } =
          await supabaseAdmin.storage
            .from("project-media")
            .remove(storagePaths);

        if (storageDeleteError) {
          console.error(
            "Storage media deletion error:",
            storageDeleteError,
          );

          return NextResponse.json(
            {
              error:
                "Unable to delete selected media files.",
            },
            {
              status: 500,
            },
          );
        }

        const mediaIds =
          mediaToDelete.map(
            (item) => item.id,
          );

        const { error: dbDeleteError } =
          await supabaseAdmin
            .from("project_media")
            .delete()
            .eq("project_id", id)
            .in("id", mediaIds);

        if (dbDeleteError) {
          console.error(
            "Media database deletion error:",
            dbDeleteError,
          );

          return NextResponse.json(
            {
              error:
                "Media files were deleted, but the database records could not be removed.",
            },
            {
              status: 500,
            },
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Project updated successfully.",
    });
  } catch (error) {
    console.error(
      "Project PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while updating the project.",
      },
      {
        status: 500,
      },
    );
  }
}

/*
 * DELETE ENTIRE PROJECT
 */
export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  const admin = await isAdmin();

  if (!admin) {
    return NextResponse.json(
      {
        error: "Unauthorized.",
      },
      {
        status: 401,
      },
    );
  }

  const { id } = await context.params;

  try {
    const { data: project, error: projectError } =
      await supabaseAdmin
        .from("projects")
        .select(
          "id, cover_image_path",
        )
        .eq("id", id)
        .single();

    if (projectError || !project) {
      return NextResponse.json(
        {
          error: "Project not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Get every gallery/video file.
     */
    const { data: media, error: mediaError } =
      await supabaseAdmin
        .from("project_media")
        .select("storage_path")
        .eq("project_id", id);

    if (mediaError) {
      console.error(
        "Project media lookup error:",
        mediaError,
      );

      return NextResponse.json(
        {
          error:
            "Unable to prepare project deletion.",
        },
        {
          status: 500,
        },
      );
    }

    const storagePaths = [
      ...(project.cover_image_path
        ? [project.cover_image_path]
        : []),
      ...(media ?? []).map(
        (item) => item.storage_path,
      ),
    ];

    /*
     * Delete storage files.
     */
    if (storagePaths.length > 0) {
      const { error: storageDeleteError } =
        await supabaseAdmin.storage
          .from("project-media")
          .remove(storagePaths);

      if (storageDeleteError) {
        console.error(
          "Project storage deletion error:",
          storageDeleteError,
        );

        return NextResponse.json(
          {
            error:
              "Unable to delete project files from storage.",
          },
          {
            status: 500,
          },
        );
      }
    }

    /*
     * Delete project.
     *
     * project_media records are automatically
     * removed because the table uses:
     *
     * ON DELETE CASCADE
     */
    const { error: deleteError } =
      await supabaseAdmin
        .from("projects")
        .delete()
        .eq("id", id);

    if (deleteError) {
      console.error(
        "Project database deletion error:",
        deleteError,
      );

      return NextResponse.json(
        {
          error:
            "Project files were removed, but the project could not be deleted.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Project DELETE error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while deleting the project.",
      },
      {
        status: 500,
      },
    );
  }
}