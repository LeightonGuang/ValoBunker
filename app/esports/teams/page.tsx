"use client";

import {
  Tab,
  Card,
  Chip,
  Tabs,
  Image,
  CardBody,
  Accordion,
  Selection,
  CardFooter,
  AccordionItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { TeamsTableType } from "@/types/TeamsTableType";
import { RolesTableType } from "@/types/RolesTableType";

const regionTabs: { name: string; region_icon_url: string }[] = [
  {
    name: "All",
    region_icon_url: "https://cdn3.emoji.gg/emojis/7053-vct-red-logo.png",
  },
  {
    name: "Americas",
    region_icon_url: "https://owcdn.net/img/640f5ab71dfbb.png",
  },
  {
    name: "China",
    region_icon_url: "https://owcdn.net/img/65dd97cea9a25.png",
  },
  {
    name: "EMEA",
    region_icon_url: "https://owcdn.net/img/65ab54a77831c.png",
  },
  {
    name: "Pacific",
    region_icon_url: "https://owcdn.net/img/640f5ae002674.png",
  },
];

const TeamsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegionTab, setSelectedRegionTab] = useState("All");
  const [teamsDataList, setTeamsDataList] = useState<TeamsTableType[]>([]);
  const [rolesDataList, setRolesDataList] = useState<RolesTableType[]>([]);
  const [filteredTeamList, setFilteredTeamList] = useState<TeamsTableType[]>(
    [],
  );
  const [selectedTeam, setSelectedTeam] = useState<Selection>(new Set(["1"]));

  const fetchData = async () => {
    try {
      const supabase = getSupabase();
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select(`*, players(*), coaches(*), vct_league(*)`)
        .order("name", { ascending: true });

      if (teamsError) {
        console.error(teamsError);
      } else {
        setTeamsDataList(teamsData);
      }

      const { data: rolesData, error: rolesError } = await supabase
        .from("roles")
        .select("*");

      if (rolesError) {
        console.error(rolesError);
      } else {
        setRolesDataList(rolesData);
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

  useEffect(() => {
    const teams = [...teamsDataList].filter((team) => {
      if (selectedRegionTab === "All") return true;

      return team.vct_league.name === selectedRegionTab;
    });

    setFilteredTeamList(teams);
  }, [selectedRegionTab, teamsDataList]);

  useEffect(() => {
    setSelectedTeam(new Set([String(filteredTeamList[0]?.id)]));
  }, [filteredTeamList]);

  return (
    <section>
      <div>
        <h1 className={title()}>Teams</h1>
      </div>
      <div>
        {!isLoading && (
          <Tabs
            className="mt-4 flex justify-center"
            classNames={{ tabList: "gap-0 lg:gap-2", tab: "max-w-fit h-max" }}
            items={regionTabs}
            selectedKey={selectedRegionTab}
            onSelectionChange={(key) => {
              setSelectedRegionTab(String(key));
            }}
          >
            {regionTabs.map((region) => (
              <Tab
                key={region.name}
                title={
                  <div className="flex flex-col items-center gap-2 lg:flex-row">
                    <Image
                      alt={region.name}
                      className="h-4 w-4"
                      height={16}
                      src={region.region_icon_url}
                      width={16}
                    />
                    {region.name}
                  </div>
                }
              >
                <Accordion
                  key={selectedRegionTab}
                  className="mt-4 flex flex-col gap-4 p-0"
                  selectedKeys={selectedTeam}
                  selectionMode="multiple"
                  showDivider={false}
                  onSelectionChange={(key) => {
                    setSelectedTeam(key);
                  }}
                >
                  {filteredTeamList.map((teamObj) => (
                    <AccordionItem
                      key={teamObj.id}
                      aria-label={teamObj.name}
                      startContent={
                        <Image
                          classNames={{ img: "rounded-none" }}
                          height={48}
                          src={teamObj.logo_url}
                          width={48}
                        />
                      }
                      title={teamObj.name}
                      variant="splitted"
                    >
                      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                        {[...teamObj.players]
                          .sort((a, b) =>
                            a.roles[0] === "IGL"
                              ? -1
                              : b.roles[0] === "IGL"
                                ? 1
                                : 0,
                          )
                          .map((player) => (
                            <li key={player.id}>
                              <Card
                                isPressable
                                className="cursor-pointer"
                                onPress={() =>
                                  router.push(`/esports/players/${player.id}`)
                                }
                              >
                                <CardBody className="flex justify-center">
                                  <Image
                                    className="aspect-square h-full w-full bg-white object-cover object-top"
                                    src={
                                      player.profile_picture_url
                                        ? player.profile_picture_url
                                        : "https://placehold.co/500x500"
                                    }
                                  />
                                </CardBody>
                                <CardFooter className="flex text-large">
                                  <div className="flex w-full flex-col">
                                    <span className="text-left">
                                      {player.ign}
                                    </span>

                                    <div className="mt-2 w-full">
                                      <span className="flex text-small text-default-400">
                                        {player.roles.length === 1
                                          ? "Role:"
                                          : "Roles:"}
                                      </span>

                                      <ul className="flex w-full flex-wrap gap-x-2">
                                        {player.roles.map((roleId) => {
                                          return (
                                            <li key={roleId}>
                                              <Chip
                                                color={
                                                  roleId === "1"
                                                    ? "success"
                                                    : roleId === "2"
                                                      ? "danger"
                                                      : roleId === "3"
                                                        ? "warning"
                                                        : roleId === "4"
                                                          ? "secondary"
                                                          : roleId === "IGL"
                                                            ? "primary"
                                                            : "default"
                                                }
                                                size="sm"
                                              >
                                                {roleId === "1" ||
                                                roleId === "2" ||
                                                roleId === "3" ||
                                                roleId === "4"
                                                  ? rolesDataList.filter(
                                                      (roleObj) =>
                                                        roleObj.id ===
                                                        Number(roleId),
                                                    )[0].name
                                                  : roleId}
                                              </Chip>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </div>
                                  </div>
                                </CardFooter>
                              </Card>
                            </li>
                          ))}
                      </ul>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Tab>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
};

export default TeamsPage;
