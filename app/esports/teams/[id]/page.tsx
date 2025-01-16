"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  User,
  Image,
  Divider,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
} from "@nextui-org/react";

import { getSupabase } from "@/utils/supabase/client";
import { TeamsTableType } from "@/types/TeamsTableType";

const TeamPage = () => {
  const teamId = useParams().id;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState<TeamsTableType>();

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("*, vct_league(*), players(*)")
        .eq("id", teamId)
        .single();

      if (teamError) {
        console.error(teamError);
      } else {
        setTeam(teamData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="flex w-full flex-col items-center">
      <Card className="max-w-5xl p-2">
        <CardHeader>
          <div className="flex w-full flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
              <Image
                alt={team?.name}
                className="aspect-square h-24 w-24 rounded-none"
                src={team?.logo_url}
              />

              <div>
                <h1 className="text-3xl font-bold">{team?.name}</h1>
                <span className="mt-2 text-default-400">
                  Country: {team?.country}
                </span>
              </div>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold">Coach:</span>
                  {team?.coaches ? team?.coaches?.[0].ign : "N/A"}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold">League:</span>

                  <div className="flex items-center gap-1">
                    <Image
                      alt={team?.vct_league.name}
                      className="h-4 w-4 rounded-none"
                      src={team?.vct_league.logo_url}
                    />
                    <span>{team?.vct_league.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <Divider />

        <CardBody>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {team?.players.map((player) => (
              <Card
                key={player.id}
                isBlurred
                isPressable
                className="bg-background/60"
                onPress={() => router.push(`/esports/players/${player.id}`)}
              >
                <CardBody>
                  <Avatar
                    className="bg-transparent h-32 w-32 rounded-none"
                    src={player.profile_picture_url}
                  />
                </CardBody>

                <CardFooter>
                  <span className="text-medium font-semibold">
                    {player.ign}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </ul>
        </CardBody>
      </Card>
    </section>
  );
};

export default TeamPage;
