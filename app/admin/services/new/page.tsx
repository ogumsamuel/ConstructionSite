import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/supabase/admin";
import ServiceForm from "./ServiceForm";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Add Service
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Add a new service to the company website.
            </p>
          </div>

          <Link
            href="/admin/services"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Services
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-8 lg:px-8">
        <ServiceForm />
      </section>
    </main>
  );
}