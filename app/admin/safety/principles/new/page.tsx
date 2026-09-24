import Link from "next/link";
import { isAdmin } from "@/lib/supabase/admin";
import SafetyPrincipleForm from "./SafetyPrincipleForm";

export default async function NewSafetyPrinciplePage() {
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
              Add Safety Principle
            </h1>

            <p className="mt-2 text-slate-600">
              Add a new safety principle that can be displayed on the public
              Safety page.
            </p>
          </div>

          <SafetyPrincipleForm />
        </div>
      </div>
    </main>
  );
}