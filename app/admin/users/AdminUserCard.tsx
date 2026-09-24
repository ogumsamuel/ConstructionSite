"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AdminUserCardProps = {
  id: number;
  userId: string;
  email: string;
  role: string;
  createdAt: string;
  currentUserId: string;
};

export default function AdminUserCard({
  id,
  userId,
  email,
  role,
  createdAt,
  currentUserId,
}: AdminUserCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const isCurrentUser = userId === currentUserId;

  async function handleDelete() {
    if (isCurrentUser) {
      setError("You cannot remove your own administrator account.");
      return;
    }

    const confirmed = window.confirm(
      `Remove ${email} from the dashboard administrators?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to remove administrator.");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to remove administrator.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="px-5 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="break-all text-sm font-bold text-slate-900">
              {email}
            </p>

            {isCurrentUser && (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                You
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="capitalize">{role}</span>

            <span>
              Added{" "}
              {new Date(createdAt).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {error && (
            <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isCurrentUser}
          className="shrink-0 rounded-md border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? "Removing..." : "Remove"}
        </button>
      </div>
    </div>
  );
}