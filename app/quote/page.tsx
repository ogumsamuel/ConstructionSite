"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const projectTypes = [
  "Architectural Design",
  "Interior Decor",
  "Structural Design",
  "Building Construction",
  "Road Construction",
  "Structural Engineering",
  "Drainage Works",
  "Project Management",
  "Renovation",
  "Real Estate Services",
  "Other",
];

const budgetRanges = [
  "Below ₦5 million",
  "₦5 million - ₦20 million",
  "₦20 million - ₦50 million",
  "₦50 million - ₦100 million",
  "Above ₦100 million",
  "Not sure yet",
];

export default function QuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to submit your quote request.",
        );
      }

      setSuccessMessage(
        "Your project enquiry has been submitted successfully. Our team will review it and contact you.",
      );

      form.reset();
    } catch (error) {
      console.error("Quote submission error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      {/* Page Hero */}
      <section className="bg-slate-900 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Get a Quote
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Tell us about your project.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Share some details about your project and our team can review
              your requirements and discuss the next steps with you.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
            {/* Form */}
            <div className="rounded-2xl border border-border bg-white p-6 sm:p-10">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  Project Enquiry
                </p>

                <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Request a project consultation
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Please provide as much information as possible. This will
                  help our team understand your project before getting in
                  touch.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Your Information
                  </h3>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="text-sm font-semibold text-slate-800"
                      >
                        Full Name *
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your full name"
                        className="mt-2 w-full rounded-md border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="text-sm font-semibold text-slate-800"
                      >
                        Phone Number *
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="e.g. 08012345678"
                        className="mt-2 w-full rounded-md border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold text-slate-800"
                      >
                        Email Address *
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="mt-2 w-full rounded-md border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="text-sm font-semibold text-slate-800"
                      >
                        Project Location *
                      </label>

                      <input
                        id="location"
                        name="location"
                        type="text"
                        required
                        placeholder="City / State"
                        className="mt-2 w-full rounded-md border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Information */}
                <div className="border-t border-border pt-8">
                  <h3 className="text-lg font-bold text-slate-900">
                    Project Information
                  </h3>

                  <div className="mt-5 space-y-5">
                    <div>
                      <label
                        htmlFor="projectType"
                        className="text-sm font-semibold text-slate-800"
                      >
                        Project Type *
                      </label>

                      <select
                        id="projectType"
                        name="projectType"
                        required
                        defaultValue=""
                        className="mt-2 w-full rounded-md border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      >
                        <option value="" disabled>
                          Select a project type
                        </option>

                        {projectTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="budget"
                        className="text-sm font-semibold text-slate-800"
                      >
                        Estimated Budget
                      </label>

                      <select
                        id="budget"
                        name="budget"
                        defaultValue=""
                        className="mt-2 w-full rounded-md border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      >
                        <option value="" disabled>
                          Select an estimated budget
                        </option>

                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="preferredStartDate"
                        className="text-sm font-semibold text-slate-800"
                      >
                        Preferred Start Date
                      </label>

                      <input
                        id="preferredStartDate"
                        name="preferredStartDate"
                        type="date"
                        className="mt-2 w-full rounded-md border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="text-sm font-semibold text-slate-800"
                      >
                        Tell Us About Your Project *
                      </label>

                      <textarea
                        id="description"
                        name="description"
                        required
                        rows={7}
                        placeholder="Describe your project, what you need, the current stage, approximate size, or any other useful information..."
                        className="mt-2 w-full resize-y rounded-md border border-border bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    {/* Project Document */}
                    <div>
                      <label
                        htmlFor="document"
                        className="text-sm font-semibold text-slate-800"
                      >
                        Project Document
                      </label>

                      <input
                        id="document"
                        name="document"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                        className="mt-2 block w-full rounded-md border border-border bg-white px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-surface file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-800"
                      />

                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        You may attach a plan, drawing, BOQ, reference image,
                        or other relevant project document. Maximum size: 10 MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="border-t border-border pt-8">
                  {successMessage && (
                    <div
                      role="status"
                      className="mb-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-800"
                    >
                      {successMessage}
                    </div>
                  )}

                  {errorMessage && (
                    <div
                      role="alert"
                      className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
                    >
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-md bg-primary px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Project Enquiry"}
                  </button>

                  <p className="mt-4 text-xs leading-6 text-slate-500">
                    By submitting this form, you are providing your project
                    information to GILGAL LAND CONSTRUCTION LIMITED for the
                    purpose of reviewing your enquiry and contacting you about
                    your project.
                  </p>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <aside className="h-fit space-y-6 lg:sticky lg:top-28">
              <div className="rounded-2xl bg-slate-900 p-7 text-white sm:p-8">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  What Happens Next?
                </p>

                <div className="mt-7 space-y-6">
                  <div className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold">
                      1
                    </span>

                    <div>
                      <h3 className="font-bold">We review your enquiry</h3>

                      <p className="mt-1 text-sm leading-6 text-white/65">
                        Our team reviews the information and requirements you
                        provide.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold">
                      2
                    </span>

                    <div>
                      <h3 className="font-bold">We contact you</h3>

                      <p className="mt-1 text-sm leading-6 text-white/65">
                        We discuss your project and clarify any important
                        requirements.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold">
                      3
                    </span>

                    <div>
                      <h3 className="font-bold">Project assessment</h3>

                      <p className="mt-1 text-sm leading-6 text-white/65">
                        Where appropriate, the project can proceed to further
                        assessment or site inspection.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold">
                      4
                    </span>

                    <div>
                      <h3 className="font-bold">Quotation</h3>

                      <p className="mt-1 text-sm leading-6 text-white/65">
                        A quotation can then be prepared based on the project
                        requirements and assessment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white p-7 sm:p-8">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  Prefer To Talk?
                </p>

                <h3 className="mt-3 text-xl font-bold text-slate-900">
                  Contact our team directly.
                </h3>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <a
                    href="tel:+2347032502618"
                    className="block transition-colors hover:text-primary"
                  >
                    07032502618
                  </a>

                  <a
                    href="tel:+2349017596886"
                    className="block transition-colors hover:text-primary"
                  >
                    09017596886
                  </a>

                  <a
                    href="https://wa.me/2348146967924"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-colors hover:text-primary"
                  >
                    WhatsApp: 08146967924
                  </a>

                  <a
                    href="mailto:gilgallandconstructionlimited@gmail.com"
                    className="block break-words transition-colors hover:text-primary"
                  >
                    gilgallandconstructionlimited@gmail.com
                  </a>
                </div>

                <Link
                  href="/contact"
                  className="mt-6 inline-flex text-sm font-bold text-primary hover:text-primary-dark"
                >
                  View Contact Page →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}