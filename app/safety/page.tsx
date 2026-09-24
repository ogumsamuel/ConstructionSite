import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SafetyPage() {
  const [
    { data: safetyContent, error: contentError },
    { data: safetyPrinciples, error: principlesError },
    { data: safetyStages, error: stagesError },
  ] = await Promise.all([
    supabaseAdmin
      .from("safety_content")
      .select(`
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
        display_order
      `)
      .eq("active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),

    supabaseAdmin
      .from("safety_stages")
      .select(`
        id,
        title,
        description,
        display_order
      `)
      .eq("active", true)
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
    <main>
      {/* Page Hero */}
      <section className="bg-slate-900 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              {safetyContent.hero_label}
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {safetyContent.hero_title}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              {safetyContent.hero_description}
            </p>
          </div>
        </div>
      </section>

      {/* Safety Commitment */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              {safetyContent.commitment_label}
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              {safetyContent.commitment_title}
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
              {safetyContent.commitment_description}
            </p>

            <p className="mt-4 text-base leading-8 text-slate-600">
              {safetyContent.commitment_description_secondary}
            </p>
          </div>

          {/* Safety highlight */}
          <div className="rounded-2xl bg-surface p-8 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
              ✓
            </div>

            <h3 className="mt-6 text-2xl font-bold text-slate-900">
              {safetyContent.highlight_title}
            </h3>

            <p className="mt-4 text-base leading-7 text-slate-600">
              {safetyContent.highlight_description}
            </p>
          </div>
        </div>
      </section>

      {/* Safety Principles */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              {safetyContent.approach_label}
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              {safetyContent.approach_title}
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              {safetyContent.approach_description}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {safetyPrinciples?.map((principle, index) => (
              <article
                key={principle.id}
                className="rounded-2xl border border-border bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <span className="text-sm font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {principle.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Safe Project Delivery */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {safetyStages?.map((stage) => (
              <div
                key={stage.id}
                className="rounded-2xl border border-border p-8"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  {stage.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}