"use client";

import Link from "next/link";
import { useState } from "react";

type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  active: boolean;
  display_order: number;
};

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const [active, setActive] = useState(service.active);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active: !active,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to update service.");
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
      `Are you sure you want to delete "${service.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to delete service.");
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
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-primary">
            {String(service.display_order).padStart(2, "0")}
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {service.title}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              /{service.slug}
            </p>
          </div>
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

      <p className="mt-5 text-sm leading-7 text-slate-600">
        {service.description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Updating..." : active ? "Hide Service" : "Show Service"}
        </button>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/services/${service.id}`}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}