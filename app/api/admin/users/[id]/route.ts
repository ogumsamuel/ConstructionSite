import { NextResponse } from "next/server";

import { createAuthServerClient } from "@/lib/supabase/auth-server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    // 1. Verify that the current user is an authenticated administrator.
    const authorized = await isAdmin();

    if (!authorized) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 },
      );
    }

    // 2. Get the currently logged-in user.
    const authSupabase = await createAuthServerClient();

    const {
      data: { user: currentUser },
    } = await authSupabase.auth.getUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 },
      );
    }

    // 3. Get the administrator being removed.
    const { id: targetUserId } = await context.params;

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Administrator ID is required." },
        { status: 400 },
      );
    }

    // 4. Prevent an administrator from removing themselves.
    if (targetUserId === currentUser.id) {
      return NextResponse.json(
        {
          error:
            "You cannot remove your own administrator account.",
        },
        { status: 400 },
      );
    }

    // 5. Confirm that the target user is currently an administrator.
    const { data: targetRole, error: targetRoleError } =
      await supabaseAdmin
        .from("user_roles")
        .select("id, user_id, role")
        .eq("user_id", targetUserId)
        .eq("role", "admin")
        .maybeSingle();

    if (targetRoleError) {
      console.error(
        "Target administrator lookup error:",
        targetRoleError,
      );

      return NextResponse.json(
        { error: "Failed to verify the administrator." },
        { status: 500 },
      );
    }

    if (!targetRole) {
      return NextResponse.json(
        { error: "This user is not an administrator." },
        { status: 404 },
      );
    }

    // 6. Count the remaining administrators.
    const { count, error: countError } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");

    if (countError) {
      console.error(
        "Administrator count error:",
        countError,
      );

      return NextResponse.json(
        { error: "Failed to verify administrator count." },
        { status: 500 },
      );
    }

    // 7. Never allow the final administrator to be removed.
    if ((count ?? 0) <= 1) {
      return NextResponse.json(
        {
          error:
            "The last remaining administrator cannot be removed. Add another administrator first.",
        },
        { status: 400 },
      );
    }

    // 8. Remove only the authorization record.
    //    This does NOT delete the user's Supabase Auth account.
    const { error: deleteError } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", targetUserId)
      .eq("role", "admin");

    if (deleteError) {
      console.error(
        "Administrator deletion error:",
        deleteError,
      );

      return NextResponse.json(
        { error: "Failed to remove administrator." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Administrator removed successfully.",
    });
  } catch (error) {
    console.error("Remove administrator API error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}