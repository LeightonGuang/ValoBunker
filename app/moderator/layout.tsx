"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Listbox, ListboxItem } from "@nextui-org/listbox";

import { getSupabase } from "@/utils/supabase/client";

const menuList = [
  { name: "Agents", href: "/moderator/manage/agents" },
  { name: "Events", href: "/moderator/manage/events" },
  { name: "Patches", href: "/moderator/manage/patches" },
  { name: "Players", href: "/moderator/manage/players" },
  { name: "Teams", href: "/moderator/manage/teams" },
  { name: "Users", href: "/moderator/manage/users" },
];

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
        <div className="w-full">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="lg-w-1/4 w-48">
              <Listbox
                aria-label="Manage"
                className="max-w-[300px] gap-0 overflow-visible rounded-medium bg-content1 shadow-small dark:divide-default-100/80"
                onAction={(key) => router.push(menuList[key as number].href)}
              >
                {menuList.map((button, i) => (
                  <ListboxItem key={i} startContent={}>
                    {button.name}
                  </ListboxItem>
                ))}
              </Listbox>
            </div>
            <div>{children}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
