import { supabaseAdmin } from "@/lib/supabase/server";
import { createTeamMediaUrl } from "@/lib/supabase/team-media";
import TeamMemberCard from "./TeamMemberCard";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const { data: teamMembers, error } =
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
        image_path
      `,
      )
      .eq("active", true)
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

  if (error) {
    console.error(
      "Public team members fetch error:",
      error,
    );
  }

  const membersWithImages = await Promise.all(
    (teamMembers ?? []).map(async (member) => {
      let imageUrl: string | null = null;

      if (member.image_path) {
        imageUrl = await createTeamMediaUrl(
          member.image_path,
        );
      }

      return {
        ...member,
        imageUrl,
      };
    }),
  );

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Our Team
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Meet the professionals behind our projects.
            </h1>

            <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
              Our team brings together professionals
              across construction, engineering,
              architecture, surveying, project
              management, and technology to deliver
              quality projects for our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Team Introduction */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Our People
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Experienced professionals working together.
              </h2>
            </div>

            <p className="text-base leading-8 text-slate-600">
              At GILGAL LAND CONSTRUCTION LIMITED,
              our professionals work collaboratively
              to plan, design, manage, and execute
              projects while maintaining a strong
              focus on quality, safety, and client
              satisfaction.
            </p>
          </div>
        </div>
      </section>
      {/* Team Members */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Team Members
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Meet our team
            </h2>
          </div>

          {membersWithImages.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                Our team profiles are being updated.
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Please check back soon to meet the
                professionals at GILGAL LAND
                CONSTRUCTION LIMITED.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {membersWithImages.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collaboration */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-3xl bg-blue-900 px-6 py-12 text-white sm:px-10 lg:px-14">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">
                Collaboration
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                One team, one commitment to quality.
              </h2>

              <p className="mt-5 text-base leading-8 text-white/80">
                Our multidisciplinary approach allows
                us to bring the right expertise together
                at every stage of a project, from
                planning and design through construction
                and completion.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}