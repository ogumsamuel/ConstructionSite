import Link from "next/link";
import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/supabase/admin";
import AddAdminForm from "./AddAdminForm";

export const dynamic = "force-dynamic";

export default async function AddAdministratorPage() {
  const authorized = await isAdmin();

  if (!authorized) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">
            Administration
          </p>

          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Add Administrator
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Authorize an existing Supabase account to access the dashboard.
          </p>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <AddAdminForm />
        </section>

        <div className="mt-6">
          <Link
            href="/admin/users"
            className="text-sm font-semibold text-primary hover:underline"
          >
            ← Back to Admin Users
          </Link>
        </div>
      </div>
    </main>
  );
}