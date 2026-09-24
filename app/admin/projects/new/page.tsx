import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/supabase/admin";
import ProjectForm from "./ProjectForm";

export default async function NewProjectPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Add Project
            </h1>
          </div>

          <Link
            href="/admin/projects"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Projects
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <ProjectForm />
      </div>
    </main>
  );
}