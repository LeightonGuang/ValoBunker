"use server";

import { headers } from "next/headers";

import { getSupabaseServer } from "@/utils/supabase/server";

export const logIn = async (
  email: string,
  password: string,
): Promise<{ data: any; error: any }> => {
  try {
    const supabaseServer = getSupabaseServer();
    const origin = headers().get("origin");

    const { data, error } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
      options: {
        redirectTo: `${origin}/`,
      } as any,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error(error);
  }

  return { data: null, error: "Unexpected error" };
};
