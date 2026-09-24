import Link from "next/link";
import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";
import SafetyStageEditForm from "./SafetyStageEditForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSafetyStagePage({
  params,
}: PageProps) {
  const admin = await isAdmin();

  if (!admin) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            Access Denied
          </h1>

          <p className="mt-2 text-slate-600">
            You do not have permission to access this page.
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const { id } = await params;

  const { data: stage, error } = await supabaseAdmin
    .from("safety_stages")
    .select("id, title, description, display_order, active")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!stage) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/safety"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Safety
        </Link>

        <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Safety
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Edit Project Stage
            </h1>

            <p className="mt-2 text-slate-600">
              Update this Safe Project Delivery stage.
            </p>
          </div>

          <SafetyStageEditForm stage={stage} />
        </div>
      </div>
    </main>
  );
}