"use client";

import {
  Accordion,
  AccordionItem,
  Divider,
  Image,
  Tab,
  Tabs,
  User,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { TeamsTableType } from "@/types/TeamsTableType";

const regionTabs: { region: string; region_icon_url: string }[] = [
  {
    region: "All",
    region_icon_url: "https://cdn3.emoji.gg/emojis/7053-vct-red-logo.png",
  },
  {
    region: "Americas",
    region_icon_url: "https://owcdn.net/img/640f5ab71dfbb.png",
  },
  {
    region: "China",
    region_icon_url: "https://owcdn.net/img/65dd97cea9a25.png",
  },
  {
    region: "EMEA",
    region_icon_url: "https://owcdn.net/img/65ab54a77831c.png",
  },
  {
    region: "Pacific",
    region_icon_url: "https://owcdn.net/img/640f5ae002674.png",
  },
];

const TeamsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [regionTab, setRegionTab] = useState("All");
  const [teamsDataList, setTeamsDataList] = useState<TeamsTableType[]>([]);

  const getAllTeams = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("teams")
        .select(`*, players(*), coaches(*)`)
        .order("name", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setTeamsDataList(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTeamList = useMemo(() => {
    return [...teamsDataList].filter((team) => {
      if (regionTab === "All") return true;

      return team.vct_league === regionTab;
    });
  }, [regionTab, teamsDataList]);

  useEffect(() => {
    getAllTeams();
  }, []);

  return (
    <section>
      <div>
        <h1 className={title()}>Teams</h1>
      </div>
      <div>
        <Tabs
          className="mt-4 flex justify-center"
          classNames={{ tabList: "gap-0 lg:gap-2", tab: "max-w-fit h-max" }}
          onSelectionChange={(key) => {
            setRegionTab(String(key));
          }}
        >
          {regionTabs.map((tab, i) => (
            <Tab
              key={regionTabs[i].region}
              title={
                <div className="flex flex-col items-center gap-2 lg:flex-row">
                  <Image
                    alt={tab.region}
                    className="h-4 w-4"
                    height={16}
                    src={tab.region_icon_url}
                    width={16}
                  />
                  {tab.region}
                </div>
              }
            >
              <Accordion
                className="mt-4 flex flex-col gap-4"
                showDivider={false}
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
                    <div>
                      <h2>Players</h2>
                      <ul className="mt-4 flex flex-col gap-4 lg:flex-row lg:flex-wrap">
                        {[...teamObj.players]
                          .sort((a, b) =>
                            a.role === "IGL" ? -1 : b.role === "IGL" ? 1 : 0,
                          )
                          .map((player) => (
                            <li key={player.id}>
                              <User
                                avatarProps={{
                                  src: player.profile_picture_url,
                                  isBordered: player.role === "IGL",
                                  color:
                                    player.role === "IGL"
                                      ? "primary"
                                      : "default",
                                  classNames: {
                                    base: "bg-white",
                                  },
                                }}
                                className="lg:p-2"
                                description={
                                  <div className="flex flex-col">
                                    <span className="whitespace-nowrap">
                                      {player.name}
                                    </span>
                                    <span>{player.role}</span>
                                  </div>
                                }
                                name={player.ign}
                              />
                            </li>
                          ))}
                      </ul>
                      <Divider className="my-4" />
                      <h2>Coach</h2>
                      <div className="mt-4">
                        {teamObj.coaches.length === 0 ? (
                          <User name="N/A" />
                        ) : (
                          <User name={teamObj.coaches[0].name} />
                        )}
                      </div>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </Tab>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default TeamsPage;
