"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/serverSupabase";

export async function refreshDashboard() {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { success: true };
}

export async function getSession() {
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { authenticated: false, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return { 
    authenticated: true, 
    session,
    profile,
    isAdmin: profile?.role === "admin"
  };
}

export async function validateParentPin(pin: string): Promise<{ valid: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { valid: false, error: "Not authenticated" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("parent_pin")
    .eq("id", session.user.id)
    .single();

  if (!profile?.parent_pin) {
    return { valid: false, error: "No PIN set" };
  }

  if (pin !== profile.parent_pin) {
    return { valid: false, error: "Incorrect PIN" };
  }

  return { valid: true };
}