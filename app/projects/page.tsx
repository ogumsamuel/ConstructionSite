import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createProjectMediaUrl } from "@/lib/supabase/project-media";

const projectCategories = [
  "All Projects",
  "Building Construction",
  "Road Construction",
  "Structural Engineering",
  "Renovation",
  "Infrastructure",
];

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { data: projects, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

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
    <main>
      {/* Page Hero */}
      <section className="bg-slate-900 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Our Projects
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Work built with quality and purpose.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Explore the projects and construction work delivered by GILGAL
              LAND CONSTRUCTION LIMITED across building, engineering,
              infrastructure, renovation, and related services.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Our Work
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Projects in progress and completed work.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Browse our project portfolio to learn more about the work we
              undertake and the solutions we deliver for our clients.
            </p>
          </div>

          {/* Category filters */}
          <div className="mt-10 flex flex-wrap gap-3">
            {projectCategories.map((category, index) => (
              <button
                key={category}
                type="button"
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                  index === 0
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-slate-600 hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects */}
          {error ? (
            <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
              <h3 className="text-xl font-bold text-red-800">
                Unable to load projects
              </h3>

              <p className="mt-3 text-sm text-red-700">
                Please try again later.
              </p>
            </div>
          ) : projectsWithImages.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
              <div className="mx-auto max-w-xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-primary shadow-sm">
                  +
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  Our project portfolio is coming together.
                </h3>

                <p className="mt-4 text-base leading-7 text-slate-600">
                  Project information, images, and videos will be added here
                  as the company portfolio is organized.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projectsWithImages.map((project) => (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Cover Image */}
                  <div className="h-56 overflow-hidden bg-slate-100">
                    {project.coverImageUrl ? (
                      <img
                        src={project.coverImageUrl}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl">🏗️</div>

                          <p className="mt-2 text-sm font-medium text-slate-500">
                            Project Image
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-slate-900">
                        {project.title}
                      </h3>

                      <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {project.status}
                      </span>
                    </div>

                    {project.project_type && (
                      <p className="mt-3 text-sm font-semibold text-primary">
                        {project.project_type}
                      </p>
                    )}

                    {project.location && (
                      <p className="mt-2 text-sm text-slate-500">
                        📍 {project.location}
                      </p>
                    )}

                    <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">
                      {project.description}
                    </p>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="mt-6 inline-flex text-sm font-bold text-slate-900 transition-colors hover:text-primary"
                    >
                      View Project →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Introduction */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Project Details
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              See the story behind every project.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Explore project details, scope of work, locations, construction
              progress, completed results, images, and relevant project videos.
            </p>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Each project has its own dedicated page so visitors can get a
              clearer understanding of the work delivered by GILGAL LAND
              CONSTRUCTION LIMITED.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-8 sm:p-10">
            <h3 className="text-xl font-bold text-slate-900">
              Project information
            </h3>

            <ul className="mt-6 space-y-4 text-sm text-slate-600">
              <li>✓ Project name</li>
              <li>✓ Project type</li>
              <li>✓ Location</li>
              <li>✓ Project status</li>
              <li>✓ Project images</li>
              <li>✓ Project videos</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}