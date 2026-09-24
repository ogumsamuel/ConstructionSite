"use client";

import Link from "next/link";
import { useState } from "react";

type SafetyStage = {
  id: string;
  title: string;
  description: string;
  display_order: number;
  active: boolean;
};

type Props = {
  stage: SafetyStage;
};

export default function SafetyStageCard({ stage }: Props) {
  const [active, setActive] = useState(stage.active);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/safety/stages/${stage.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            active: !active,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to update stage.");
        return;
      }

      setActive(!active);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${stage.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/safety/stages/${stage.id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to delete stage.");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-primary">
          {String(stage.display_order).padStart(2, "0")}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            active
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {active ? "Active" : "Hidden"}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-900">
        {stage.title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {stage.description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          {loading
            ? "Updating..."
            : active
              ? "Hide"
              : "Show"}
        </button>

        <div className="flex gap-2">
          <Link
            href={`/admin/safety/stages/${stage.id}`}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}