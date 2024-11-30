"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

import { getSupabase } from "@/utils/supabase/client";

export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = getSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [hasRole, setHasRole] = useState(false);

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error(error);
    }

    if (!data.session?.user) {
      setUser(null);

      return;
    }

    setUser(data.session?.user);
  };

  const fetchUserRole = async () => {
    if (!user) {
      setIsLoading(false);

      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select(`*`)
      .eq("user_uid", user.id);

    if (error) {
      console.error(error);
    }

    if (data) {
      console.log(data);
      if (data[0].role === "admin" || data[0].role === "moderator") {
        setHasRole(true);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  useEffect(() => {
    console.log("isLoading, hasRole", isLoading, hasRole);
    if (!isLoading && !hasRole) {
      router.push("/");
    }
  }, [isLoading, hasRole]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {!isLoading && hasRole ? (
        <div className="w-full">{children}</div>
      ) : !isLoading && !hasRole ? (
        <div>Redirecting...</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
