"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ServiceForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [active, setActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          display_order: Number(displayOrder),
          active,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error || "Failed to create service.",
        );
        return;
      }

      router.push("/admin/services");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-slate-700"
          >
            Service Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) =>
              handleTitleChange(event.target.value)
            }
            placeholder="e.g. Architectural Design"
            required
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-semibold text-slate-700"
          >
            Slug
          </label>

          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(event) =>
              setSlug(createSlug(event.target.value))
            }
            placeholder="architectural-design"
            required
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <p className="mt-2 text-xs text-slate-500">
            This is used for the service URL.
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-slate-700"
          >
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Describe the service..."
            required
            rows={6}
            className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="displayOrder"
            className="block text-sm font-semibold text-slate-700"
          >
            Display Order
          </label>

          <input
            id="displayOrder"
            type="number"
            min="0"
            value={displayOrder}
            onChange={(event) =>
              setDisplayOrder(event.target.value)
            }
            placeholder="11"
            required
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <p className="mt-2 text-xs text-slate-500">
            Lower numbers appear first on the public services page.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={active}
              onChange={(event) =>
                setActive(event.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300"
            />

            <span>
              <span className="block text-sm font-semibold text-slate-800">
                Active service
              </span>

              <span className="block text-xs text-slate-500">
                Active services can appear on the public website.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create Service"}
        </button>
      </div>
    </form>
  );
}