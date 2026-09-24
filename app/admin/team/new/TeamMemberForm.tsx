"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeamMemberForm() {
  const router = useRouter();

  const [qualifications, setQualifications] =
    useState<string[]>([""]);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const addQualification = () => {
    setQualifications((current) => [
      ...current,
      "",
    ]);
  };

  const updateQualification = (
    index: number,
    value: string,
  ) => {
    setQualifications((current) =>
      current.map((qualification, currentIndex) =>
        currentIndex === index
          ? value
          : qualification,
      ),
    );
  };

  const removeQualification = (
    index: number,
  ) => {
    setQualifications((current) =>
      current.filter(
        (_, currentIndex) =>
          currentIndex !== index,
      ),
    );
  };

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.delete("qualifications");

    qualifications
      .map((qualification) =>
        qualification.trim(),
      )
      .filter(Boolean)
      .forEach((qualification) => {
        formData.append(
          "qualifications",
          qualification,
        );
      });

    formData.set("active", "true");

    try {
      const response = await fetch(
        "/api/admin/team",
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to create team member.",
        );
      }

      router.push("/admin/team");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong.",
      );

      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Basic Information */}
      <section className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">
          Basic Information
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="text-sm font-bold text-slate-700"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Engr. Ibor Nkanu Eyong"
              className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="text-sm font-bold text-slate-700"
            >
              Role
            </label>

            <input
              id="role"
              name="role"
              type="text"
              required
              placeholder="e.g. Project Manager"
              className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="text-sm font-bold text-slate-700"
            >
              Short Description
            </label>

            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Briefly describe this person's role and responsibilities."
              className="mt-2 w-full resize-none rounded-xl border border-border px-4 py-3 text-sm leading-7 outline-none transition focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Professional Profile */}
      <section className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">
          Professional Profile
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="yearsOfService"
              className="text-sm font-bold text-slate-700"
            >
              Years of Service
            </label>

            <input
              id="yearsOfService"
              name="yearsOfService"
              type="text"
              placeholder="e.g. 8 years"
              className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="biography"
              className="text-sm font-bold text-slate-700"
            >
              Short Biography
            </label>

            <textarea
              id="biography"
              name="biography"
              rows={6}
              placeholder="Write a short professional biography."
              className="mt-2 w-full resize-none rounded-xl border border-border px-4 py-3 text-sm leading-7 outline-none transition focus:border-primary"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-bold text-slate-700">
                Qualifications
              </label>

              <button
                type="button"
                onClick={addQualification}
                className="text-sm font-bold text-primary hover:opacity-80"
              >
                + Add Qualification
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {qualifications.map(
                (qualification, index) => (
                  <div
                    key={index}
                    className="flex gap-3"
                  >
                    <input
                      name="qualifications"
                      type="text"
                      value={qualification}
                      onChange={(event) =>
                        updateQualification(
                          index,
                          event.target.value,
                        )
                      }
                      placeholder={`Qualification ${index + 1}`}
                      className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none transition focus:border-primary"
                    />

                    {qualifications.length >
                      1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeQualification(
                            index,
                          )
                        }
                        className="rounded-xl border border-border px-4 text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Photo */}
      <section className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">
          Profile Photo
        </h2>

        <div className="mt-6">
          <label
            htmlFor="image"
            className="text-sm font-bold text-slate-700"
          >
            Team Member Photo
          </label>

          <input
            id="image"
            name="image"
            type="file"
            required
            accept=".jpg,.jpeg,.png,.webp"
            className="mt-2 block w-full rounded-xl border border-border bg-white px-4 py-3 text-sm"
          />

          <p className="mt-2 text-xs text-slate-500">
            JPG, PNG, or WEBP. Maximum size: 10 MB.
          </p>
        </div>
      </section>

      {/* Display Settings */}
      <section className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">
          Display Settings
        </h2>

        <div className="mt-6">
          <label
            htmlFor="displayOrder"
            className="text-sm font-bold text-slate-700"
          >
            Display Order
          </label>

          <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            min="0"
            defaultValue="0"
            className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none transition focus:border-primary sm:max-w-xs"
          />

          <p className="mt-2 text-xs text-slate-500">
            Lower numbers appear first.
          </p>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/team")}
          disabled={submitting}
          className="rounded-xl border border-border px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Adding Team Member..."
            : "Add Team Member"}
        </button>
      </div>
    </form>
  );
}