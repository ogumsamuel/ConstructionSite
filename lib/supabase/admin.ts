import { createAuthServerClient } from "@/lib/supabase/auth-server";

export async function isAdmin(): Promise<boolean> {
  const supabase = await createAuthServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: role, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (error) {
    console.error("Admin role check error:", error);
    return false;
  }

  return role?.role === "admin";
}