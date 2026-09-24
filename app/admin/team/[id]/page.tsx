import Link from "next/link";
import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/supabase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";
import TeamMemberEditForm from "./TeamMemberEditForm";

export const dynamic = "force-dynamic";

type EditTeamMemberPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTeamMemberPage({
  params,
}: EditTeamMemberPageProps) {
  const admin = await isAdmin();

  if (!admin) {
    return null;
  }

  const { id } = await params;

  const { data: member, error } =
    await supabaseAdmin
      .from("team_members")
      .select(
        `
        id,
        name,
        role,
        description,
        years_of_service,
        biography,
        qualifications,
        display_order,
        active
        `,
      )
      .eq("id", id)
      .maybeSingle();

  if (error) {
    console.error(
      "Edit team member fetch error:",
      error,
    );

    throw new Error(
      "Failed to load team member.",
    );
  }

  if (!member) {
    notFound();
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
            Edit Team Member
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Update the professional profile for{" "}
            <span className="font-semibold text-slate-900">
              {member.name}
            </span>
            .
          </p>
        </div>

        <div className="mt-10">
          <TeamMemberEditForm
            member={member}
          />
        </div>
      </div>
    </main>
  );
}