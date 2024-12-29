"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Chip,
  Form,
  User,
  Input,
  Avatar,
  Button,
  Select,
  CardBody,
  DateInput,
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
  const [player, setPlayer] = useState<PlayersTableType>();
  const [playerForm, setPlayerForm] = useState<PlayersTableType>();
  const [teams, setTeams] = useState<TeamsTableType[]>();
  const [rolesData, setRolesData] = useState<RolesTableType[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Selection>(new Set([]));

  const fetchData = async () => {
    try {
      const supabase = getSupabase();
      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select(`*, teams(*, vct_league(*))`)
        .eq("id", playerId);

      if (playerError) {
        console.error(playerError);
      } else {
        console.log(playerData[0]);
        setPlayer(playerData[0]);
        setPlayerForm(playerData[0]);
        setSelectedTeam(new Set([playerData[0].team_id]));
      }

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
        console.log(RolesData);
        setRolesData(RolesData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setPlayer({
      ...player,
      [e.target.name]: e.target.value,
    } as PlayersTableType);
  };

  const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setPlayerForm({
      ...playerForm,
      [e.target.name]: e.target.value,
    } as PlayersTableType);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("player form:", playerForm);
  }, [playerForm]);

  useEffect(() => {
    console.log(rolesData);
  }, [rolesData]);

  useEffect(() => {
    console.log("selected team:", selectedTeam);
  }, [selectedTeam]);

  useEffect(() => {
    console.log("teams:", teams);
  }, [teams]);

  return (
    <section className="w-full">
      <div>
        <h1 className={title()}>Edit Player</h1>

        <Card className="mt-6">
          {!isLoading && (
            <CardBody>
              <Form>
                <Avatar size="lg" src={playerForm?.profile_picture_url} />
                <Input
                  name="profile_picture_url"
                  placeholder="Profile Picture URL"
                  value={playerForm?.profile_picture_url}
                  onChange={onFormChange}
                />

                <Input
                  name="ign"
                  placeholder="IGN"
                  value={playerForm?.ign}
                  onChange={onFormChange}
                />

                <Input
                  name="name"
                  placeholder="Name"
                  value={playerForm?.name}
                  onChange={onFormChange}
                />

                <Input
                  name="country"
                  placeholder="Country"
                  value={playerForm?.country}
                  onChange={onFormChange}
                />

                <DatePicker
                  label="Birthday (DD-MM-YYYY)"
                  name="birthday"
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

                {teams && (
                  <Select
                    aria-label="Teams"
                    placeholder="Select a team"
                    selectedKeys={selectedTeam}
                    onSelectionChange={setSelectedTeam}
                  >
                    {teams?.map((team) => (
                      <SelectItem
                        key={team.id}
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
                    ))}
                  </Select>
                )}

                <Button color="primary" type="submit">
                  Update
                </Button>
              </Form>
            </CardBody>
          )}
        </Card>
      </div>
    </section>
  );
};

export default PlayerEditPage;
