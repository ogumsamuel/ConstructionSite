import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const { data: services, error } = await supabaseAdmin
    .from("services")
    .select("id, title, description, display_order")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Public services fetch error:", error);
  }

  return (
    <main>
      {/* Page Hero */}
      <section className="bg-slate-900 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Our Services
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Professional construction and engineering solutions.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              GILGAL LAND CONSTRUCTION LIMITED provides a range of
              construction, engineering, design, infrastructure, renovation,
              and real estate services tailored to meet the needs of our
              clients.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <h2 className="text-xl font-bold text-red-800">
                Unable to load services
              </h2>

              <p className="mt-2 text-sm text-red-700">
                Please try again later.
              </p>
            </div>
          ) : !services || services.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
              <h2 className="text-xl font-bold text-slate-900">
                Services coming soon
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Our services are currently being updated.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {services.map((service, index) => (
                <article
                  key={service.id}
                  className="rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:p-10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-lg text-primary">
                      →
                    </div>
                  </div>

                  <h2 className="mt-8 text-2xl font-bold text-slate-900">
                    {service.title}
                  </h2>

                  <p className="mt-4 text-base leading-8 text-slate-600">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}