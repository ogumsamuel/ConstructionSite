"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectForm() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      formData.set(
        "featured",
        formData.get("featured") === "on" ? "true" : "false",
      );

      const response = await fetch("/api/admin/projects", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to create the project.",
        );
      }

      setMessage("Project created successfully.");

      form.reset();

      setTimeout(() => {
        router.push("/admin/projects");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error("Create project error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create the project.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Project Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add the basic information about this construction project.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-slate-700"
            >
              Project Title *
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Residential Building Project"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />

            <p className="mt-1.5 text-xs text-slate-500">
              The URL slug will be generated automatically.
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-slate-700"
            >
              Project Description *
            </label>

            <textarea
              id="description"
              name="description"
              required
              rows={6}
              placeholder="Describe the project, scope of work, and key details."
              className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="projectType"
                className="block text-sm font-semibold text-slate-700"
              >
                Project Type
              </label>

              <select
                id="projectType"
                name="projectType"
                defaultValue=""
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Select project type</option>
                <option value="Building Construction">
                  Building Construction
                </option>
                <option value="Road Construction">
                  Road Construction
                </option>
                <option value="Structural Engineering">
                  Structural Engineering
                </option>
                <option value="Drainage Works">
                  Drainage Works
                </option>
                <option value="Renovation">Renovation</option>
                <option value="Architectural Design">
                  Architectural Design
                </option>
                <option value="Interior Decor">Interior Decor</option>
                <option value="Project Management">
                  Project Management
                </option>
                <option value="Real Estate">Real Estate</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-slate-700"
              >
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Abuja, Nigeria"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-semibold text-slate-700"
            >
              Project Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue="Completed"
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            >
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Project Cover Image
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Upload the main image that represents this project.
          </p>
        </div>

        <div className="mt-6">
          <label
            htmlFor="coverImage"
            className="block text-sm font-semibold text-slate-700"
          >
            Cover Image
          </label>

          <input
            id="coverImage"
            name="coverImage"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-700 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
          />

          <p className="mt-2 text-xs text-slate-500">
            JPG, PNG, or WEBP. Maximum size: 10 MB.
          </p>
        </div>
      </section>

      {/* Project Images */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Project Images
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Upload additional images that will appear in the project gallery.
          </p>
        </div>

        <div className="mt-6">
          <label
            htmlFor="projectImages"
            className="block text-sm font-semibold text-slate-700"
          >
            Gallery Images
          </label>

          <input
            id="projectImages"
            name="projectImages"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-700 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
          />

          <p className="mt-2 text-xs text-slate-500">
            You can select multiple JPG, PNG, or WEBP images. Maximum 10 MB
            per image.
          </p>
        </div>
      </section>

      {/* Project Videos */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Project Videos
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Upload videos showing construction progress, completed work, or
            project highlights.
          </p>
        </div>

        <div className="mt-6">
          <label
            htmlFor="projectVideos"
            className="block text-sm font-semibold text-slate-700"
          >
            Project Videos
          </label>

          <input
            id="projectVideos"
            name="projectVideos"
            type="file"
            multiple
            accept=".mp4,.webm,.mov"
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-700 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
          />

          <p className="mt-2 text-xs text-slate-500">
            MP4, WebM, or MOV. Maximum 50 MB per video.
          </p>
        </div>
      </section>

      {/* Website Settings */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Website Display
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose how this project should appear on the website.
          </p>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="featured"
            className="mt-1 h-4 w-4 rounded border-slate-300"
          />

          <span>
            <span className="block text-sm font-semibold text-slate-800">
              Feature this project
            </span>

            <span className="mt-1 block text-xs leading-5 text-slate-500">
              Featured projects can be highlighted on the public projects
              page and homepage.
            </span>
          </span>
        </label>
      </section>

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-700">{message}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating Project..." : "Create Project"}
        </button>
      </div>
    </form>
  );
}