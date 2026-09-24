import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";
import ServiceEditForm from "./ServiceEditForm";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditServicePage({
  params,
}: PageProps) {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const { data: service, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Service fetch error:", error);

    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h1 className="font-semibold">
            Unable to load service
          </h1>

          <p className="mt-2 text-sm">
            Please try again.
          </p>
        </div>
      </main>
    );
  }

  if (!service) {
    notFound();
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
              Edit Service
            </h1>
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
        <ServiceEditForm service={service} />
      </section>
    </main>
  );
}