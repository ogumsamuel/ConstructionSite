import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createProjectMediaUrl } from "@/lib/supabase/project-media";

import ProjectEditForm from "./projectEditForm";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({
  params,
}: PageProps) {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const { data: project, error: projectError } =
    await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

  if (projectError || !project) {
    notFound();
  }

  const { data: media, error: mediaError } =
    await supabaseAdmin
      .from("project_media")
      .select("*")
      .eq("project_id", id)
      .order("created_at", {
        ascending: true,
      });

  if (mediaError) {
    console.error(
      "Project media error:",
      mediaError,
    );
  }

  let coverImageUrl: string | null = null;

  if (project.cover_image_path) {
    coverImageUrl = await createProjectMediaUrl(
      project.cover_image_path,
    );
  }

  const mediaWithUrls = await Promise.all(
    (media ?? []).map(async (item) => {
      const url = await createProjectMediaUrl(
        item.storage_path,
      );

      return {
        ...item,
        url,
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
              Edit Project
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update project information, images, and videos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/projects"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ← Projects
            </Link>

            <Link
              href={`/projects/${project.slug}`}
              target="_blank"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              View Project
            </Link>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <ProjectEditForm
          project={project}
          media={mediaWithUrls}
          coverImageUrl={coverImageUrl}
        />
      </div>
    </main>
  );
}