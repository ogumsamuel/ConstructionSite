import Link from "next/link";
import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createTeamMediaUrl } from "@/lib/supabase/team-media";
import TeamMemberCard from "./TeamMemberCard";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const admin = await isAdmin();

  if (!admin) {
    return null;
  }

  const { data: teamMembers, error } = await supabaseAdmin
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Team members fetch error:", error);
  }

  const membersWithImages = await Promise.all(
  (teamMembers ?? []).map(async (member) => ({
    ...member,
    imageUrl: member.image_path
      ? await createTeamMediaUrl(
          member.image_path,
        )
      : null,
  })),
);
  return (
    <main className="min-h-screen bg-surface px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Admin Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Team Management
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Add, edit, and manage the professional profiles displayed on the
              public team page.
            </p>
          </div>

          
            <Link
              href="/admin"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ← Dashboard
            </Link>
          

          <Link
            href="/admin/team/new"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            + Add Team Member
          </Link>
        </div>
        {/* Team Members */}
        <section className="mt-10">
          {membersWithImages.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-10 text-center">
              <h2 className="text-xl font-bold text-slate-900">
                No team members yet
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Add your first team member to start building the company team
                profiles.
              </p>

              <Link
                href="/admin/team/new"
                className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                Add Team Member
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {membersWithImages.map((member) => (
  <TeamMemberCard
    key={member.id}
    member={member}
  />
))}
        
            </div>
          )}
        </section>
      </div>
    </main>
  );
}