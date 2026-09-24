import Link from "next/link";
import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createProjectMediaUrl } from "@/lib/supabase/project-media";
import ProjectDeleteButton from "./projectDeleteButton";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const { data: projects, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Projects error:", error);
  }

  const projectsWithImages = await Promise.all(
    (projects ?? []).map(async (project) => {
      let coverImageUrl: string | null = null;

      if (project.cover_image_path) {
        coverImageUrl = await createProjectMediaUrl(
          project.cover_image_path,
        );
      }

      return {
        ...project,
        coverImageUrl,
      };
    }),
  );

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Projects Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage construction projects displayed on the website.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ← Dashboard
            </Link>

            <Link
              href="/admin/projects/new"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              + Add Project
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-bold text-red-800">
              Unable to load projects
            </h2>

            <p className="mt-2 text-sm text-red-700">
              Please try again later.
            </p>
          </div>
        ) : projectsWithImages.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
              🏗️
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No projects yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Add your first construction project to start building the
              company&apos;s project portfolio.
            </p>

            <Link
              href="/admin/projects/new"
              className="mt-6 inline-flex rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              + Add Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projectsWithImages.map((project) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Cover */}
                <div className="relative flex h-64 items-center justify-center bg-slate-100">
                  {project.coverImageUrl ? (
                    <img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl">🏗️</div>

                      <p className="mt-2 text-xs font-medium text-slate-500">
                        No cover image
                      </p>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-bold text-slate-900">
                      {project.title}
                    </h2>

                    <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {project.status}
                    </span>
                  </div>

                  {project.project_type && (
                    <p className="mt-2 text-sm font-medium text-primary">
                      {project.project_type}
                    </p>
                  )}

                  {project.location && (
                    <p className="mt-1 text-sm text-slate-500">
                      📍 {project.location}
                    </p>
                  )}

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {project.description}
                  </p>

                  {/* Actions */}
                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          project.featured
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {project.featured
                          ? "Featured"
                          : "Not Featured"}
                      </span>

                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-sm font-bold text-slate-900 hover:text-primary"
                      >
                        Edit Project →
                      </Link>
                    </div>

                    <div className="mt-4">
                      <ProjectDeleteButton
                        projectId={project.id}
                        projectTitle={project.title}
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}