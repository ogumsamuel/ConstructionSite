"use client";

import { useState } from "react";

type QuoteRequestDeleteButtonProps = {
  requestId: string;
  customerName: string;
  hasDocument: boolean;
};

export default function QuoteRequestDeleteButton({
  requestId,
  customerName,
  hasDocument,
}: QuoteRequestDeleteButtonProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const documentMessage = hasDocument
      ? "\n\nThe attached project document will also be permanently deleted."
      : "";

    const confirmed = window.confirm(
      `Are you sure you want to delete the quote request from "${customerName}"?${documentMessage}\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/quote-requests/${requestId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to delete quote request.",
        );
      }

      window.location.reload();
    } catch (error) {
      console.error(
        "Quote request deletion error:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete quote request.",
      );

      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete Request"}
    </button>
  );
}