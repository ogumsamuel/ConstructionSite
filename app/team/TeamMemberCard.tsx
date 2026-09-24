"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  years_of_service: string | null;
  biography: string | null;
  qualifications: string[];
  imageUrl: string | null;
};

type TeamMemberCardProps = {
  member: TeamMember;
};

export default function TeamMemberCard({
  member,
}: TeamMemberCardProps) {
  const [showProfile, setShowProfile] =
    useState(false);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Image */}
      <div className="relative h-98 bg-slate-100">
        {member.imageUrl ? (
          <img
  src={member.imageUrl}
  alt={`${member.name} - ${member.role}`}
  className="h-full w-full object-contain"
/>
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
            No photo available
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Basic information */}
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          {member.role}
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-900">
          {member.name}
        </h2>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          {member.description}
        </p>

        {/* Profile toggle */}
        <button
          type="button"
          onClick={() =>
            setShowProfile(
              (current) => !current,
            )
          }
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
        >
          {showProfile ? (
            <>
              Hide Profile
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              View Profile
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Expanded profile */}
        {showProfile && (
          <div className="mt-6 border-t border-border pt-6">
            <div className="space-y-6">
              {/* Years of service */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  Years of Service
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-700">
                  {member.years_of_service ||
                    "Not provided"}
                </p>
              </div>

              {/* Biography */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  Biography
                </p>

                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
                  {member.biography ||
                    "Not provided"}
                </p>
              </div>

              {/* Qualifications */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  Qualifications
                </p>

                {member.qualifications?.length >
                0 ? (
                  <ul className="mt-3 space-y-2">
                    {member.qualifications.map(
                      (
                        qualification,
                        index,
                      ) => (
                        <li
                          key={`${qualification}-${index}`}
                          className="flex gap-3 text-sm leading-7 text-slate-700"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                          <span>
                            {qualification}
                          </span>
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
      </div>
    </article>
  );
}