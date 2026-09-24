"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const dashboardItems = [
  {
    title: "Quote Requests",
    description: "View and manage customer quote requests.",
    href: "/admin/quote-requests",
  },
  {
    title: "Projects",
    description: "Manage construction projects and project media.",
    href: "/admin/projects",
  },
  {
    title: "Services",
    description: "Manage the services displayed on the website.",
    href: "/admin/services",
  },
  {
    title: "Safety",
    description: "Manage safety information and content.",
    href: "/admin/safety",
  },
  {
    title: "Our Team",
    description: "Manage company team members and profiles.",
    href: "/admin/team",
  },
  {
    title: "Website Settings",
    description: "Manage general website settings.",
    href: "/admin/settings",
  },
  {
    title: "Admin Users",
    description: "Manage authorized dashboard administrators.",
    href: "/admin/users",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    await supabase.auth.signOut();

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-12 w-20 shrink-0">
              <Image
                src="/images/company/Logo.jpeg"
                alt="GILGAL LAND CONSTRUCTION LIMITED logo"
                fill
                priority
                className="object-contain object-left"
                sizes="80px"
              />
            </div>

            <div>
              <p className="text-sm font-extrabold leading-tight text-slate-900 sm:text-base">
                GILGAL LAND CONSTRUCTION LIMITED
              </p>

              <p className="mt-1 text-xs font-semibold text-primary">
                Administration
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </header>

      {/* Dashboard */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Manage the GILGAL LAND CONSTRUCTION LIMITED website, customer
            requests, projects, services, team members, and other content.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="text-lg font-bold">→</span>
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                {item.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>

              <p className="mt-5 text-sm font-bold text-primary transition group-hover:translate-x-1">
                Open →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}