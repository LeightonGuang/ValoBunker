"use client";

import { Key } from "@react-types/shared";
import { useRouter } from "next/navigation";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import React, { useEffect, useState, useCallback } from "react";

import {
  NewsIcon,
  TeamIcon,
  UserIcon,
  AgentIcon,
  PatchIcon,
  PlayerIcon,
  CalendarIcon,
} from "@/components/moderatorPageIcons";
import { getSupabase } from "@/utils/supabase/client";
import { IconWrapper } from "@/components/IconWrapper";

const menuList = [
  {
    name: "Agents",
    key: "agents",
    href: "/moderator/manage/agents",
    icon: <AgentIcon />,
    iconClassName: "bg-default/50 text-foreground",
  },
  {
    name: "Events",
    key: "events",
    href: "/moderator/manage/events",
    icon: <CalendarIcon />,
    iconClassName: "bg-default/50 text-foreground",
  },
  {
    name: "News",
    key: "news",
    href: "/moderator/manage/news",
    icon: <NewsIcon />,
    iconClassName: "bg-default/50 text-foreground",
  },
  {
    name: "Patches",
    key: "patches",
    href: "/moderator/manage/patches",
    icon: <PatchIcon />,
    iconClassName: "bg-default/50 text-foreground",
  },
  {
    name: "Players",
    key: "players",
    href: "/moderator/manage/players",
    icon: <PlayerIcon />,
    iconClassName: "bg-default/50 text-foreground",
  },
  {
    name: "Teams",
    key: "teams",
    href: "/moderator/manage/teams",
    icon: <TeamIcon />,
    iconClassName: "bg-default/50 text-foreground",
  },
  {
    name: "Users",
    key: "users",
    href: "/moderator/manage/users",
    icon: <UserIcon />,
    iconClassName: "bg-warning/10 text-warning",
  },
];

export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = getSupabase();

  const [isLoading, setIsLoading] = useState(true);
  const [hasRole, setHasRole] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<
    "all" | Iterable<Key> | undefined
  >(["agents"]);

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
            <div className="flex w-full items-center lg:h-[80dvh] lg:w-48">
              <Listbox
                disallowEmptySelection
                aria-label="Manage"
                className="gap-0 overflow-visible rounded-medium bg-content1 shadow-small dark:divide-default-100/80"
                selectedKeys={selectedKeys}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  setSelectedKeys(keys);

                  const selectedKey = Array.from(keys)[0] as string;
                  const selectedItem = menuList.find(
                    (item) => item.key === selectedKey,
                  );

                  if (selectedItem) {
                    router.push(selectedItem.href);
                  }
                }}
              >
                {menuList.map((button) => (
                  <ListboxItem
                    key={button.key}
                    startContent={
                      <IconWrapper className={button.iconClassName}>
                        {button.icon}
                      </IconWrapper>
                    }
                  >
                    {button.name}
                  </ListboxItem>
                ))}
              </Listbox>
            </div>
            <div className="lg:flex lg:h-[calc(100dvh-7rem)] lg:w-full lg:justify-center lg:overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
