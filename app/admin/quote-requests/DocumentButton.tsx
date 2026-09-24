"use client";

import { useState } from "react";

type DocumentButtonProps = {
  documentPath: string;
  documentName: string;
};

export default function DocumentButton({
  documentPath,
  documentName,
}: DocumentButtonProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState("");

  async function handleOpenDocument() {
    setIsOpening(true);
    setError("");

    try {
      const encodedPath = documentPath
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");

      const response = await fetch(
        `/api/admin/quote-documents/${encodedPath}`,
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.url) {
        throw new Error(
          result.message || "Unable to open the project document.",
        );
      }

      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Document access error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to open the project document.",
      );
    } finally {
      setIsOpening(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleOpenDocument}
        disabled={isOpening}
        className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span aria-hidden="true">📎</span>
        {isOpening ? "Opening..." : "View Project Document"}
      </button>

      <p className="text-xs text-slate-500">{documentName}</p>

      {error && (
        <p className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}