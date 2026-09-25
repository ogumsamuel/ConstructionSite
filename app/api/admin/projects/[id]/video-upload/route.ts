import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

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

async function verifyProject(projectId: string) {
  const { data: project, error } = await supabaseAdmin
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .single();

  if (projectErrorOrMissing(error, project)) {
    return false;
  }

  return true;
}

function projectErrorOrMissing(
  error: unknown,
  project: unknown,
) {
  return Boolean(error || !project);
}

export async function POST(
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
    const projectExists = await verifyProject(id);

    if (!projectExists) {
      return NextResponse.json(
        {
          error: "Project not found.",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

    const action = String(
      body.action ?? "prepare",
    ).trim();

    /*
     * --------------------------------------------------
     * PREPARE
     * --------------------------------------------------
     *
     * Generate a temporary signed upload token.
     * The actual video does NOT pass through Vercel.
     */
    if (action === "prepare") {
      const fileName = String(
        body.fileName ?? "",
      ).trim();

      const fileType = String(
        body.fileType ?? "",
      ).trim();

      const fileSize = Number(body.fileSize);

      if (!fileName) {
        return NextResponse.json(
          {
            error:
              "Video file name is required.",
          },
          {
            status: 400,
          },
        );
      }

      if (!fileType) {
        return NextResponse.json(
          {
            error:
              "Video file type is required.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        !Number.isFinite(fileSize) ||
        fileSize <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid video file size.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        !ALLOWED_VIDEO_TYPES.includes(
          fileType,
        )
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

      if (fileSize > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          {
            error:
              "Each video must not exceed 100 MB.",
          },
          {
            status: 400,
          },
        );
      }

      const safeName =
        sanitizeFileName(fileName);

      const extension =
        getExtension(safeName) || "mp4";

      const storagePath =
        `projects/${id}/videos/${crypto.randomUUID()}.${extension}`;

      const {
        data,
        error: signedUrlError,
      } = await supabaseAdmin.storage
        .from("project-media")
        .createSignedUploadUrl(
          storagePath,
        );

      if (
        signedUrlError ||
        !data
      ) {
        console.error(
          "Signed video upload URL error:",
          signedUrlError,
        );

        return NextResponse.json(
          {
            error:
              "Unable to prepare video upload.",
          },
          {
            status: 500,
          },
        );
      }

      return NextResponse.json({
        success: true,
        storagePath,
        token: data.token,
        fileName,
        fileType,
      });
    }

    /*
     * --------------------------------------------------
     * COMPLETE
     * --------------------------------------------------
     *
     * The browser has already uploaded the actual
     * video directly to Supabase Storage.
     *
     * Now create the project_media database record.
     */
    if (action === "complete") {
      const storagePath = String(
        body.storagePath ?? "",
      ).trim();

      const fileName = String(
        body.fileName ?? "",
      ).trim();

      const fileType = String(
        body.fileType ?? "",
      ).trim();

      const expectedPrefix =
        `projects/${id}/videos/`;

      if (
        !storagePath.startsWith(
          expectedPrefix,
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid video storage path.",
          },
          {
            status: 400,
          },
        );
      }

      if (!fileName) {
        return NextResponse.json(
          {
            error:
              "Video file name is required.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        !ALLOWED_VIDEO_TYPES.includes(
          fileType,
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid video file type.",
          },
          {
            status: 400,
          },
        );
      }

      /*
       * Confirm that the uploaded object exists
       * in Supabase Storage before creating the
       * database record.
       */
      const filePath =
        storagePath.substring(
          `projects/${id}/`.length,
        );

      const folderPath =
        filePath.substring(
          0,
          filePath.lastIndexOf("/"),
        );

      const fileNameInStorage =
        filePath.substring(
          filePath.lastIndexOf("/") + 1,
        );

      const {
        data: storageFiles,
        error: storageError,
      } = await supabaseAdmin.storage
        .from("project-media")
        .list(
          `projects/${id}/videos`,
          {
            search: fileNameInStorage,
          },
        );

      if (storageError) {
        console.error(
          "Uploaded video verification error:",
          storageError,
        );

        return NextResponse.json(
          {
            error:
              "Unable to verify uploaded video.",
          },
          {
            status: 500,
          },
        );
      }

      const uploadedFileExists =
        storageFiles?.some(
          (file) =>
            file.name ===
            fileNameInStorage,
        );

      if (!uploadedFileExists) {
        return NextResponse.json(
          {
            error:
              "Uploaded video could not be found in storage.",
          },
          {
            status: 400,
          },
        );
      }

      const { data: media, error: mediaError } =
        await supabaseAdmin
          .from("project_media")
          .insert({
            project_id: id,
            media_type: "video",
            storage_path: storagePath,
            file_name: fileName,
          })
          .select(
            "id, project_id, media_type, storage_path, file_name, created_at",
          )
          .single();

      if (
        mediaError ||
        !media
      ) {
        console.error(
          "Project video media insert error:",
          mediaError,
        );

        /*
         * If the database record fails,
         * remove the uploaded object so
         * we don't leave an orphaned video.
         */
        await supabaseAdmin.storage
          .from("project-media")
          .remove([storagePath]);

        return NextResponse.json(
          {
            error:
              "Video uploaded, but the project media record could not be created.",
          },
          {
            status: 500,
          },
        );
      }

      return NextResponse.json({
        success: true,
        media,
      });
    }

    return NextResponse.json(
      {
        error:
          "Invalid video upload action.",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    console.error(
      "Video upload API error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while processing the video.",
      },
      {
        status: 500,
      },
    );
  }
}