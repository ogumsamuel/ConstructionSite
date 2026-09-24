import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/supabase/admin";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}