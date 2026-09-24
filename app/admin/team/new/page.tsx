import Link from "next/link";
import { isAdmin } from "@/lib/supabase/admin";
import TeamMemberForm from "./TeamMemberForm";

export const dynamic = "force-dynamic";

export default async function NewTeamMemberPage() {
  const admin = await isAdmin();

  if (!admin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/team"
          className="text-sm font-bold text-primary hover:opacity-80"
        >
          ← Back to Team Management
        </Link>

        <div className="mt-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Team Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Add Team Member
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Add a professional profile to the GILGAL LAND CONSTRUCTION
            LIMITED team.
          </p>
        </div>

        <div className="mt-10">
          <TeamMemberForm />
        </div>
      </div>
    </main>
  );
}