import Link from "next/link";
import { redirect } from "next/navigation";

import { createAuthServerClient } from "@/lib/supabase/auth-server";
import { supabaseAdmin } from "@/lib/supabase/server";
import AdminUserCard from "./AdminUserCard";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const authSupabase = await createAuthServerClient();

  const {
    data: { user: currentUser },
  } = await authSupabase.auth.getUser();

  if (!currentUser) {
    redirect("/admin/login");
  }

  const { data: roles, error } = await supabaseAdmin
    .from("user_roles")
    .select("id, user_id, role, created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Failed to load administrators.");
  }

  const administrators = [];

  for (const role of roles ?? []) {
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.admin.getUserById(role.user_id);

    if (userError || !user) {
      continue;
    }

    administrators.push({
      id: role.id,
      userId: role.user_id,
      email: user.email ?? "Unknown email",
      role: role.role,
      createdAt: role.created_at,
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
              Admin Users
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Manage the users who are authorized to access the dashboard.
            </p>
          </div>

          <Link
            href="/admin/users/new"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            + Add Administrator
          </Link>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-bold text-slate-900">
              Authorized Dashboard Administrators
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              These users can access and manage the admin dashboard.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {administrators.length > 0 ? (
              administrators.map((administrator) => (
                <AdminUserCard
                  key={administrator.id}
                  id={administrator.id}
                  userId={administrator.userId}
                  email={administrator.email}
                  role={administrator.role}
                  createdAt={administrator.createdAt}
                  currentUserId={currentUser.id}
                />
              ))
            ) : (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                No administrators found.
              </div>
            )}
          </div>
        </section>

        <div className="mt-6">
          <Link
            href="/admin"
            className="text-sm font-semibold text-primary hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}