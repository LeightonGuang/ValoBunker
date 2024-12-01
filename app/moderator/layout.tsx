"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import { getSupabase } from "@/utils/supabase/client";

export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = getSupabase();

  const [hasRole, setHasRole] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserAndRole = useCallback(async () => {
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        setIsLoading(false);

        return;
      }

      const user = sessionData.session?.user;

      if (!user) {
        router.push("/");

        return;
      }

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_uid", user.id);

      if (roleError) {
        console.error("Error fetching roles:", roleError);
        setIsLoading(false);

        return;
      }

      if (
        roleData?.length &&
        (roleData[0].role === "admin" || roleData[0].role === "moderator")
      ) {
        setHasRole(true);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    fetchUserAndRole();
  }, [fetchUserAndRole]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {isLoading ? (
        <div>Loading...</div>
      ) : hasRole ? (
        <div className="w-full">{children}</div>
      ) : null}
    </div>
  );
}
