"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SafetyContent = {
  id: string;
  hero_label: string;
  hero_title: string;
  hero_description: string;

  commitment_label: string;
  commitment_title: string;
  commitment_description: string;
  commitment_description_secondary: string;

  highlight_title: string;
  highlight_description: string;

  approach_label: string;
  approach_title: string;
  approach_description: string;
};

type Props = {
  content: SafetyContent;
};

export default function SafetyContentForm({ content }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    hero_label: content.hero_label,
    hero_title: content.hero_title,
    hero_description: content.hero_description,

    commitment_label: content.commitment_label,
    commitment_title: content.commitment_title,
    commitment_description: content.commitment_description,
    commitment_description_secondary:
      content.commitment_description_secondary,

    highlight_title: content.highlight_title,
    highlight_description: content.highlight_description,

    approach_label: content.approach_label,
    approach_title: content.approach_title,
    approach_description: content.approach_description,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/safety/content", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update Safety content.",
        );
      }

      setSuccess("Safety content updated successfully.");

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update Safety content.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Hero */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">
            Hero Section
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Main introduction displayed at the top of the Safety page.
          </p>
        </div>

        <div className="space-y-5">
          <Field
            label="Label"
            value={form.hero_label}
            onChange={(value) =>
              updateField("hero_label", value)
            }
          />

          <Field
            label="Title"
            value={form.hero_title}
            onChange={(value) =>
              updateField("hero_title", value)
            }
          />

          <TextArea
            label="Description"
            value={form.hero_description}
            onChange={(value) =>
              updateField("hero_description", value)
            }
            rows={5}
          />
        </div>
      </section>

      {/* Commitment */}
      <section className="border-t border-slate-200 pt-10">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">
            Safety Commitment
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Content explaining GILGAL&apos;s commitment to safe
            construction practices.
          </p>
        </div>

        <div className="space-y-5">
          <Field
            label="Label"
            value={form.commitment_label}
            onChange={(value) =>
              updateField("commitment_label", value)
            }
          />

          <Field
            label="Title"
            value={form.commitment_title}
            onChange={(value) =>
              updateField("commitment_title", value)
            }
          />

          <TextArea
            label="Description"
            value={form.commitment_description}
            onChange={(value) =>
              updateField("commitment_description", value)
            }
            rows={6}
          />

          <TextArea
            label="Secondary Description"
            value={form.commitment_description_secondary}
            onChange={(value) =>
              updateField(
                "commitment_description_secondary",
                value,
              )
            }
            rows={6}
          />
        </div>
      </section>

      {/* Highlight */}
      <section className="border-t border-slate-200 pt-10">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">
            Safety Highlight
          </h2>
        </div>

        <div className="space-y-5">
          <Field
            label="Title"
            value={form.highlight_title}
            onChange={(value) =>
              updateField("highlight_title", value)
            }
          />

          <TextArea
            label="Description"
            value={form.highlight_description}
            onChange={(value) =>
              updateField("highlight_description", value)
            }
            rows={5}
          />
        </div>
      </section>

      {/* Approach */}
      <section className="border-t border-slate-200 pt-10">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">
            Safety Approach
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Introduction for the Safety Principles section.
          </p>
        </div>

        <div className="space-y-5">
          <Field
            label="Label"
            value={form.approach_label}
            onChange={(value) =>
              updateField("approach_label", value)
            }
          />

          <Field
            label="Title"
            value={form.approach_title}
            onChange={(value) =>
              updateField("approach_title", value)
            }
          />

          <TextArea
            label="Description"
            value={form.approach_description}
            onChange={(value) =>
              updateField("approach_description", value)
            }
            rows={6}
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Safety Content"}
        </button>

        <button
          type="button"
          onClick={() => router.refresh()}
          className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function Field({
  label,
  value,
  onChange,
}: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

type TextAreaProps = FieldProps & {
  rows?: number;
};

function TextArea({
  label,
  value,
  onChange,
  rows = 5,
}: TextAreaProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        rows={rows}
        className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}