import Link from "next/link";
import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

import SafetyContentForm from "./SafetyContentForm";
import SafetyPrincipleCard from "./SafetyPrincipleCard";
import SafetyStageCard from "./SafetyStageCard";

export const dynamic = "force-dynamic";

export default async function SafetyAdminPage() {
  const admin = await isAdmin();

  if (!admin) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            Access Denied
          </h1>

          <p className="mt-2 text-slate-600">
            You do not have permission to access the Safety management page.
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const [
    { data: safetyContent, error: contentError },
    { data: principles, error: principlesError },
    { data: stages, error: stagesError },
  ] = await Promise.all([
    supabaseAdmin
      .from("safety_content")
      .select(`
        id,
        hero_label,
        hero_title,
        hero_description,
        commitment_label,
        commitment_title,
        commitment_description,
        commitment_description_secondary,
        highlight_title,
        highlight_description,
        approach_label,
        approach_title,
        approach_description
      `)
      .limit(1)
      .maybeSingle(),

    supabaseAdmin
      .from("safety_principles")
      .select(`
        id,
        title,
        description,
        display_order,
        active
      `)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),

    supabaseAdmin
      .from("safety_stages")
      .select(`
        id,
        title,
        description,
        display_order,
        active
      `)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (contentError) {
    throw new Error(
      `Failed to load Safety content: ${contentError.message}`,
    );
  }

  if (principlesError) {
    throw new Error(
      `Failed to load Safety principles: ${principlesError.message}`,
    );
  }

  if (stagesError) {
    throw new Error(
      `Failed to load Safety stages: ${stagesError.message}`,
    );
  }

  if (!safetyContent) {
    throw new Error(
      "Safety content has not been configured in the database.",
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Website Management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Safety Management
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Manage the content, safety principles, and project delivery
              stages displayed on the GILGAL Safety page.
            </p>
          </div>
        </div>

        {/* Safety Content */}
        <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <SafetyContentForm content={safetyContent} />
        </section>

        {/* Safety Principles */}
        <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Safety Principles
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Safety Principles
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Manage the principles displayed on the public Safety page.
              </p>
            </div>

            <Link
              href="/admin/safety/principles/new"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              + Add Principle
            </Link>
          </div>

          {principles && principles.length > 0 ? (
            <div className="space-y-4">
              {principles.map((principle) => (
                <SafetyPrincipleCard
                  key={principle.id}
                  principle={principle}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <h3 className="font-semibold text-slate-900">
                No safety principles
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Add your first safety principle to get started.
              </p>
            </div>
          )}
        </section>

        {/* Safe Project Delivery */}
        <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Safe Project Delivery
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Project Stages
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Manage the stages displayed in the Safe Project Delivery
                section.
              </p>
            </div>

            <Link
              href="/admin/safety/stages/new"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              + Add Stage
            </Link>
          </div>

          {stages && stages.length > 0 ? (
            <div className="space-y-4">
              {stages.map((stage) => (
                <SafetyStageCard
                  key={stage.id}
                  stage={stage}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <h3 className="font-semibold text-slate-900">
                No project stages
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Add your first project delivery stage to get started.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}