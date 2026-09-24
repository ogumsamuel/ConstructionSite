import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createProjectMediaUrl } from "@/lib/supabase/project-media";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const { data: project, error: projectError } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (projectError) {
    console.error("Project detail error:", projectError);
    notFound();
  }

  if (!project) {
    notFound();
  }

  const { data: media, error: mediaError } = await supabaseAdmin
    .from("project_media")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at", { ascending: true });

  if (mediaError) {
    console.error("Project media error:", mediaError);
  }

  const coverImageUrl = project.cover_image_path
    ? await createProjectMediaUrl(project.cover_image_path)
    : null;

  const mediaWithUrls = await Promise.all(
    (media ?? []).map(async (item) => {
      const url = await createProjectMediaUrl(item.storage_path);

      return {
        ...item,
        url,
      };
    }),
  );

  const galleryImages = mediaWithUrls.filter(
    (item) => item.media_type === "image" && item.url,
  );

  const projectVideos = mediaWithUrls.filter(
    (item) => item.media_type === "video" && item.url,
  );

  return (
    <main>
      {/* Hero */}
      <section className="bg-slate-900 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Back to Projects
          </Link>

          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                {project.status}
              </span>

              {project.project_type && (
                <span className="rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                  {project.project_type}
                </span>
              )}
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            {project.location && (
              <p className="mt-5 text-base text-white/70 sm:text-lg">
                📍 {project.location}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Project Content */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Cover Image */}
          {coverImageUrl && (
            <div className="overflow-hidden rounded-2xl bg-slate-100">
              <img
                src={coverImageUrl}
                alt={project.title}
                className="h-auto max-h-[650px] w-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="mt-12 max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Project Overview
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              About this project
            </h2>

            <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600 sm:text-lg">
              {project.description}
            </p>
          </div>

          {/* Project Information */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {project.project_type && (
              <div className="rounded-2xl border border-border bg-surface p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Project Type
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {project.project_type}
                </p>
              </div>
            )}

            {project.location && (
              <div className="rounded-2xl border border-border bg-surface p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Location
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {project.location}
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </p>

              <p className="mt-2 font-bold text-slate-900">
                {project.status}
              </p>
            </div>
          </div>

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <section className="mt-20">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  Project Gallery
                </p>

                <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                  Images from the project
                </h2>

                <p className="mt-4 text-base leading-7 text-slate-600">
                  Explore images from the construction work and project
                  progress.
                </p>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((image) => (
                  <div
                    key={image.id}
                    className="group overflow-hidden rounded-2xl bg-slate-100"
                  >
                    <img
                      src={image.url!}
                      alt={`${project.title} - ${image.file_name}`}
                      className="aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Videos */}
          {projectVideos.length > 0 && (
            <section className="mt-20">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  Project Videos
                </p>

                <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                  See the project in motion
                </h2>

                <p className="mt-4 text-base leading-7 text-slate-600">
                  Watch videos showing project progress, construction
                  activities, and completed work.
                </p>
              </div>

              <div className="mt-10 grid gap-8 lg:grid-cols-2">
                {projectVideos.map((video) => (
                  <div
                    key={video.id}
                    className="overflow-hidden rounded-2xl border border-border bg-black shadow-sm"
                  >
                    <video
                      controls
                      preload="metadata"
                      className="aspect-video w-full"
                    >
                      <source src={video.url!} />

                      Your browser does not support the video player.
                    </video>

                    <div className="bg-white p-4">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {video.file_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* No Media */}
          {galleryImages.length === 0 &&
            projectVideos.length === 0 && (
              <section className="mt-16 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
                <h2 className="text-xl font-bold text-slate-900">
                  Project media coming soon
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Images and videos for this project will be added as the
                  project portfolio is updated.
                </p>
              </section>
            )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Start Your Project
          </p>

          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Have a construction project in mind?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Talk to GILGAL LAND CONSTRUCTION LIMITED about your next building,
            engineering, infrastructure, renovation, or construction project.
          </p>

          <Link
            href="/quote"
            className="mt-8 inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </main>
  );
}