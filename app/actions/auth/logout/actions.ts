"use server";

import { getSupabaseServer } from "@/utils/supabase/server";

export const logOut = async (): Promise<{ error: any }> => {
  try {
    const supabaseServer = getSupabaseServer();

    const { error } = await supabaseServer.auth.signOut();

    if (error) {
      console.error(error);

      return { error: error.message };
    }
  } catch (error) {
    console.error(error);

    return { error: "Unexpected error" };
  }

  return { error: null };
};
