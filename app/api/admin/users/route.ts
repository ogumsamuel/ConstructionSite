import { NextResponse } from "next/server";

import { createAuthServerClient } from "@/lib/supabase/auth-server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    // 1. Verify that the current user is an administrator.
    const authorized = await isAdmin();

    if (!authorized) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 },
      );
    }

    // 2. Verify that the current session exists.
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

    // 3. Read the submitted email.
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!email) {
      return NextResponse.json(
        { error: "Administrator email is required." },
        { status: 400 },
      );
    }

    // Basic email format validation.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    // 4. Find the Supabase Auth account.
    const {
      data: { users },
      error: usersError,
    } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (usersError) {
      console.error("Auth users lookup error:", usersError);

      return NextResponse.json(
        { error: "Failed to find the user account." },
        { status: 500 },
      );
    }

    const targetUser = users.find(
      (user) => user.email?.toLowerCase() === email,
    );

    if (!targetUser) {
      return NextResponse.json(
        {
          error:
            "No Supabase Auth account was found with this email. The user must create an account first.",
        },
        { status: 404 },
      );
    }

    // 5. Check whether the user is already an administrator.
    const { data: existingRole, error: existingRoleError } =
      await supabaseAdmin
        .from("user_roles")
        .select("id")
        .eq("user_id", targetUser.id)
        .eq("role", "admin")
        .maybeSingle();

    if (existingRoleError) {
      console.error(
        "Existing administrator lookup error:",
        existingRoleError,
      );

      return NextResponse.json(
        { error: "Failed to verify administrator status." },
        { status: 500 },
      );
    }

    if (existingRole) {
      return NextResponse.json(
        { error: "This user is already an administrator." },
        { status: 409 },
      );
    }

    // 6. Authorize the user as an administrator.
    const { error: insertError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: targetUser.id,
        role: "admin",
      });

    if (insertError) {
      console.error(
        "Administrator creation error:",
        insertError,
      );

      return NextResponse.json(
        { error: "Failed to add administrator." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `${email} has been added as an administrator.`,
    });
  } catch (error) {
    console.error("Add administrator API error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}