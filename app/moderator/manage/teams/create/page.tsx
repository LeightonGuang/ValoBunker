"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Form,
  User,
  Image,
  Input,
  Button,
  Select,
  CardBody,
  Selection,
  CardHeader,
  SelectItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { VctLeaguesTableType } from "@/types/VctLeaguesTableType";

interface FormType {
  name: string;
  tag: string;
  logo_url: string;
  country: string;
}

const CreateTeamPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [leagues, setLeagues] = useState<VctLeaguesTableType[]>([]);
  const [teamForm, setTeamForm] = useState<FormType>({
    name: "",
    tag: "",
    logo_url: "",
    country: "",
  });
  const [selectedVctLeague, setSelectedVctLeague] = useState<Selection>(
    new Set([]),
  );

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: leaguesData, error: leaguesError } = await supabase
        .from("vct_leagues")
        .select("*")
        .order("id", { ascending: true });

      if (leaguesError) {
        console.error(leaguesError);
      } else {
        console.log(leaguesData);
        setLeagues(leaguesData);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onTeamFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setTeamForm({ ...teamForm, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.from("teams").insert([
        {
          name: teamForm.name,
          tag: teamForm.tag,
          logo_url: teamForm.logo_url,
          country: teamForm.country,
          vct_league: Array.from(selectedVctLeague)[0],
        },
      ]);

      if (error) {
        console.error(error);
      } else {
        router.push("/moderator/manage/teams");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="">
      <div className="mt-6 flex justify-center">
        {!isLoading && (
          <Card className="w-96">
            <CardHeader>
              <h1 className={title()}>Create Team</h1>
            </CardHeader>

            <CardBody>
              <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
                <div className="flex w-full justify-center">
                  <Image
                    alt="Team Logo"
                    className="h-32 w-32 rounded-none object-contain"
                    src={
                      teamForm.logo_url
                        ? teamForm.logo_url
                        : "https://placehold.co/500"
                    }
                  />
                </div>

                <Input
                  label="Team Logo URL"
                  name="logo_url"
                  type="url"
                  onChange={onTeamFormChange}
                />

                <Input
                  isRequired
                  label="Team Name"
                  name="name"
                  type="text"
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
                  onChange={onTeamFormChange}
                />

                <Select
                  aria-label="Select League"
                  isMultiline={false}
                  items={leagues}
                  label="Select League"
                  name="league_id"
                  renderValue={(league) => league[0]?.data?.name}
                  selectedKeys={selectedVctLeague}
                  onSelectionChange={setSelectedVctLeague}
                >
                  {(league) => (
                    <SelectItem key={league.id} textValue={league.name}>
                      <User
                        avatarProps={{
                          src: league.logo_url,
                          className: "bg-transparent rounded-none w-4 h-4",
                        }}
                        name={league.name}
                      />
                    </SelectItem>
                  )}
                </Select>

                <Input
                  isRequired
                  label="Country"
                  name="country"
                  type="text"
                  onChange={onTeamFormChange}
                />

                <Button className="w-full" color="primary" type="submit">
                  Create Team
                </Button>
              </Form>
            </CardBody>
          </Card>
        )}
      </div>
    </section>
  );
};

export default CreateTeamPage;
