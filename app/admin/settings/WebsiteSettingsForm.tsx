"use client";

import { useState } from "react";

type WebsiteSettings = {
  id: string;
  company_name: string;
  slogan: string;
  company_description: string;
  address: string;
  primary_phone: string;
  secondary_phone: string;
  whatsapp: string;
  email: string;
  linkedin_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  website_title: string;
  seo_description: string;
  footer_text: string;
};

type WebsiteSettingsFormProps = {
  settings: WebsiteSettings;
};

export default function WebsiteSettingsForm({
  settings,
}: WebsiteSettingsFormProps) {
  const [formData, setFormData] = useState({
    company_name: settings.company_name,
    slogan: settings.slogan,
    company_description: settings.company_description,
    address: settings.address,
    primary_phone: settings.primary_phone,
    secondary_phone: settings.secondary_phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    linkedin_url: settings.linkedin_url ?? "",
    facebook_url: settings.facebook_url ?? "",
    instagram_url: settings.instagram_url ?? "",
    twitter_url: settings.twitter_url ?? "",
    youtube_url: settings.twitter_url ?? "",
    website_title: settings.website_title,
    seo_description: settings.seo_description,
    footer_text: settings.footer_text,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(
    field: keyof typeof formData,
    value: string,
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to save settings.");
        return;
      }

      setMessage("Website settings saved successfully.");
    } catch {
      setError("Something went wrong while saving settings.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setFormData({
      company_name: settings.company_name,
      slogan: settings.slogan,
      company_description: settings.company_description,
      address: settings.address,
      primary_phone: settings.primary_phone,
      secondary_phone: settings.secondary_phone,
      whatsapp: settings.whatsapp,
      email: settings.email,
      linkedin_url: settings.linkedin_url ?? "",
      facebook_url: settings.facebook_url ?? "",
      instagram_url: settings.instagram_url ?? "",
      twitter_url: settings.twitter_url ?? "",
      youtube_url: settings.youtube_url ?? "",
      website_title: settings.website_title,
      seo_description: settings.seo_description,
      footer_text: settings.footer_text,
    });

    setMessage("");
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Company Information */}
      <section>
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Company Information
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Company Details
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Manage the main company information used across the website.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Company Name"
            value={formData.company_name}
            onChange={(value) => handleChange("company_name", value)}
          />

          <Field
            label="Slogan"
            value={formData.slogan}
            onChange={(value) => handleChange("slogan", value)}
          />

          <TextArea
            label="Company Description"
            value={formData.company_description}
            onChange={(value) =>
              handleChange("company_description", value)
            }
            fullWidth
          />
        </div>
      </section>

      {/* Contact Information */}
      <section className="border-t border-slate-200 pt-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Contact Information
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Contact Details
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Manage the contact details displayed across the website.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Address"
            value={formData.address}
            onChange={(value) => handleChange("address", value)}
          />

          <Field
            label="Primary Phone"
            value={formData.primary_phone}
            onChange={(value) => handleChange("primary_phone", value)}
          />

          <Field
            label="Secondary Phone"
            value={formData.secondary_phone}
            onChange={(value) => handleChange("secondary_phone", value)}
          />

          <Field
            label="WhatsApp"
            value={formData.whatsapp}
            onChange={(value) => handleChange("whatsapp", value)}
          />

          <Field
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
          />
        </div>
      </section>

      {/* Social Media */}
      <section className="border-t border-slate-200 pt-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Social Media
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Social Links
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Add the company social media profiles you want displayed on the
            website.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="LinkedIn URL"
            value={formData.linkedin_url}
            onChange={(value) => handleChange("linkedin_url", value)}
            placeholder="https://www.linkedin.com/..."
          />

          <Field
            label="Facebook URL"
            value={formData.facebook_url}
            onChange={(value) => handleChange("facebook_url", value)}
            placeholder="https://www.facebook.com/..."
          />

          <Field
            label="Instagram URL"
            value={formData.instagram_url}
            onChange={(value) => handleChange("instagram_url", value)}
            placeholder="https://www.instagram.com/..."
          />

          <Field
            label="X / Twitter URL"
            value={formData.twitter_url}
            onChange={(value) => handleChange("twitter_url", value)}
            placeholder="https://x.com/..."
          />
        
          <Field
            label="Youtube URL"
            value={formData.youtube_url}
            onChange={(value) => handleChange("youtube_url", value)}
            placeholder="https://www.youtube.com/..."
          />

        </div>
      </section>

      {/* SEO and Website */}
      <section className="border-t border-slate-200 pt-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Website & SEO
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Website Settings
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Manage the website title, SEO description, and footer text.
          </p>
        </div>

        <div className="grid gap-6">
          <Field
            label="Website Title"
            value={formData.website_title}
            onChange={(value) => handleChange("website_title", value)}
          />

          <TextArea
            label="SEO Description"
            value={formData.seo_description}
            onChange={(value) =>
              handleChange("seo_description", value)
            }
          />

          <Field
            label="Footer Text"
            value={formData.footer_text}
            onChange={(value) => handleChange("footer_text", value)}
          />
        </div>
      </section>

      {/* Messages */}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleReset}
          disabled={isSaving}
          className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-900">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  fullWidth = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className="mb-2 block text-sm font-semibold text-slate-900">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </div>
  );
}