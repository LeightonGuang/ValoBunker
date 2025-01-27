"use client";

import {
  Card,
  Form,
  Image,
  Input,
  Avatar,
  Button,
  Select,
  CardBody,
  Selection,
  CardHeader,
  SelectItem,
  User,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { TeamsTableType } from "@/types/TeamsTableType";
import { PlayersTableType } from "@/types/PlayersTableType";
import { VctLeaguesTableType } from "@/types/VctLeaguesTableType";

const EditTeamPage = () => {
  const router = useRouter();
  const teamId = useParams().id;
  const [isLoading, setIsLoading] = useState(true);
  const [leaguesData, setLeaguesData] = useState<VctLeaguesTableType[]>([]);
  const [teamData, setTeamData] = useState<TeamsTableType>(
    {} as TeamsTableType,
  );
  const [playersData, setPlayersData] = useState<PlayersTableType[]>([]);
  const [selectedVctLeague, setSelectedVctLeague] = useState<Selection>(
    new Set([]),
  );
  const [selectedPlayers, setSelectedPlayers] = useState<Selection>(
    new Set([]),
  );

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*, players(*), vct_league(*)")
        .eq("id", teamId)
        .single();

      if (teamsError) {
        console.error(teamsError);
      } else {
        setTeamData(teamsData);
      }

      const { data: leaguesData, error: leaguesError } = await supabase
        .from("vct_leagues")
        .select("*")
        .order("id", { ascending: true });

      if (leaguesError) {
        console.error(leaguesError);
      } else {
        setLeaguesData(leaguesData);
      }

      const { data: playersData, error: playersError } = await supabase
        .from("players")
        .select("*")
        .order("ign", { ascending: true });

      if (playersError) {
        console.error(playersError);
      } else {
        setPlayersData(playersData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onTeamFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setTeamData({ ...teamData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const originalSelectedPlayers = teamData.players.map(
      (player: PlayersTableType) => player.id,
    );

    const playersToDeselect = originalSelectedPlayers.filter(
      (id) => !Array.from(selectedPlayers).includes(id),
    );

    try {
      const supabase = getSupabase();

      const { error: teamsError } = await supabase
        .from("teams")
        .update({
          name: teamData.name,
          tag: teamData.tag,
          logo_url: teamData.logo_url,
          country: teamData.country,
          vct_league: Array.from(selectedVctLeague)[0],
        })
        .eq("id", teamId);

      if (teamsError) {
        console.error(teamsError);
      }

      const { error: playersError } = await supabase
        .from("players")
        .update({
          team_id: teamData.id,
        })
        .in("id", Array.from(selectedPlayers));

      if (playersError) {
        console.error(playersError);
      }
    } catch (error) {
      console.error(error);
    }

    if (playersToDeselect.length > 0) {
      try {
        const supabase = getSupabase();

        const { error: deselectPlayersError } = await supabase
          .from("players")
          .update({ team_id: null })
          .in("id", playersToDeselect);

        if (deselectPlayersError) {
          console.error(deselectPlayersError);
        } else {
          router.push("/moderator/manage/teams");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      router.push("/moderator/manage/teams");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (teamData.vct_league) {
      setSelectedVctLeague(new Set([teamData.vct_league.id]));
    }
  }, [teamData.vct_league]);

  useEffect(() => {
    if (teamData.players) {
      setSelectedPlayers(new Set(teamData.players.map((player) => player.id)));
    }
  }, [teamData.players]);

  return (
    <section>
      <div>
        {!isLoading && (
          <Card className="w-96">
            <CardHeader>
              <h1 className={title()}>Edit Team</h1>
            </CardHeader>
            <CardBody>
              <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
                <div className="flex w-full justify-center">
                  <Image
                    alt="Team Logo"
                    className="h-32 w-32 rounded-none object-contain"
                    src={
                      teamData.logo_url
                        ? teamData.logo_url
                        : "https://placehold.co/500"
                    }
                  />
                </div>

                <Input
                  label="Team Logo URL"
                  name="logo_url"
                  type="url"
                  value={teamData.logo_url}
                  onChange={onTeamFormChange}
                />

                <Input
                  isRequired
                  label="Team Name"
                  name="name"
                  type="text"
                  value={teamData.name}
                  onChange={onTeamFormChange}
                />

                <Input
                  isRequired
                  label="Tag"
                  name="tag"
                  type="text"
                  validate={(value) => {
                    if (value.length > 5) {
                      return "Tag must be less than 5 characters";
                    }
                  }}
                  value={teamData.tag}
                  onChange={onTeamFormChange}
                />

                {teamData.vct_league && leaguesData && (
                  <Select
                    aria-label="Select League"
                    isLoading={isLoading}
                    isMultiline={false}
                    items={leaguesData}
                    label="Select League"
                    name="league_id"
                    renderValue={(league) => league[0]?.data?.name}
                    selectedKeys={Array.from(selectedVctLeague).map(String)}
                    onSelectionChange={setSelectedVctLeague}
                  >
                    {(league) => (
                      <SelectItem
                        key={league.id}
                        startContent={
                          <Avatar
                            className="bg-transparent h-6 w-6 rounded-none"
                            src={league.logo_url}
                          />
                        }
                        textValue={league.name}
                      >
                        <span>{league.name}</span>
                      </SelectItem>
                    )}
                  </Select>
                )}

                <Input
                  isRequired
                  label="Country"
                  name="country"
                  type="text"
                  value={teamData.country}
                  onChange={onTeamFormChange}
                />

                {teamData.players && playersData && (
                  <Select
                    isMultiline
                    items={playersData}
                    label="Players"
                    renderValue={(players) => (
                      <div className="flex flex-wrap gap-2">
                        {players.map((player) => (
                          <User
                            key={player.data?.id}
                            avatarProps={{
                              src: player.data?.profile_picture_url,
                              className: "bg-transparent h-6 w-6 rounded-none",
                            }}
                            classNames={{ name: "text-small" }}
                            name={player.data?.ign}
                          />
                        ))}
                      </div>
                    )}
                    selectedKeys={Array.from(selectedPlayers)}
                    selectionMode="multiple"
                    onSelectionChange={setSelectedPlayers}
                  >
                    {(player) => {
                      return (
                        <SelectItem
                          startContent={
                            <Avatar
                              alt={player.ign}
                              className="bg-transparent h-6 w-6 rounded-none"
                              src={player.profile_picture_url}
                            />
                          }
                          textValue={String(player.id)}
                        >
                          {player.ign}
                        </SelectItem>
                      );
                    }}
                  </Select>
                )}

                <Button className="w-full" color="primary" type="submit">
                  Update Team
                </Button>
              </Form>
            </CardBody>
          </Card>
        )}
      </div>
    </section>
  );
};

export default EditTeamPage;
