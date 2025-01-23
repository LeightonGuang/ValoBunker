"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Form,
  User,
  Input,
  Avatar,
  Button,
  Select,
  CardBody,
  Selection,
  DatePicker,
  SelectItem,
} from "@nextui-org/react";
import { useParams } from "next/navigation";
import { parseDate } from "@internationalized/date";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { RolesTableType } from "@/types/RolesTableType";
import { TeamsTableType } from "@/types/TeamsTableType";
import { PlayersTableType } from "@/types/PlayersTableType";

const PlayerEditPage = () => {
  const playerId = useParams().id;
  const [isLoading, setIsLoading] = useState(false);
  const [playerForm, setPlayerForm] = useState<PlayersTableType>();
  const [teams, setTeams] = useState<TeamsTableType[]>();
  const [rolesData, setRolesData] = useState<RolesTableType[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<Selection>(new Set([]));

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: TeamsData, error: TeamsError } = await supabase
        .from("teams")
        .select("*")
        .order("name", { ascending: true });

      if (TeamsError) {
        console.error(TeamsError);
      } else {
        setTeams(TeamsData);
      }

      const { data: RolesData, error: RolesError } = await supabase
        .from("roles")
        .select("*")
        .order("name", { ascending: true });

      if (RolesError) {
        console.error(RolesError);
      } else {
        setRolesData(RolesData);
      }

      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select(`*, teams(*, vct_league(*))`)
        .eq("id", playerId)
        .single();

      if (playerError) {
        console.error(playerError);
      } else {
        setPlayerForm(playerData);
        setSelectedTeamId(new Set([playerData.team_id.toString()]));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerForm({
      ...playerForm,
      [e.target.name]: e.target.value,
    } as PlayersTableType);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="w-full">
      <h1 className={title()}>Edit Player</h1>

      <div className="mt-6 flex justify-center">
        {!isLoading && (
          <Card className="w-96">
            <CardBody>
              <Form>
                <div className="mb-4 flex w-full justify-center">
                  <Avatar
                    className="h-32 w-32 rounded-none"
                    src={playerForm?.profile_picture_url}
                  />
                </div>

                <Input
                  label="Profile Picture URL"
                  name="profile_picture_url"
                  placeholder="Profile Picture URL"
                  value={playerForm?.profile_picture_url}
                  onChange={onFormChange}
                />

                <Input
                  isRequired
                  label="IGN"
                  name="ign"
                  placeholder="IGN"
                  value={playerForm?.ign}
                  onChange={onFormChange}
                />

                <Input
                  isRequired
                  label="Name"
                  name="name"
                  placeholder="Name"
                  value={playerForm?.name}
                  onChange={onFormChange}
                />

                {teams && (
                  <Select
                    aria-label="Teams"
                    items={teams}
                    label="Team"
                    placeholder="Select a team"
                    renderValue={(items) => {
                      const selectedTeam = items[0];

                      return (
                        <User
                          avatarProps={{
                            src: selectedTeam.data?.logo_url,
                            className: "bg-transparent rounded-none p-2",
                          }}
                          name={selectedTeam.data?.name}
                        />
                      );
                    }}
                    selectedKeys={selectedTeamId}
                    selectionMode="single"
                    onSelectionChange={setSelectedTeamId}
                  >
                    {(team) => (
                      <SelectItem
                        key={team.id.toString()}
                        aria-label={team.name}
                        textValue={team.name}
                      >
                        <User
                          avatarProps={{
                            src: team.logo_url,
                            radius: "none",
                            size: "sm",
                            className: "bg-transparent",
                          }}
                          name={team.name}
                        />
                      </SelectItem>
                    )}
                  </Select>
                )}

                <Input
                  isRequired
                  label="Country"
                  name="country"
                  placeholder="Country"
                  value={playerForm?.country}
                  onChange={onFormChange}
                />

                <DatePicker
                  label="Birthday (DD-MM-YYYY)"
                  name="birthday"
                  selectorButtonPlacement="start"
                  value={
                    playerForm?.birthday ? parseDate(playerForm.birthday) : null
                  }
                  onChange={(date) =>
                    setPlayerForm({
                      ...playerForm,
                      birthday: date?.toString(),
                    } as PlayersTableType)
                  }
                />

                <Button color="primary" type="submit">
                  Update
                </Button>
              </Form>
            </CardBody>
          </Card>
        )}
      </div>
    </section>
  );
};

export default PlayerEditPage;
