import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";
import ServiceCard from "./ServiceCard";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const { data: services, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Services Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage the services displayed on the public website.
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
              href="/admin/services/new"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              + Add Service
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            <h2 className="font-semibold">Unable to load services</h2>
            <p className="mt-1 text-sm">
              Please check your Supabase connection and try again.
            </p>
          </div>
        ) : !services || services.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No services found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Add your first service to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}