"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Chip,
  Card,
  Image,
  Avatar,
  Divider,
  CardBody,
} from "@nextui-org/react";

import { getSupabase } from "@/utils/supabase/client";
import { RolesTableType } from "@/types/RolesTableType";
import { PlayersTableType } from "@/types/PlayersTableType";

const PlayerPage = () => {
  const playerId = useParams().id;
  const [isLoading, setIsLoading] = useState(true);
  const [playerData, setPlayerData] = useState<PlayersTableType>();
  const [rolesData, setRolesData] = useState<RolesTableType[]>([]);

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select(`*, teams(*)`)
        .eq("id", playerId);

      if (playerError) {
        console.error(playerError);
      } else {
        setPlayerData(playerData[0]);
      }

      const { data: rolesData, error: rolesError } = await supabase
        .from("roles")
        .select("*");

      if (rolesError) {
        console.error(rolesError);
      } else {
        setRolesData(rolesData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertedAge = (date: string | Date) => {
    const birthday = new Date(date);
    const today = new Date();

    let age = today.getFullYear() - birthday.getFullYear();

    if (
      today.getMonth() < birthday.getMonth() ||
      today.getDate() < birthday.getDate()
    ) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="flex justify-center">
      {!isLoading && (
        <Card className="w-[32rem]">
          <CardBody>
            <div className="flex items-center gap-4">
              <Avatar
                className="bg-transparent h-32 min-h-32 w-32 min-w-32 rounded-none"
                src={playerData?.profile_picture_url}
              />

              <div className="flex w-full flex-col gap-2">
                <div className="flex flex-col">
                  <span className="text-2xl">{playerData?.ign}</span>
                  <span className="text-small text-default-400">
                    {playerData?.name}
                  </span>
                </div>

                <div className="flex justify-between text-small">
                  <span className="text-sm font-medium">Age:</span>
                  <span className="text-sm font-extralight">
                    {playerData?.birthday
                      ? convertedAge(playerData?.birthday)
                      : "-"}
                  </span>
                </div>

                <Divider />

                <div className="flex items-center justify-between text-small">
                  <span className="text-sm font-medium">Team:</span>
                  <div className="flex items-center gap-2 text-sm">
                    <Image
                      alt={playerData?.teams.name}
                      className="h-6 w-6 rounded-none"
                      src={playerData?.teams.logo_url}
                    />
                    <span>{playerData?.teams.name}</span>
                  </div>
                </div>

                <Divider />

                <div className="flex items-center justify-between text-small">
                  <span className="pr-2 text-sm font-medium">
                    {playerData?.roles.length === 1 ? "Role:" : "Roles:"}
                  </span>

                  <div className="flex gap-2">
                    {playerData?.roles.map((role) => {
                      if (
                        role === "1" ||
                        role === "2" ||
                        role === "3" ||
                        role === "4"
                      ) {
                        return (
                          <Chip
                            key={role}
                            color={
                              role === "1"
                                ? "success"
                                : role === "2"
                                  ? "danger"
                                  : role === "3"
                                    ? "warning"
                                    : role === "4"
                                      ? "secondary"
                                      : "default"
                            }
                            variant="flat"
                          >
                            {
                              rolesData.find((r) => r.id === parseInt(role))
                                ?.name
                            }
                          </Chip>
                        );
                      } else {
                        return (
                          <Chip
                            key={role}
                            color={role === "IGL" ? "primary" : "default"}
                            variant="flat"
                          >
                            {role}
                          </Chip>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </section>
  );
};

export default PlayerPage;
