"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Principle = {
  id: string;
  title: string;
  description: string;
  display_order: number;
  active: boolean;
};

type Props = {
  principle: Principle;
};

export default function SafetyPrincipleEditForm({ principle }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(principle.title);
  const [description, setDescription] = useState(principle.description);
  const [displayOrder, setDisplayOrder] = useState(
    String(principle.display_order),
  );
  const [active, setActive] = useState(principle.active);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/safety/principles/${principle.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            display_order: Number(displayOrder),
            active,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update safety principle.");
      }

      router.push("/admin/safety");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update safety principle.",
      );
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Title
        </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          rows={6}
          className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="displayOrder"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Display Order
        </label>

        <input
          id="displayOrder"
          type="number"
          min="0"
          value={displayOrder}
          onChange={(event) => setDisplayOrder(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={active}
          onChange={(event) => setActive(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />

        <span className="text-sm font-medium text-slate-700">
          Active
        </span>
      </label>

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/safety")}
          className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}