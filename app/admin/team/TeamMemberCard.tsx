"use client";

import Link from "next/link";
import { useState } from "react";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  years_of_service: string | null;
  biography: string | null;
  qualifications: string[];
  imageUrl: string | null;
  active: boolean;
};

type TeamMemberCardProps = {
  member: TeamMember;
};

export default function TeamMemberCard({
  member,
}: TeamMemberCardProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${member.name}"?\n\nThis will permanently delete the team member and their profile image.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/team/${member.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to delete team member.",
        );
      }

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete team member.",
      );

      setDeleting(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      {/* Photo */}
      <div className="relative h-96 bg-slate-100">
        {member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={`${member.name} - ${member.role}`}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
            No photo
          </div>
        )}
      </div>

      {/* Basic Information */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-primary">
              {member.role}
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              {member.name}
            </h2>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
              member.active
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {member.active ? "Active" : "Inactive"}
          </span>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          {member.description}
        </p>

        {/* Expanded Profile */}
        {showProfile && (
          <div className="mt-6 border-t border-border pt-6">
            <div className="space-y-6">
              {/* Years of Service */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  Years of Service
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-700">
                  {member.years_of_service || "Not provided"}
                </p>
              </div>

              {/* Biography */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  Biography
                </p>

                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
                  {member.biography || "Not provided"}
                </p>
              </div>

              {/* Qualifications */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  Qualifications
                </p>

                {member.qualifications?.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {member.qualifications.map(
                      (qualification, index) => (
                        <li
                          key={`${qualification}-${index}`}
                          className="flex gap-2 text-sm leading-7 text-slate-700"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{qualification}</span>
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Not provided
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Link
            href={`/admin/team/${member.id}`}
            className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-white transition hover:opacity-90"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={() =>
              setShowProfile((current) => !current)
            }
            className="rounded-xl border border-border px-4 py-3 text-center text-sm font-bold text-slate-700 transition hover:border-slate-400"
          >
            {showProfile ? "Hide Profile" : "View Profile"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl border border-red-200 px-4 py-3 text-center text-sm font-bold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}