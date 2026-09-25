"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Project = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  project_type: string | null;
  status: string;
  featured: boolean;
  slug: string;
};

type ProjectMedia = {
  id: string;
  media_type: "image" | "video";
  storage_path: string;
  file_name: string;
  url: string | null;
};

type Props = {
  project: Project;
  media: ProjectMedia[];
  coverImageUrl: string | null;
};

export default function ProjectEditForm({
  project,
  media,
  coverImageUrl,
}: Props) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(
    project.description,
  );
  const [projectType, setProjectType] = useState(
    project.project_type ?? "",
  );
  const [location, setLocation] = useState(
    project.location ?? "",
  );
  const [status, setStatus] = useState(project.status);
  const [featured, setFeatured] = useState(
    project.featured,
  );

  const [coverImage, setCoverImage] =
    useState<File | null>(null);

  const [projectImages, setProjectImages] = useState<
    File[]
  >([]);

  const [projectVideos, setProjectVideos] = useState<
    File[]
  >([]);

  const [removeMediaIds, setRemoveMediaIds] =
    useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const galleryImages = media.filter(
    (item) => item.media_type === "image",
  );

  const videos = media.filter(
    (item) => item.media_type === "video",
  );

  function toggleMediaRemoval(mediaId: string) {
    setRemoveMediaIds((current) => {
      if (current.includes(mediaId)) {
        return current.filter(
          (id) => id !== mediaId,
        );
      }

      return [...current, mediaId];
    });
  }

  async function uploadVideosDirectly() {
    if (projectVideos.length === 0) {
      return;
    }

    const supabase = createClient();

    for (const video of projectVideos) {
      setMessage(
        `Preparing video upload: ${video.name}`,
      );

      /*
       * Step 1:
       * Ask our secure server route for a
       * temporary signed upload token.
       *
       * Only metadata is sent to Vercel.
       * The actual video file is NOT sent here.
       */
      const prepareResponse = await fetch(
        `/api/admin/projects/${project.id}/video-upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "prepare",
            fileName: video.name,
            fileType: video.type,
            fileSize: video.size,
          }),
        },
      );

      const prepareData =
        await prepareResponse.json();

      if (!prepareResponse.ok) {
        throw new Error(
          prepareData.error ||
            `Unable to prepare video upload for ${video.name}.`,
        );
      }

      /*
       * Step 2:
       * Upload the actual video directly
       * from the browser to Supabase Storage.
       *
       * This bypasses the Vercel Function
       * request-body limit.
       */
      setMessage(
        `Uploading video: ${video.name}`,
      );

      const { error: uploadError } =
        await supabase.storage
          .from("project-media")
          .uploadToSignedUrl(
            prepareData.storagePath,
            prepareData.token,
            video,
          );

      if (uploadError) {
        console.error(
          "Direct video upload error:",
          uploadError,
        );

        throw new Error(
          `Unable to upload ${video.name}: ${uploadError.message}`,
        );
      }

      /*
       * Step 3:
       * Tell our secure server that the upload
       * succeeded so it can create the
       * project_media database record.
       */
      setMessage(
        `Finishing video upload: ${video.name}`,
      );

      const completeResponse =
        await fetch(
          `/api/admin/projects/${project.id}/video-upload`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action: "complete",
              storagePath:
                prepareData.storagePath,
              fileName: video.name,
              fileType: video.type,
            }),
          },
        );

      const completeData =
        await completeResponse.json();

      if (!completeResponse.ok) {
        throw new Error(
          completeData.error ||
            `Unable to finish video upload for ${video.name}.`,
        );
      }
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      /*
       * First save the normal project data,
       * cover image, gallery images and
       * media removals through the existing
       * project PATCH route.
       *
       * IMPORTANT:
       * Videos are intentionally NOT added
       * to this FormData anymore.
       */
      const formData = new FormData();

      formData.append("title", title);
      formData.append(
        "description",
        description,
      );
      formData.append(
        "projectType",
        projectType,
      );
      formData.append(
        "location",
        location,
      );
      formData.append("status", status);
      formData.append(
        "featured",
        featured ? "true" : "false",
      );

      if (removeMediaIds.length > 0) {
        formData.append(
          "removeMediaIds",
          JSON.stringify(
            removeMediaIds,
          ),
        );
      }

      if (coverImage) {
        formData.append(
          "coverImage",
          coverImage,
        );
      }

      projectImages.forEach((file) => {
        formData.append(
          "projectImages",
          file,
        );
      });

      const response = await fetch(
        `/api/admin/projects/${project.id}`,
        {
          method: "PATCH",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update project.",
        );
      }

      /*
       * Now upload videos directly to
       * Supabase Storage.
       */
      await uploadVideosDirectly();

      setMessage(
        "Project updated successfully.",
      );

      setTimeout(() => {
        window.location.href =
          "/admin/projects";
      }, 1000);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update project.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Project Details */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Project Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update the basic information about this project.
          </p>
        </div>

        <div className="mt-6 grid gap-6">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Project Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              required
              rows={6}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Project Type
              </label>

              <input
                type="text"
                value={projectType}
                onChange={(event) =>
                  setProjectType(
                    event.target.value,
                  )
                }
                placeholder="e.g. Building Construction"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(
                    event.target.value,
                  )
                }
                placeholder="e.g. Abuja, Nigeria"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="Completed">
                Completed
              </option>

              <option value="Ongoing">
                Ongoing
              </option>

              <option value="Upcoming">
                Upcoming
              </option>
            </select>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) =>
                setFeatured(
                  event.target.checked,
                )
              }
              className="h-4 w-4 rounded border-slate-300"
            />

            <span>
              <span className="block text-sm font-semibold text-slate-800">
                Featured Project
              </span>

              <span className="block text-xs text-slate-500">
                Display this project prominently on the website.
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* Cover Image */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Cover Image
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Replace the main image displayed for this project.
          </p>
        </div>

        {coverImageUrl && (
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <div className="flex h-72 items-center justify-center">
              <img
                src={coverImageUrl}
                alt={project.title}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-700">
            Upload Replacement Cover
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) =>
              setCoverImage(
                event.target.files?.[0] ??
                  null,
              )
            }
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white p-3 text-sm"
          />

          <p className="mt-2 text-xs text-slate-500">
            Leave empty to keep the current cover image.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Project Gallery
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage existing project images and upload new ones.
          </p>
        </div>

        {galleryImages.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image) => {
              const markedForRemoval =
                removeMediaIds.includes(
                  image.id,
                );

              return (
                <div
                  key={image.id}
                  className={`overflow-hidden rounded-xl border bg-slate-100 ${
                    markedForRemoval
                      ? "border-red-400 ring-2 ring-red-200"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex h-48 items-center justify-center">
                    {image.url ? (
                      <img
                        src={image.url}
                        alt={image.file_name}
                        className={`h-full w-full object-contain ${
                          markedForRemoval
                            ? "opacity-40"
                            : ""
                        }`}
                      />
                    ) : (
                      <span className="text-sm text-slate-500">
                        Image unavailable
                      </span>
                    )}
                  </div>

                  <div className="border-t border-slate-200 bg-white p-3">
                    <p className="truncate text-xs font-medium text-slate-600">
                      {image.file_name}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        toggleMediaRemoval(
                          image.id,
                        )
                      }
                      className={`mt-3 w-full rounded-md px-3 py-2 text-xs font-bold transition ${
                        markedForRemoval
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      {markedForRemoval
                        ? "Undo Remove"
                        : "Remove Image"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6">
          <label className="text-sm font-semibold text-slate-700">
            Upload Additional Images
          </label>

          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) =>
              setProjectImages(
                Array.from(
                  event.target.files ?? [],
                ),
              )
            }
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white p-3 text-sm"
          />
        </div>
      </section>

      {/* Videos */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Project Videos
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage existing project videos and upload new ones.
          </p>
        </div>

        {videos.length > 0 && (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {videos.map((video) => {
              const markedForRemoval =
                removeMediaIds.includes(
                  video.id,
                );

              return (
                <div
                  key={video.id}
                  className={`overflow-hidden rounded-xl border ${
                    markedForRemoval
                      ? "border-red-400 ring-2 ring-red-200"
                      : "border-slate-200"
                  }`}
                >
                  {video.url ? (
                    <video
                      src={video.url}
                      controls
                      className={`h-64 w-full bg-black object-contain ${
                        markedForRemoval
                          ? "opacity-40"
                          : ""
                      }`}
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-slate-50">
                      <span className="text-sm text-slate-500">
                        Video unavailable
                      </span>
                    </div>
                  )}

                  <div className="border-t border-slate-200 bg-white p-3">
                    <p className="truncate text-xs font-medium text-slate-600">
                      {video.file_name}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        toggleMediaRemoval(
                          video.id,
                        )
                      }
                      className={`mt-3 w-full rounded-md px-3 py-2 text-xs font-bold transition ${
                        markedForRemoval
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      {markedForRemoval
                        ? "Undo Remove"
                        : "Remove Video"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6">
          <label className="text-sm font-semibold text-slate-700">
            Upload Additional Videos
          </label>

          <input
            type="file"
            multiple
            accept="video/mp4,video/webm,video/quicktime"
            onChange={(event) =>
              setProjectVideos(
                Array.from(
                  event.target.files ?? [],
                ),
              )
            }
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white p-3 text-sm"
          />

          <p className="mt-2 text-xs text-slate-500">
            Videos are uploaded directly to Supabase Storage.
          </p>
        </div>
      </section>

      {/* Messages */}
      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/admin/projects"
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving Changes..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}