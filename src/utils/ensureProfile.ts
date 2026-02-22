import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Ensures a `profiles` row exists for the given user.
 * - If the row is missing, creates one with the best available name.
 * - If the row exists but has a placeholder name (email prefix), updates it
 *   when better metadata is available.
 */
export const ensureProfile = async (user: User) => {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("id", user.id)
    .maybeSingle();

  // Prefer 'name' (email signup) → 'full_name' (OAuth/Google) → email prefix → 'User'
  const bestName =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  if (!existing) {
    await supabase.from("profiles").insert({
      id: user.id,
      name: bestName,
      email: user.email || "",
    });
    return;
  }

  // If profile exists but name is a placeholder, update with real name if available
  const emailPrefix = user.email?.split("@")[0];
  const realName =
    user.user_metadata?.name || user.user_metadata?.full_name;

  if (
    realName &&
    (!existing.name ||
      existing.name === emailPrefix ||
      existing.name === "User")
  ) {
    await supabase
      .from("profiles")
      .update({ name: realName })
      .eq("id", user.id);
  }
};
