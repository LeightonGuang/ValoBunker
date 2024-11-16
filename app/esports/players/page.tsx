"use client";

import { useEffect, useState, useMemo } from "react";
import { Image, Tab, Tabs, User } from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { SortDescriptor } from "@nextui-org/table";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { PlayersTableType } from "@/types/PlayersTableType";

const PlayersPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [regionTab, setRegionTab] = useState("All");
  const [playersList, setPlayersList] = useState<PlayersTableType[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "ign",
    direction: "ascending",
  });

  const getAllPlayers = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.from("players").select(`
        *,
        teams (
          *
        )
      `);

      if (error) {
        console.error(error);
      } else {
        setPlayersList(data);
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllPlayers();
  }, []);

  const sortedPlayers = useMemo(() => {
    return [...playersList]
      .filter((player) => {
        if (regionTab === "All") return true;

        return player.teams.vct_league === regionTab;
      })
      .sort((a, b) => {
        const getValue = (obj: any, path: string) => {
          return path.split(".").reduce((acc, key) => acc?.[key], obj);
        };

        const first = getValue(
          a,
          sortDescriptor.column as keyof PlayersTableType,
        );
        const second = getValue(
          b,
          sortDescriptor.column as keyof PlayersTableType,
        );

        const normalizeTeamName = (name: string) => {
          return name.toLowerCase().replace(/^\d+\s*/, "");
        };

        const normalizedFirst = first ? normalizeTeamName(String(first)) : "";
        const normalizedSecond = second
          ? normalizeTeamName(String(second))
          : "";

        const result = normalizedFirst.localeCompare(normalizedSecond);

        return sortDescriptor.direction === "ascending" ? result : -result;
      });
  }, [playersList, sortDescriptor, regionTab]);

  const onSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };

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

  const tableHeaders: {
    columnName: string;
    sortBy: string;
    sortable: boolean;
  }[] = [
    { columnName: "Player", sortBy: "ign", sortable: true },
    { columnName: "Role", sortBy: "role", sortable: true },
    { columnName: "Team", sortBy: "teams.name", sortable: true },
    { columnName: "Country", sortBy: "country", sortable: true },
  ];

  return (
    <section>
      <h1 className={title()}>Players</h1>
      <Tabs
        className="mt-4 flex justify-center"
        classNames={{ tabList: "gap-0 lg:gap-2", tab: "max-w-fit h-max" }}
        onSelectionChange={(key) => {
          setRegionTab(String(key));
        }}
      >
        {regionTabs.map((tab) => (
          <Tab
            key={tab.region}
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
            <div className="mt-6">
              <Table
                aria-label="Players"
                sortDescriptor={sortDescriptor}
                onSortChange={onSortChange}
              >
                <TableHeader>
                  {tableHeaders.map((header) => (
                    <TableColumn
                      key={header.sortBy}
                      allowsSorting={header.sortable}
                    >
                      {header.columnName}
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody isLoading={isLoading} items={sortedPlayers}>
                  {(player) => (
                    <TableRow key={player.id}>
                      <TableCell className="whitespace-nowrap">
                        <User
                          avatarProps={{
                            src: player.profile_picture_url,
                            isBordered: player.role === "IGL",
                            color:
                              player.role === "IGL" ? "primary" : "default",
                            classNames: {
                              base: "bg-[#ffffff]",
                            },
                          }}
                          description={player.name}
                          name={player.ign}
                        />
                      </TableCell>

                      <TableCell>{player.role}</TableCell>

                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Image
                            alt={player.teams.name}
                            className="light:bg-[#000000]"
                            classNames={{
                              img: "min-w-8 min-h-8 rounded-none",
                            }}
                            height={32}
                            src={player.teams.logo_url}
                            width={32}
                          />
                          {player.teams.name}
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        {player.country}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Tab>
        ))}
      </Tabs>
    </section>
  );
};

export default PlayersPage;
