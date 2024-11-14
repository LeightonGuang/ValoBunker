"use client";

import { useEffect, useState, useMemo } from "react";
import { Image, User } from "@nextui-org/react";
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
        setPlayersList(data || []);
      }
      setIsLoading(false);

      console.log(data);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllPlayers();
  }, []);

  const sortedPlayers = useMemo(() => {
    return [...playersList].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof PlayersTableType];
      const second = b[sortDescriptor.column as keyof PlayersTableType];

      // Function to normalize team names for sorting
      const normalizeTeamName = (name: string) => {
        // Convert to lowercase and remove leading numbers
        return name.toLowerCase().replace(/^\d+\s*/, "");
      };

      const normalizedFirst = normalizeTeamName(String(first));
      const normalizedSecond = normalizeTeamName(String(second));

      const result = normalizedFirst.localeCompare(normalizedSecond);

      return sortDescriptor.direction === "ascending" ? result : -result;
    });
  }, [playersList, sortDescriptor]);

  const onSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };

  const tableHeaders = [
    { columnName: "Player", sortBy: "ign", sortable: true },
    { columnName: "Role", sortBy: "role", sortable: true },
    { columnName: "Team", sortBy: "teams.name", sortable: true },
    { columnName: "Country", sortBy: "country", sortable: true },
  ];

  return (
    <section>
      <h1 className={title()}>Players</h1>
      <div className="mt-6">
        <Table
          aria-label="Players"
          sortDescriptor={sortDescriptor}
          onSortChange={onSortChange}
        >
          <TableHeader>
            {tableHeaders.map((header) => (
              <TableColumn key={header.sortBy} allowsSorting={header.sortable}>
                {header.columnName}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody isLoading={isLoading} items={sortedPlayers}>
            {(player) => (
              <TableRow key={player.id}>
                <TableCell className="whitespace-nowrap">
                  <User
                    avatarProps={{ src: player.profile_picture_url }}
                    description={player.name}
                    name={player.ign}
                  />
                </TableCell>
                <TableCell>{player.role}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Image
                      alt={player.teams.name}
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
    </section>
  );
};

export default PlayersPage;
