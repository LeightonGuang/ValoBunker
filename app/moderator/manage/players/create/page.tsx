"use client";

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
  CardHeader,
  SelectItem,
  Breadcrumbs,
  BreadcrumbItem,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { TeamsTableType } from "@/types/TeamsTableType";
import { PlayersTableType } from "@/types/PlayersTableType";

const CreatePlayerPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState<TeamsTableType[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [playerForm, setPlayerForm] = useState<PlayersTableType>(
    {} as PlayersTableType,
  );
  const [selectedTeamId, setSelectedTeamId] = useState<Selection>(new Set([]));
  const [selectedRole, setSelectedRole] = useState<Selection>(new Set([]));

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .order("name", {
          ascending: true,
        });

      if (teamError) {
        console.error(teamError);
      } else {
        setTeams(teamData);
      }

      const { data: rolesData, error: rolesError } = await supabase
        .from("roles")
        .select("*")
        .order("name", { ascending: true });

      if (rolesError) {
        console.error(rolesError);
      } else {
        setRoles(rolesData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedPlayerform = {
      ...playerForm,
      team_id: Array.from(selectedTeamId)[0],
      roles: roles,
    };

    try {
      const supabase = getSupabase();

      const { error } = await supabase
        .from("players")
        .insert([formattedPlayerform]);

      if (error) {
        console.error(error);
        alert("Failed to create player. Please try again.");

        return;
      } else {
        router.push("/moderator/manage/players");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="w-full">
      <Breadcrumbs>
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem href="/moderator/manage/Player">Players</BreadcrumbItem>
        <BreadcrumbItem>Create</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex justify-center">
        <Card className="w-96">
          <CardHeader className={title()}>Create player</CardHeader>
          <CardBody>
            {!isLoading && (
              <Form onSubmit={handleSubmit}>
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
                    new Date()
                    // playerForm?.birthday ? parseDate(playerForm.birthday) : null
                  }
                  onChange={(date) =>
                    setPlayerForm({
                      ...playerForm,
                      birthday: date?.toString(),
                    } as PlayersTableType)
                  }
                />

                <Button color="primary" type="submit">
                  Create
                </Button>
              </Form>
            )}
          </CardBody>
        </Card>
      </div>
    </section>
  );
};

export default CreatePlayerPage;
