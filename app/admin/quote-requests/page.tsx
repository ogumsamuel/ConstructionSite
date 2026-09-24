import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";
import DocumentButton from "./DocumentButton";
import QuoteRequestDeleteButton from "./QuoteRequestsDeleteButton";

export default async function QuoteRequestsPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const { data: quoteRequests, error } = await supabaseAdmin
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Quote requests error:", error);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Quote Requests
            </h1>
          </div>

          <Link
            href="/admin"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-bold text-red-800">
              Unable to load quote requests
            </h2>

            <p className="mt-2 text-sm text-red-700">
              Please try again later.
            </p>
          </div>
        ) : !quoteRequests || quoteRequests.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              No quote requests yet
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Customer quote requests will appear here when submitted.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {quoteRequests.map((request) => (
              <article
                key={request.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                {/* Top section */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {request.name}
                    </h2>

                    <div className="mt-2 space-y-1 text-sm text-slate-600">
                      <p>{request.email}</p>
                      <p>{request.phone}</p>
                    </div>
                  </div>

                  <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                    {request.status}
                  </span>
                </div>

                {/* Project information */}
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Project Type
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {request.project_type}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {request.location}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Estimated Budget
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {request.budget || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Preferred Start Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {request.preferred_start_date
                        ? new Date(
                            `${request.preferred_start_date}T00:00:00`,
                          ).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Project description */}
                <div className="mt-6 rounded-xl bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Project Description
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {request.description}
                  </p>
                </div>
              {/* Attachment */}
<div className="mt-5 rounded-xl border border-dashed border-slate-300 p-5">
  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
    Project Documents
  </p>

  <div className="mt-3">
    {request.document_path && request.document_name ? (
      <DocumentButton
        documentPath={request.document_path}
        documentName={request.document_name}
      />
    ) : (
      <p className="text-sm text-slate-500">
        No document attached.
      </p>
    )}
  </div>
</div>
       {/* Footer information */}
<div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
  <div className="space-y-2 text-xs text-slate-500">
    <p>
      Request ID:{" "}
      <span className="font-mono text-slate-600">
        {request.id}
      </span>
    </p>

    <p>
      Submitted{" "}
      {new Date(request.created_at).toLocaleString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}
    </p>
  </div>

  <QuoteRequestDeleteButton
    requestId={request.id}
    customerName={request.name}
    hasDocument={Boolean(request.document_path)}
  />
</div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}